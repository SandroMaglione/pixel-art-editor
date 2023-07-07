export type CellKey = `${number}-${number}`;
export type EditorMode = "color" | "picker" | "erase" | "fill" | "swap-color";
export type EditorAction = "centering" | "resize" | "save";
export type ColorHSL = [hue: number, saturation: number, lightness: number];
