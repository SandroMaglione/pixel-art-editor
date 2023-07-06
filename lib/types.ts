export type CellKey = `${number}-${number}`;
export type EditorMode =
  | "color"
  | "picker"
  | "erase"
  | "fill"
  | "swap-color"
  | "centering";
export type ColorHSL = [hue: number, saturation: number, lightness: number];
