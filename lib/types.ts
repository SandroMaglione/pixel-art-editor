import type { ColorHSL, ColorPercentage } from "./schema";

export type CellKey = `${number}-${number}`;
export type EditorMode = "color" | "picker" | "erase" | "fill" | "swap-color";
export type EditorAction = "centering" | "resize" | "save" | "undo";

export type CanvasGridAction = {
  _tag: "draw";
  value: {
    touchX: number;
    touchY: number;
    color: ColorHSL;
    mode: EditorMode;
    onColorPick: (color: ColorPercentage) => void;
  };
};
