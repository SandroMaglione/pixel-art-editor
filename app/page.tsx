"use client";

import { CanvasGrid } from "@/lib/canvas-grid";
import { lerp } from "@/lib/helpers";
import { ColorHSL, EditorMode } from "@/lib/types";
import { useRef, useState } from "react";
import ActionButton from "./ActionButton";
import ColorPickerBar from "./ColorPickerBar";
import InfiniteCanvas from "./InfiniteCanvas";
import ModeButton from "./ModeButton";

export default function Home() {
  const canvasGridRef = useRef<CanvasGrid>(
    new CanvasGrid({ pixelHeight: 16, pixelWidth: 16 })
  );
  const [color, setColor] = useState<[number, number, number]>([0, 1, 0.5]);
  const [mode, setMode] = useState<EditorMode>("color");
  const colorHSL: ColorHSL = [
    lerp(0, 365, color[0]),
    lerp(0, 100, color[1]),
    lerp(0, 100, color[2]),
  ];

  const setHue = (v: number) => setColor((c) => [v, c[1], c[2]]);
  const setSaturation = (v: number) => setColor((c) => [c[0], v, c[2]]);
  const setLightness = (v: number) => setColor((c) => [c[0], c[1], v]);

  return (
    <main className="absolute inset-0 overflow-hidden flex flex-col">
      <InfiniteCanvas
        canvasGrid={canvasGridRef.current}
        color={colorHSL}
        mode={mode}
        onColorPick={(pickedColor) =>
          setColor([
            lerp(0, 1, pickedColor[0] / 365),
            lerp(0, 1, pickedColor[1] / 100),
            lerp(0, 1, pickedColor[2] / 100),
          ])
        }
      />

      <div className="fixed bottom-0 inset-x-0 px-4 pb-4">
        <div className="flex items-center justify-between mb-1">
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
                className="w-4 h-4"
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
                className="w-4 h-4"
              >
                <path d="m2 22 1-1h3l9-9" />
                <path d="M3 21v-3l9-9" />
                <path d="m15 6 3.4-3.4a2.1 2.1 0 1 1 3 3L18 9l.4.4a2.1 2.1 0 1 1-3 3l-3.8-3.8a2.1 2.1 0 1 1 3-3l.4.4Z" />
              </svg>
            </ModeButton>
            <ModeButton mode="erase" onClick={setMode} currentMode={mode}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="m7 21-4.3-4.3c-1-1-1-2.5 0-3.4l9.6-9.6c1-1 2.5-1 3.4 0l5.6 5.6c1 1 1 2.5 0 3.4L13 21" />
                <path d="M22 21H7" />
                <path d="m5 11 9 9" />
              </svg>
            </ModeButton>
            <ModeButton mode="fill" onClick={setMode} currentMode={mode}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="m19 11-8-8-8.6 8.6a2 2 0 0 0 0 2.8l5.2 5.2c.8.8 2 .8 2.8 0L19 11Z" />
                <path d="m5 2 5 5" />
                <path d="M2 13h15" />
                <path d="M22 20a2 2 0 1 1-4 0c0-1.6 1.7-2.4 2-4 .3 1.6 2 2.4 2 4Z" />
              </svg>
            </ModeButton>
            <ModeButton mode="swap-color" onClick={setMode} currentMode={mode}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <path d="M14 4c0-1.1.9-2 2-2" />
                <path d="M20 2c1.1 0 2 .9 2 2" />
                <path d="M22 8c0 1.1-.9 2-2 2" />
                <path d="M16 10c-1.1 0-2-.9-2-2" />
                <path d="m3 7 3 3 3-3" />
                <path d="M6 10V5c0-1.7 1.3-3 3-3h1" />
                <rect width="8" height="8" x="2" y="14" rx="2" />
              </svg>
            </ModeButton>
          </div>
          <div className="flex justify-end">
            <ActionButton
              action="centering"
              onClick={() => canvasGridRef.current.recenter()}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-4 h-4"
              >
                <rect width="6" height="10" x="9" y="7" rx="2" />
                <path d="M4 22V2" />
                <path d="M20 22V2" />
              </svg>
            </ActionButton>
          </div>
        </div>

        <div
          style={
            {
              "--hue": `${colorHSL[0]}deg`,
              "--sat": `${colorHSL[1]}%`,
              "--lig": `${colorHSL[2]}%`,
            } as React.CSSProperties
          }
          className="bg-[hsl(var(--hue),var(--sat),var(--lig))] w-full h-[16px] border-2 border-white mb-1"
        />

        <ColorPickerBar
          style={{
            background:
              "linear-gradient(to right, rgb(255, 0, 0), rgb(255, 17, 0), rgb(255, 34, 0), rgb(255, 51, 0), rgb(255, 68, 0), rgb(255, 85, 0), rgb(255, 102, 0), rgb(255, 119, 0), rgb(255, 136, 0), rgb(255, 153, 0), rgb(255, 170, 0), rgb(255, 187, 0), rgb(255, 204, 0), rgb(255, 221, 0), rgb(255, 238, 0), rgb(255, 255, 0), rgb(238, 255, 0), rgb(221, 255, 0), rgb(204, 255, 0), rgb(187, 255, 0), rgb(170, 255, 0), rgb(153, 255, 0), rgb(136, 255, 0), rgb(119, 255, 0), rgb(102, 255, 0), rgb(85, 255, 0), rgb(68, 255, 0), rgb(51, 255, 0), rgb(34, 255, 0), rgb(17, 255, 0), rgb(0, 255, 0), rgb(0, 255, 17), rgb(0, 255, 34), rgb(0, 255, 51), rgb(0, 255, 68), rgb(0, 255, 85), rgb(0, 255, 102), rgb(0, 255, 119), rgb(0, 255, 136), rgb(0, 255, 153), rgb(0, 255, 170), rgb(0, 255, 187), rgb(0, 255, 204), rgb(0, 255, 221), rgb(0, 255, 238), rgb(0, 255, 255), rgb(0, 238, 255), rgb(0, 221, 255), rgb(0, 204, 255), rgb(0, 187, 255), rgb(0, 170, 255), rgb(0, 153, 255), rgb(0, 136, 255), rgb(0, 119, 255), rgb(0, 102, 255), rgb(0, 85, 255), rgb(0, 68, 255), rgb(0, 51, 255), rgb(0, 34, 255), rgb(0, 17, 255), rgb(0, 0, 255), rgb(17, 0, 255), rgb(34, 0, 255), rgb(51, 0, 255), rgb(68, 0, 255), rgb(85, 0, 255), rgb(102, 0, 255), rgb(119, 0, 255), rgb(136, 0, 255), rgb(153, 0, 255), rgb(170, 0, 255), rgb(187, 0, 255), rgb(204, 0, 255), rgb(221, 0, 255), rgb(238, 0, 255), rgb(255, 0, 255), rgb(255, 0, 238), rgb(255, 0, 221), rgb(255, 0, 204), rgb(255, 0, 187), rgb(255, 0, 170), rgb(255, 0, 153), rgb(255, 0, 136), rgb(255, 0, 119), rgb(255, 0, 102), rgb(255, 0, 85), rgb(255, 0, 68), rgb(255, 0, 51), rgb(255, 0, 34), rgb(255, 0, 17))",
          }}
          value={color[0]}
          onValueChange={setHue}
        />
        <ColorPickerBar
          style={
            {
              "--hue": `${color[0]}deg`,
              background:
                "linear-gradient(to right, hsl(var(--hue) 100% 50% / 0), hsl(var(--hue) 100% 50% / 1))",
            } as React.CSSProperties
          }
          value={color[1]}
          onValueChange={setSaturation}
        />
        <ColorPickerBar
          style={{
            background:
              "linear-gradient(to right, rgb(0,0,0), rgb(255,255,255))",
          }}
          value={color[2]}
          onValueChange={setLightness}
        />
      </div>
    </main>
  );
}
