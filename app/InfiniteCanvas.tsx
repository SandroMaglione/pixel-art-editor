import { CanvasGrid } from "@/lib/canvas-grid";
import { ColorHSL, EditorMode } from "@/lib/types";
import { ReactElement, useEffect, useRef } from "react";

interface InfiniteCanvasProps {
  pixelWidth: number;
  pixelHeight: number;
  color: ColorHSL;
  mode: EditorMode;
  onColorPick: (color: ColorHSL) => void;
}

export default function InfiniteCanvas({
  pixelHeight,
  pixelWidth,
  color,
  mode,
  onColorPick,
}: InfiniteCanvasProps): ReactElement {
  const canvasGridRef = useRef<CanvasGrid | null>(null);

  const onTouchDraw = (event: React.TouchEvent<HTMLCanvasElement>) => {
    const canvasGrid = canvasGridRef.current!;

    // get first touch coordinates
    const touch0X = event.touches[0].pageX;
    const touch0Y = event.touches[0].pageY;

    const prevTouch0X = canvasGrid.prevTouch[0]!.pageX;
    const prevTouch0Y = canvasGrid.prevTouch[0]!.pageY;

    if (canvasGrid.touchMode === "single") {
      canvasGrid.addCellAt(touch0X, touch0Y, color, mode, onColorPick);
      canvasGrid.draw();
    } else if (canvasGrid.touchMode === "double") {
      // get second touch coordinates
      const touch1X = event.touches[1].pageX;
      const touch1Y = event.touches[1].pageY;

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
      var zoomRatioX = midX / canvasGrid.canvas.clientWidth;
      var zoomRatioY = midY / canvasGrid.canvas.clientHeight;

      // calculate the amounts zoomed from each edge of the screen
      const unitsZoomedX = canvasGrid.trueWidth() * scaleAmount;
      const unitsZoomedY = canvasGrid.trueHeight() * scaleAmount;

      const unitsAddLeft = unitsZoomedX * zoomRatioX;
      const unitsAddTop = unitsZoomedY * zoomRatioY;

      canvasGrid.offsetX += unitsAddLeft;
      canvasGrid.offsetY += unitsAddTop;

      canvasGrid.draw();
    }

    canvasGrid.prevTouch[0] = event.touches[0];
    canvasGrid.prevTouch[1] = event.touches[1];
  };

  useEffect(() => {
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
  }, []);

  useEffect(() => {
    const cg = new CanvasGrid({ pixelHeight, pixelWidth });
    cg.draw();
    canvasGridRef.current = cg;
  }, [pixelHeight, pixelWidth]);

  return (
    <div className="touch-none select-none fixed inset-0 w-full h-full">
      <canvas
        id="canvas"
        className="bg-gray-100"
        onTouchStart={(event) => {
          const canvasGrid = canvasGridRef.current!;
          if (event.touches.length == 1) {
            canvasGrid.touchMode = "single";
          } else if (event.touches.length >= 2) {
            canvasGrid.touchMode = "double";
          }

          // store the last touches
          canvasGrid.prevTouch[0] = event.touches[0];
          canvasGrid.prevTouch[1] = event.touches[1];

          onTouchDraw(event);
        }}
        onTouchMove={onTouchDraw}
      ></canvas>
    </div>
  );
}
