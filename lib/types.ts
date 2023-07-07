export type CellKey = `${number}-${number}`;
export type EditorMode = "color" | "picker" | "erase" | "fill" | "swap-color";
export type EditorAction = "centering" | "resize" | "save" | "undo";
export type ColorHSL = [hue: number, saturation: number, lightness: number];

export type CanvasGridAction =
  | { _tag: "change-size"; value: { x: number; y: number } }
  | {
      _tag: "draw";
      value: {
        touchX: number;
        touchY: number;
        color: ColorHSL;
        mode: EditorMode;
        onColorPick: (color: ColorHSL) => void;
      };
    };
