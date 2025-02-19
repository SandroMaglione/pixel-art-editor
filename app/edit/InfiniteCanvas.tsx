import { CanvasGrid } from "@/lib/canvas-grid";
import { CanvasGridAction, ColorHSL, EditorMode } from "@/lib/types";
import { ReactElement, useEffect } from "react";

interface InfiniteCanvasProps {
  color: ColorHSL;
  mode: EditorMode;
  onColorPick: (color: ColorHSL) => void;
  canvasGrid: CanvasGrid;
  onExecute: (action: CanvasGridAction) => void;
}

export default function InfiniteCanvas({
  color,
  mode,
  canvasGrid,
  onColorPick,
  onExecute,
}: InfiniteCanvasProps): ReactElement {
  const onTouchDraw = (event: React.TouchEvent<HTMLCanvasElement>) => {
    // get first touch coordinates
    const touch0X = event.touches[0]?.pageX ?? 0;
    const touch0Y = event.touches[0]?.pageY ?? 0;

    const prevTouch0X = canvasGrid.prevTouch[0]!.pageX;
    const prevTouch0Y = canvasGrid.prevTouch[0]!.pageY;

    if (canvasGrid.touchMode === "single") {
      onExecute({
        _tag: "draw",
        value: { touchX: touch0X, touchY: touch0Y, color, mode, onColorPick },
      });
    } else if (canvasGrid.touchMode === "double") {
      // get second touch coordinates
      const touch1X = event.touches[1]?.pageX ?? 0;
      const touch1Y = event.touches[1]?.pageY ?? 0;

      const prevTouch1X = canvasGrid.prevTouch[1]!.pageX;
      const prevTouch1Y = canvasGrid.prevTouch[1]!.pageY;

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
      var zoomAmount = hypot / prevHypot;
      canvasGrid.zoom(zoomAmount);

      const scaleAmount = 1 - zoomAmount;

      // calculate how many pixels the midpoints have moved in the x and y direction
      const panX = midX - prevMidX;
      const panY = midY - prevMidY;

      // scale this movement based on the zoom level
      canvasGrid.offsetX += panX / canvasGrid.scale;
      canvasGrid.offsetY += panY / canvasGrid.scale;

      // Get the relative position of the middle of the zoom.
      // 0, 0 would be top left.
      // 0, 1 would be top right etc.
      var zoomRatioX = midX / (canvasGrid.canvas?.clientWidth ?? 1);
      var zoomRatioY = midY / (canvasGrid.canvas?.clientHeight ?? 1);

      // calculate the amounts zoomed from each edge of the screen
      const unitsZoomedX = canvasGrid.trueWidth() * scaleAmount;
      const unitsZoomedY = canvasGrid.trueHeight() * scaleAmount;

      const unitsAddLeft = unitsZoomedX * zoomRatioX;
      const unitsAddTop = unitsZoomedY * zoomRatioY;

      canvasGrid.offsetX += unitsAddLeft;
      canvasGrid.offsetY += unitsAddTop;

      canvasGrid.draw();
    }

    canvasGrid.prevTouch[0] = event.touches[0] ?? null;
    canvasGrid.prevTouch[1] = event.touches[1] ?? null;
  };

  const onTouchStart = (event: React.TouchEvent<HTMLCanvasElement>) => {
    if (event.touches.length == 1) {
      canvasGrid.touchMode = "single";
    } else if (event.touches.length >= 2) {
      canvasGrid.touchMode = "double";
    }

    // store the last touches
    canvasGrid.prevTouch[0] = event.touches[0] ?? null;
    canvasGrid.prevTouch[1] = event.touches[1] ?? null;

    onTouchDraw(event);
  };

  useEffect(() => {
    canvasGrid.init();

    document.addEventListener(
      "contextmenu",
      function (e) {
        e.preventDefault();
      },
      false
    );

    return () =>
      document.removeEventListener(
        "contextmenu",
        function (e) {
          e.preventDefault();
        },
        false
      );
  }, [canvasGrid]);

  return (
    <div className="touch-none select-none fixed bg-gray-50 inset-0 w-full h-full">
      <canvas
        id="canvas"
        onTouchStart={onTouchStart}
        onTouchMove={onTouchDraw}
      ></canvas>

      <canvas
        id="preview"
        className="absolute top-4 right-4 bg-gray-50 border-4 border-gray-300"
      ></canvas>
    </div>
  );
}
