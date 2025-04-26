import { assign, setup, type ActorRefFrom, type AnyActorRef } from "xstate";
import type { CanvasGrid } from "./canvas-grid";
import { db } from "./db";
import { canvasGridToSchema, canvasSchemaToGrid } from "./helpers";
import { ColorHSL, type ColorPercentage, type PixelArtCanvas } from "./schema";
import type { EditorMode } from "./types";

interface DoubleTouchEvent {
  type: "move";
  midX: number;
  midY: number;
  scaleAmount: number;
  panX: number;
  panY: number;
  zoomAmount: number;
}

interface SingleTouchEvent {
  type: "draw";
  touchX: number;
  touchY: number;
}

const infiniteCanvasMachine = setup({
  types: {
    input: {} as {
      parent: AnyActorRef;
    },
    context: {} as {
      touchMode: "single" | "double";
      prevTouch: [React.Touch | null, React.Touch | null];
      parent: AnyActorRef;
    },
    events: {} as
      | { type: "touch.start"; event: React.TouchEvent<HTMLCanvasElement> }
      | { type: "touch.move"; event: React.TouchEvent<HTMLCanvasElement> },
  },
}).createMachine({
  context: ({ input }) => ({
    touchMode: "single",
    prevTouch: [null, null],
    parent: input.parent,
  }),
  initial: "Idle",
  states: {
    Idle: {
      on: {
        "touch.move": {
          actions: assign(({ context, event: { event } }) => {
            // get first touch coordinates
            const touch0X = event.touches[0]?.pageX ?? 0;
            const touch0Y = event.touches[0]?.pageY ?? 0;

            const prevTouch0X = context.prevTouch[0]!.pageX;
            const prevTouch0Y = context.prevTouch[0]!.pageY;

            if (context.touchMode === "single") {
              context.parent.send({
                type: "draw",
                touchX: touch0X,
                touchY: touch0Y,
              } satisfies SingleTouchEvent);
            } else if (context.touchMode === "double") {
              // get second touch coordinates
              const touch1X = event.touches[1]?.pageX ?? 0;
              const touch1Y = event.touches[1]?.pageY ?? 0;

              const prevTouch1X = context.prevTouch[1]!.pageX;
              const prevTouch1Y = context.prevTouch[1]!.pageY;

              // get midpoints
              const midX = (touch0X + touch1X) / 2;
              const midY = (touch0Y + touch1Y) / 2;
              const prevMidX = (prevTouch0X + prevTouch1X) / 2;
              const prevMidY = (prevTouch0Y + prevTouch1Y) / 2;

              // calculate the distances between the touches
              const hypot = Math.sqrt(
                Math.pow(touch0X - touch1X, 2) + Math.pow(touch0Y - touch1Y, 2)
              );
              const prevHypot = Math.sqrt(
                Math.pow(prevTouch0X - prevTouch1X, 2) +
                  Math.pow(prevTouch0Y - prevTouch1Y, 2)
              );

              // calculate the screen scale change
              const zoomAmount = hypot / prevHypot;

              const scaleAmount = 1 - zoomAmount;

              // calculate how many pixels the midpoints have moved in the x and y direction
              const panX = midX - prevMidX;
              const panY = midY - prevMidY;

              context.parent.send({
                type: "move",
                midX,
                midY,
                scaleAmount,
                panX,
                panY,
                zoomAmount,
              } satisfies DoubleTouchEvent);
            }

            return {
              prevTouch: [event.touches[0] ?? null, event.touches[1] ?? null],
            };
          }),
        },
        "touch.start": {
          actions: assign(({ event: { event } }) => ({
            prevTouch: [event.touches[0] ?? null, event.touches[1] ?? null],
            touchMode: event.touches.length == 1 ? "single" : "double",
          })),
        },
      },
    },
  },
});

