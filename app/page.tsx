"use client";

import { lerp } from "@/lib/helpers";
import { EditorMode } from "@/lib/types";
import { useState } from "react";
import ColorPickerBar from "./ColorPickerBar";
import InputField from "./InputField";
import ModeButton from "./ModeButton";

type ColorHSL = [hue: number, saturation: number, lightness: number];

export default function Home() {
  const [size, setSize] = useState<{ w: number; h: number }>({ h: 16, w: 16 });
  const [canvasGrid, setCanvasGrid] = useState<ColorHSL[][]>([]);
  const [palette, setPalette] = useState<ColorHSL[]>([]);

  const [isClicking, setIsClicking] = useState(false);
  const [lightness, setLightness] = useState<number>(50);
  const [saturation, setSaturation] = useState<number>(100);
  const [hue, setHue] = useState<number>(0);
  const color: ColorHSL = [hue, saturation, lightness];

  const [mode, setMode] = useState<EditorMode>("color");

  const changeCellColor = (xCell: number, yCell: number) => {
    setCanvasGrid((grid) =>
      grid.map((r, x) =>
        r.map((cColor, y) => (x === xCell && y === yCell ? color : cColor))
      )
    );
  };

  const onColoring = (e: React.TouchEvent<HTMLDivElement>) => {
    if (mode === "color") {
      const currentElementTouched = document.elementFromPoint(
        e.touches[0].clientX,
        e.touches[0].clientY
      );

      if (currentElementTouched !== null) {
        const coordinates = currentElementTouched.id.split("-");
        const x = Number(coordinates[0]);
        const y = Number(coordinates[1]);
        changeCellColor(x, y);
      }
    }
  };

  return (
    <main className="max-w-full overflow-x-hidden">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          setCanvasGrid(
            Array.from({ length: size.w }).map(() =>
              Array.from({ length: size.h }).map(() => [0, 100, 100])
            )
          );
        }}
      >
        <InputField
          value={size.w}
          onChange={(w) => setSize((s) => ({ ...s, w }))}
        />
        <InputField
          value={size.h}
          onChange={(h) => setSize((s) => ({ ...s, h }))}
        />
        <button type="submit">Set</button>
      </form>

      <div className="flex">
        <ModeButton mode="color" onClick={setMode} currentMode={mode}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="m9.06 11.9 8.07-8.06a2.85 2.85 0 1 1 4.03 4.03l-8.06 8.08" />
            <path d="M7.07 14.94c-1.66 0-3 1.35-3 3.02 0 1.33-2.5 1.52-2 2.02 1.08 1.1 2.49 2.02 4 2.02 2.2 0 4-1.8 4-4.04a3.01 3.01 0 0 0-3-3.02z" />
          </svg>
        </ModeButton>
        <ModeButton mode="picker" onClick={setMode} currentMode={mode}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-6 h-6"
          >
            <path d="m2 22 1-1h3l9-9" />
            <path d="M3 21v-3l9-9" />
            <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z" />
          </svg>
        </ModeButton>
      </div>

      <div className="flex flex-col space-y-8 overflow-x-hidden my-4">
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
          onTouchEnd={() => setIsClicking(false)}
          onTouchStart={(e) => {
            setIsClicking(true);
            onColoring(e);
          }}
          onTouchMove={(e) => {
            if (isClicking) {
              onColoring(e);
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
                className="aspect-square border border-black/10"
                style={{
                  backgroundColor: `hsl(${color[0]}deg ${color[1]}% ${color[2]}%)`,
                }}
                onClick={() => {
                  if (mode === "picker") {
                    setHue(color[0]);
                    setSaturation(color[1]);
                    setLightness(color[2]);
                  }
                }}
              />
            ))
          )}
        </div>
      </div>

      <div>
        <ColorPickerBar
          style={{
            background:
              "linear-gradient(to right, rgb(255, 0, 0), rgb(255, 17, 0), rgb(255, 34, 0), rgb(255, 51, 0), rgb(255, 68, 0), rgb(255, 85, 0), rgb(255, 102, 0), rgb(255, 119, 0), rgb(255, 136, 0), rgb(255, 153, 0), rgb(255, 170, 0), rgb(255, 187, 0), rgb(255, 204, 0), rgb(255, 221, 0), rgb(255, 238, 0), rgb(255, 255, 0), rgb(238, 255, 0), rgb(221, 255, 0), rgb(204, 255, 0), rgb(187, 255, 0), rgb(170, 255, 0), rgb(153, 255, 0), rgb(136, 255, 0), rgb(119, 255, 0), rgb(102, 255, 0), rgb(85, 255, 0), rgb(68, 255, 0), rgb(51, 255, 0), rgb(34, 255, 0), rgb(17, 255, 0), rgb(0, 255, 0), rgb(0, 255, 17), rgb(0, 255, 34), rgb(0, 255, 51), rgb(0, 255, 68), rgb(0, 255, 85), rgb(0, 255, 102), rgb(0, 255, 119), rgb(0, 255, 136), rgb(0, 255, 153), rgb(0, 255, 170), rgb(0, 255, 187), rgb(0, 255, 204), rgb(0, 255, 221), rgb(0, 255, 238), rgb(0, 255, 255), rgb(0, 238, 255), rgb(0, 221, 255), rgb(0, 204, 255), rgb(0, 187, 255), rgb(0, 170, 255), rgb(0, 153, 255), rgb(0, 136, 255), rgb(0, 119, 255), rgb(0, 102, 255), rgb(0, 85, 255), rgb(0, 68, 255), rgb(0, 51, 255), rgb(0, 34, 255), rgb(0, 17, 255), rgb(0, 0, 255), rgb(17, 0, 255), rgb(34, 0, 255), rgb(51, 0, 255), rgb(68, 0, 255), rgb(85, 0, 255), rgb(102, 0, 255), rgb(119, 0, 255), rgb(136, 0, 255), rgb(153, 0, 255), rgb(170, 0, 255), rgb(187, 0, 255), rgb(204, 0, 255), rgb(221, 0, 255), rgb(238, 0, 255), rgb(255, 0, 255), rgb(255, 0, 238), rgb(255, 0, 221), rgb(255, 0, 204), rgb(255, 0, 187), rgb(255, 0, 170), rgb(255, 0, 153), rgb(255, 0, 136), rgb(255, 0, 119), rgb(255, 0, 102), rgb(255, 0, 85), rgb(255, 0, 68), rgb(255, 0, 51), rgb(255, 0, 34), rgb(255, 0, 17))",
          }}
          onValueChange={(percentage) => {
            setHue(lerp(0, 365, percentage));
          }}
        />
        <ColorPickerBar
          style={
            {
              "--hue": `${hue}deg`,
              background:
                "linear-gradient(to right, hsl(var(--hue) 100% 50% / 0), hsl(var(--hue) 100% 50% / 1))",
            } as React.CSSProperties
          }
          onValueChange={(percentage) => {
            setSaturation(lerp(0, 100, percentage));
          }}
        />
        <ColorPickerBar
          style={{
            background:
              "linear-gradient(to right, rgb(0,0,0), rgb(255,255,255))",
          }}
          onValueChange={(percentage) => {
            setLightness(lerp(0, 100, percentage));
          }}
        />
      </div>

      <div className="flex">
        <div
          style={
            {
              "--hue": `${hue}deg`,
              "--sat": `${saturation}%`,
              "--lig": `${lightness}%`,
            } as React.CSSProperties
          }
          className="bg-[hsl(var(--hue),var(--sat),var(--lig))] w-[60px] h-[60px]"
        />
        <button onClick={() => setPalette((l) => [color, ...palette])}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-8 h-8"
          >
            <rect width="18" height="18" x="3" y="3" rx="2" ry="2" />
            <line x1="12" x2="12" y1="8" y2="16" />
            <line x1="8" x2="16" y1="12" y2="12" />
          </svg>
        </button>
      </div>

      <div className="grid grid-cols-8">
        {palette.map((cp, i) => (
          <button
            key={i}
            className="aspect-square"
            style={{
              background: `hsl(${cp[0]}deg ${cp[1]}% ${cp[2]}%)`,
            }}
            onClick={() => {
              setHue(cp[0]);
              setSaturation(cp[1]);
              setLightness(cp[2]);
            }}
          />
        ))}
      </div>
    </main>
  );
}
