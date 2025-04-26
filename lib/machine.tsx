import { useActorRef, useSelector } from "@xstate/react";
import { fromStore } from "@xstate/store";
import { createContext, use } from "react";
import { assign, setup, type ActorRefFrom } from "xstate";
import type { CanvasGrid } from "./canvas-grid";
import { db } from "./db";
import { canvasGridToSchema, canvasSchemaToGrid } from "./helpers";
import { ColorHSL, type ColorPercentage, type PixelArtCanvas } from "./schema";
import type { CanvasGridAction, EditorMode } from "./types";

const modeStore = fromStore({
  context: { mode: "color" } as { mode: EditorMode },
  on: {
    mode: (context, event: { value: EditorMode }) => ({
      ...context,
      mode: event.value,
    }),
  },
});

const colorStore = fromStore({
  context: { color: ColorHSL.build(0, 0, 0) },
  on: {
    update: (
      context,
      event: {
        value: typeof ColorPercentage.Type;
      }
    ) => ({
      ...context,
      color: event.value.toHSL,
    }),
  },
});

export const machine = setup({
  types: {
    input: {} as { pixelArtCanvas: PixelArtCanvas; name: string },
    context: {} as {
      canvasGrid: CanvasGrid;
      name: string;
      history: readonly PixelArtCanvas[];
    },
    children: {} as {
      color: "color";
      mode: "mode";
    },
    events: {} as
      | { type: "execute"; action: CanvasGridAction }
      | { type: "undo" }
      | { type: "centering" }
      | { type: "resize.init" }
      | { type: "resize.update"; value: { x: number; y: number } }
      | { type: "resize.close" },
  },
  actors: {
    color: colorStore,
    mode: modeStore,
  },
}).createMachine({
  context: ({ input }) => ({
    canvasGrid: canvasSchemaToGrid(input.pixelArtCanvas),
    name: input.name,
    history: [],
  }),
  initial: "Idle",
  states: {
    Idle: {
      on: {
        execute: {
          actions: assign(({ context, event }) => {
            const isChanged = context.canvasGrid.execute(event.action);
            const updated = canvasGridToSchema(
              context.name,
              context.canvasGrid
            );
            db.file.put(updated);
            return {
              history: isChanged ? [...context.history, updated] : undefined,
            };
          }),
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
        "resize.init": { target: "Resizing" },
      },
    },
    Resizing: {
      on: {
        "resize.close": { target: "Idle" },
        "resize.update": {
          target: "Idle",
        },
      },
    },
  },
});

export const MachineContext = createContext<ActorRefFrom<typeof machine>>(
  null!
);

export const MachineProvider = ({
  children,
  pixelArtCanvas,
  name,
}: {
  children: React.ReactNode;
  pixelArtCanvas: PixelArtCanvas;
  name: string;
}) => {
  const actor = useActorRef(machine, {
    input: { pixelArtCanvas, name },
  });
  return (
    <MachineContext.Provider value={actor}>{children}</MachineContext.Provider>
  );
};

export const useEditorMachine = () => {
  const actorRef = use(MachineContext);
  return actorRef;
};

export const useColorActor = () => {
  const actorRef = useEditorMachine();
  const colorActor = useSelector(
    actorRef,
    (snapshot) => snapshot.children.color
  );

  if (!colorActor) {
    throw new Error("Color actor not found");
  }

  return colorActor;
};

export const useModeActor = () => {
  const actorRef = useEditorMachine();
  const modeActor = useSelector(actorRef, (snapshot) => snapshot.children.mode);

  if (!modeActor) {
    throw new Error("Mode actor not found");
  }

  return modeActor;
};