export const machine = setup({
  types: {
    input: {} as { pixelArtCanvas: PixelArtCanvas; name: string },
    context: {} as {
      canvasGrid: CanvasGrid;
      name: string;
      history: readonly PixelArtCanvas[];
      infiniteCanvas: ActorRefFrom<typeof infiniteCanvasMachine>;
      mode: EditorMode;
      color: ColorHSL;
    },
    events: {} as
      | SingleTouchEvent
      | DoubleTouchEvent
      | { type: "color.update"; value: ColorPercentage }
      | { type: "mode.update"; value: EditorMode }
      | { type: "undo" }
      | { type: "centering" }
      | { type: "resize.init" }
      | { type: "resize.update"; value: { x: number; y: number } }
      | { type: "resize.close" },
  },
  actors: {
    infiniteCanvas: infiniteCanvasMachine,
  },
}).createMachine({
  context: ({ input, spawn, self }) => ({
    canvasGrid: canvasSchemaToGrid(input.pixelArtCanvas),
    name: input.name,
    history: [],
    mode: "color",
    color: ColorHSL.build(0, 0, 0),
    infiniteCanvas: spawn(infiniteCanvasMachine, {
      input: { parent: self },
    }),
  }),
  initial: "Idle",
  states: {
    Idle: {
      entry: ({ context }) => {
        context.canvasGrid.init();
      },
      on: {
        move: {
          actions: ({ context, event }) => {
            // Get the relative position of the middle of the zoom.
            // 0, 0 would be top left.
            // 0, 1 would be top right etc.
            const zoomRatioX =
              event.midX / (context.canvasGrid.canvas?.clientWidth ?? 1);
            const zoomRatioY =
              event.midY / (context.canvasGrid.canvas?.clientHeight ?? 1);

            // calculate the amounts zoomed from each edge of the screen
            const unitsZoomedX =
              context.canvasGrid.trueWidth() * event.scaleAmount;
            const unitsZoomedY =
              context.canvasGrid.trueHeight() * event.scaleAmount;

            const unitsAddLeft = unitsZoomedX * zoomRatioX;
            const unitsAddTop = unitsZoomedY * zoomRatioY;

            // scale this movement based on the zoom level
            context.canvasGrid.offsetX += event.panX / context.canvasGrid.scale;
            context.canvasGrid.offsetY += event.panY / context.canvasGrid.scale;

            context.canvasGrid.offsetX += unitsAddLeft;
            context.canvasGrid.offsetY += unitsAddTop;

            context.canvasGrid.zoom(event.zoomAmount);
            context.canvasGrid.draw();
          },
        },
        draw: {
          actions: ({ context, event, self }) => {
            context.canvasGrid.addCellAt({
              touchX: event.touchX,
              touchY: event.touchY,
              mode: context.mode,
              color: context.color,
              onColorPick: (color) => {
                self.send({ type: "color.update", value: color });
              },
            });
          },
        },
        undo: {
          actions: assign(({ context }) => {
            if (context.history.length > 1) {
              const value = context.history[context.history.length - 2];

              if (value) {
                context.canvasGrid.undo(value);
                const updated = canvasGridToSchema(
                  context.name,
                  context.canvasGrid
                );
                db.file.put(updated);

                return {
                  history: context.history.slice(0, context.history.length - 1),
                };
              }
            }

            return {};
          }),
        },
        centering: {
          actions: ({ context }) => {
            context.canvasGrid.recenter();
          },
        },
        "color.update": {
          actions: assign(({ event }) => ({ color: event.value.toHSL })),
        },
        "mode.update": {
          actions: assign(({ event }) => ({ mode: event.value })),
        },
        "resize.init": { target: "Resizing" },
      },
    },
    Resizing: {
      on: {
        "resize.close": { target: "Idle" },
        "resize.update": {
          target: "Idle",
          actions: ({ context, event }) => {
            context.canvasGrid.resize(event.value);
          },
        },
      },
    },
  },
});
