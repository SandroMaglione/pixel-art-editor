"use client";

import { useState } from "react";

/**
 * This is our Linear Interpolation method. It takes 3 parameters:
 * a: The starting value
 * b: The destination value
 * n: The normal value (between 0 and 1) to control the Linear Interpolation
 */
const lerp = (a: number, b: number, n: number): number => (1 - n) * a + n * b;
const clamp = (min: number, max: number) => (n: number) =>
  Math.min(Math.max(min, n), max);

const COLOR_SELECTOR_SIZE = 256;
const clampSelection = clamp(0, COLOR_SELECTOR_SIZE);

type ColorHSL = [hue: number, saturation: number, lightness: number];

export default function Home() {
  const [width, setWidth] = useState<number>(0);
  const [size, setSize] = useState<{ w: number; h: number }>({ h: 16, w: 16 });
  const cellSize = width / size.w;

  const [color, setColor] = useState<ColorHSL>([240, 45, 60]);
  const [canvasGrid, setCanvasGrid] = useState<ColorHSL[][]>([]);
  const [isClicking, setIsClicking] = useState(false);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selection, setSelection] = useState<{ x: number; y: number }>({
    x: 0,
    y: 0,
  });
  const [isHue, setIsHue] = useState(false);
  const [hue, setHue] = useState<number>(0);

  const changeCellColor = (xCell: number, yCell: number) => {
    setCanvasGrid((grid) =>
      grid.map((r, x) =>
        r.map((cColor, y) => (x === xCell && y === yCell ? color : cColor))
      )
    );
  };

  return (
    <main>
      <h1>Pixel art editor</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setCanvasGrid(
            Array.from({ length: size.w }).map(() =>
              Array.from({ length: size.h }).map(() => [0, 0, 0])
            )
          );
        }}
      >
        <input
          type="number"
          min={1}
          max={256}
          step={1}
          value={size.w}
          onChange={(e) =>
            setSize((s) => ({ ...s, w: e.target.valueAsNumber }))
          }
        />
        <input
          type="number"
          min={1}
          max={256}
          step={1}
          value={size.h}
          onChange={(e) =>
            setSize((s) => ({ ...s, h: e.target.valueAsNumber }))
          }
        />
        <button type="submit">Set</button>
      </form>

      <div className="flex flex-col space-y-8 overflow-hidden">
        <div
          className="bg-white grid w-1/4"
          style={{
            gridTemplateColumns: `repeat(${size.w}, minmax(0, 1fr))`,
          }}
        >
          {canvasGrid.map((r, x) =>
            r.map((color, y) => (
              <span
                key={`${x}-${y}`}
                className="aspect-square"
                style={{
                  backgroundColor: `hsl(${color[0]}deg ${color[1]}% ${color[2]}%)`,
                }}
              />
            ))
          )}
        </div>

        <div
          onTouchStart={() => setIsClicking(true)}
          onTouchEnd={() => setIsClicking(false)}
          onTouchMove={(touchEvent) => {
            if (isClicking) {
              const currentElementTouched = document.elementFromPoint(
                touchEvent.touches[0].clientX,
                touchEvent.touches[0].clientY
              );

              if (currentElementTouched !== null) {
                const coordinates = currentElementTouched.id.split("-");
                const x = Number(coordinates[0]);
                const y = Number(coordinates[1]);
                changeCellColor(x, y);
              }
            }
          }}
          className="bg-white grid w-screen"
          style={{
            gridTemplateColumns: `repeat(${size.w}, minmax(0, 1fr))`,
          }}
        >
          {canvasGrid.map((r, x) =>
            r.map((color, y) => (
              <span
                key={`${x}-${y}`}
                id={`${x}-${y}`}
                className="aspect-square"
                style={{
                  backgroundColor: `hsl(${color[0]}deg ${color[1]}% ${color[2]}%)`,
                }}
              />
            ))
          )}
        </div>
      </div>

      <div>
        <div
          onTouchStart={() => setIsSelecting(true)}
          onTouchEnd={() => setIsSelecting(true)}
          onTouchMove={(e) => {
            if (isSelecting) {
              const { top, left } = e.currentTarget.getBoundingClientRect();
              setSelection({
                x: clampSelection(e.touches[0].clientX - left),
                y: clampSelection(e.touches[0].clientY - top),
              });
            }
          }}
          className="select-none touch-none relative"
          style={
            {
              width: `${COLOR_SELECTOR_SIZE}px`,
              height: `${COLOR_SELECTOR_SIZE}px`,
              "--hue": `${hue}deg`,
            } as React.CSSProperties
          }
        >
          <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_top,rgb(0,0,0),rgb(255,255,255))]" />
          <div className="absolute mix-blend-overlay inset-0 w-full h-full bg-[linear-gradient(to_right,hsl(var(--hue)100%50%/0),hsl(var(--hue)100%50%/1))]" />

          <button
            style={
              {
                "--x": `${selection.x}px`,
                "--y": `${selection.y}px`,
              } as React.CSSProperties
            }
            className="absolute top-0 left-0 w-[24px] h-[24px] border-2 border-black rounded-full origin-center cursor-grab select-none transform translate-x-[calc(-50%+var(--x))] translate-y-[calc(-50%+var(--y))]"
          />
        </div>
        <div
          onTouchStart={() => setIsHue(true)}
          onTouchEnd={() => setIsHue(true)}
          onTouchMove={(e) => {
            if (isHue) {
              const { left, width } = e.currentTarget.getBoundingClientRect();
              setHue(
                clamp(
                  0,
                  365
                )(lerp(0, 365, (e.touches[0].clientX - left) / width))
              );
            }
          }}
          className="w-full h-[24px] relative"
          style={
            {
              "--x": `${hue}px`,
              background:
                "linear-gradient(to right, rgb(255, 0, 0), rgb(255, 17, 0), rgb(255, 34, 0), rgb(255, 51, 0), rgb(255, 68, 0), rgb(255, 85, 0), rgb(255, 102, 0), rgb(255, 119, 0), rgb(255, 136, 0), rgb(255, 153, 0), rgb(255, 170, 0), rgb(255, 187, 0), rgb(255, 204, 0), rgb(255, 221, 0), rgb(255, 238, 0), rgb(255, 255, 0), rgb(238, 255, 0), rgb(221, 255, 0), rgb(204, 255, 0), rgb(187, 255, 0), rgb(170, 255, 0), rgb(153, 255, 0), rgb(136, 255, 0), rgb(119, 255, 0), rgb(102, 255, 0), rgb(85, 255, 0), rgb(68, 255, 0), rgb(51, 255, 0), rgb(34, 255, 0), rgb(17, 255, 0), rgb(0, 255, 0), rgb(0, 255, 17), rgb(0, 255, 34), rgb(0, 255, 51), rgb(0, 255, 68), rgb(0, 255, 85), rgb(0, 255, 102), rgb(0, 255, 119), rgb(0, 255, 136), rgb(0, 255, 153), rgb(0, 255, 170), rgb(0, 255, 187), rgb(0, 255, 204), rgb(0, 255, 221), rgb(0, 255, 238), rgb(0, 255, 255), rgb(0, 238, 255), rgb(0, 221, 255), rgb(0, 204, 255), rgb(0, 187, 255), rgb(0, 170, 255), rgb(0, 153, 255), rgb(0, 136, 255), rgb(0, 119, 255), rgb(0, 102, 255), rgb(0, 85, 255), rgb(0, 68, 255), rgb(0, 51, 255), rgb(0, 34, 255), rgb(0, 17, 255), rgb(0, 0, 255), rgb(17, 0, 255), rgb(34, 0, 255), rgb(51, 0, 255), rgb(68, 0, 255), rgb(85, 0, 255), rgb(102, 0, 255), rgb(119, 0, 255), rgb(136, 0, 255), rgb(153, 0, 255), rgb(170, 0, 255), rgb(187, 0, 255), rgb(204, 0, 255), rgb(221, 0, 255), rgb(238, 0, 255), rgb(255, 0, 255), rgb(255, 0, 238), rgb(255, 0, 221), rgb(255, 0, 204), rgb(255, 0, 187), rgb(255, 0, 170), rgb(255, 0, 153), rgb(255, 0, 136), rgb(255, 0, 119), rgb(255, 0, 102), rgb(255, 0, 85), rgb(255, 0, 68), rgb(255, 0, 51), rgb(255, 0, 34), rgb(255, 0, 17))",
            } as React.CSSProperties
          }
        >
          <button className="absolute w-[12px] rounded-full h-[12px] border-2 border-black left-0 top-[6px] translate-x-[var(--x)]" />
        </div>
        <div
          style={
            {
              "--hue": `${hue}deg`,
              "--sat": `${(selection.x / COLOR_SELECTOR_SIZE) * 100}%`,
              "--lig": `${(1 - selection.y / COLOR_SELECTOR_SIZE) * 100}%`,
            } as React.CSSProperties
          }
          className="bg-[hsl(var(--hue),var(--sat),var(--lig))] w-[60px] h-[60px]"
        />
      </div>
    </main>
  );
}
