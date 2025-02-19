import { CanvasGrid } from "./canvas-grid";
import { PixelArtCanvas } from "./schema";
import { CellKey, ColorHSL } from "./types";

export const lerp = (a: number, b: number, n: number): number =>
  (1 - n) * a + n * b;

export const clamp = (min: number, max: number) => (n: number) =>
  Math.min(Math.max(min, n), max);

export const toCellKey = (x: number, y: number): CellKey => `${x}-${y}`;

export const fromCellKey = (cellKey: CellKey): [x: number, y: number] => {
  const [x, y] = cellKey.split("-");
  return [Number(x), Number(y)];
};

export const eqColor = (c1: ColorHSL, c2: ColorHSL): boolean =>
  c1[0] === c2[0] && c1[1] === c2[1] && c1[2] === c2[2];

export const canvasGridToSchema = (
  name: string,
  canvasGrid: CanvasGrid
): PixelArtCanvas => ({
  name,
  pixelHeight: canvasGrid.pixelHeight,
  pixelWidth: canvasGrid.pixelWidth,
  cells: Array.from(canvasGrid.cells.entries()).map(([cellKey, cellValue]) => {
    const [x, y] = fromCellKey(cellKey);
    return { x, y, color: cellValue.color };
  }),
});

export const canvasSchemaToGrid = (data: PixelArtCanvas): CanvasGrid => {
  const canvasGrid = new CanvasGrid({
    pixelHeight: data.pixelHeight,
    pixelWidth: data.pixelWidth,
  });
  const cells: Map<CellKey, { color: ColorHSL }> = new Map();
  data.cells.forEach((cell) => {
    cells.set(toCellKey(cell.x, cell.y), { color: [...cell.color] });
  });
  canvasGrid.cells = cells;
  return canvasGrid;
};
