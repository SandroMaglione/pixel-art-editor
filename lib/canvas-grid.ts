import { eqColor, fromCellKey, toCellKey } from "./helpers";
import { CellKey, ColorHSL, EditorMode } from "./types";

const CELL_SIZE = 40;

export class CanvasGrid {
  scale: number = 1;
  offsetX: number = 0;
  offsetY: number = 0;

  pixelWidth: number;
  pixelHeight: number;

  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  touchMode: "single" | "double" = "single";
  prevTouch: [React.Touch | null, React.Touch | null] = [null, null];

  cells: Map<CellKey, { color: ColorHSL }> = new Map();

  constructor({
    pixelHeight,
    pixelWidth,
  }: {
    pixelWidth: number;
    pixelHeight: number;
  }) {
    this.canvas = document.getElementById("canvas")! as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d")!;

    this.pixelWidth = pixelWidth;
    this.pixelHeight = pixelHeight;

    const padding = 2;
    this.scale =
      document.body.clientWidth / (CELL_SIZE * (pixelWidth + padding * 2));
    this.offsetX += CELL_SIZE * padding;
    this.offsetY += CELL_SIZE * padding;
  }

  draw(): void {
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this._drawGrid();
    this._drawPixelArea();
    this._drawCells();
    this._drawPreview();
  }

  toScreenX(xTrue: number): number {
    return (xTrue + this.offsetX) * this.scale;
  }
  toScreenY(yTrue: number): number {
    return (yTrue + this.offsetY) * this.scale;
  }
  toTrueX(xScreen: number): number {
    return xScreen / this.scale - this.offsetX;
  }
  toTrueY(yScreen: number): number {
    return yScreen / this.scale - this.offsetY;
  }

  trueHeight(): number {
    return this.canvas.clientHeight / this.scale;
  }

  trueWidth(): number {
    return this.canvas.clientWidth / this.scale;
  }

  zoom(amount: number): void {
    this.scale *= amount;
  }

  resizeX(pixelSize: number): void {
    this.pixelWidth = pixelSize;
  }

  resizeY(pixelSize: number): void {
    this.pixelHeight = pixelSize;
  }

  addCellAt(
    touchX: number,
    touchY: number,
    color: ColorHSL,
    mode: EditorMode,
    onColorPick: (color: ColorHSL) => void
  ): void {
    // TODO: Make cells in array unique, add color to them, make searching near cells easier
    const x = Math.floor(this.toTrueX(touchX) / CELL_SIZE);
    const y = Math.floor(this.toTrueY(touchY) / CELL_SIZE);
    if (x >= 0 && y >= 0 && x < this.pixelWidth && y < this.pixelHeight) {
      const cellKey = toCellKey(x, y);
      const findCell = this.cells.get(cellKey);
      if (mode === "color" && (!findCell || !eqColor(findCell.color, color))) {
        this.cells.set(cellKey, { color });
      } else if (mode === "erase" && findCell) {
        this.cells.delete(cellKey);
      } else if (mode === "picker" && findCell) {
        onColorPick(findCell.color);
      } else if (mode === "fill") {
        this._fill(x, y, color, findCell?.color ?? null);
      }
    }
  }

  private _fill(
    x: number,
    y: number,
    newColor: ColorHSL,
    sourceColor: ColorHSL | null
  ): void {
    if (x >= 0 && x < this.pixelWidth && y >= 0 && y <= this.pixelHeight) {
      const cellKey = toCellKey(x, y);
      const findCell = this.cells.get(cellKey);
      if (!findCell || (sourceColor && eqColor(sourceColor, findCell.color))) {
        this.cells.set(cellKey, { color: newColor });
        this._fill(x - 1, y, newColor, sourceColor);
        this._fill(x + 1, y, newColor, sourceColor);
        this._fill(x, y - 1, newColor, sourceColor);
        this._fill(x, y + 1, newColor, sourceColor);
      }
    }
  }

  private _drawGrid(): void {
    this.context.strokeStyle = "rgb(229,231,235)";
    this.context.lineWidth = 1;
    this.context.beginPath();

    for (
      let x = (this.offsetX % CELL_SIZE) * this.scale;
      x <= this.trueWidth();
      x += CELL_SIZE * this.scale
    ) {
      const source = x;
      this.context.moveTo(source, 0);
      this.context.lineTo(source, this.trueHeight());
    }

    for (
      let y = (this.offsetY % CELL_SIZE) * this.scale;
      y <= this.trueHeight();
      y += CELL_SIZE * this.scale
    ) {
      const destination = y;
      this.context.moveTo(0, destination);
      this.context.lineTo(this.trueWidth(), destination);
    }
    this.context.stroke();
  }

  private _drawCells(): void {
    Array.from(this.cells.entries()).forEach(([cellKey, { color }]) => {
      const [cellX, cellY] = fromCellKey(cellKey);
      this.context.fillStyle = `hsl(${color[0]}deg ${color[1]}% ${color[2]}%)`;
      this.context.fillRect(
        this.toScreenX(cellX * CELL_SIZE),
        this.toScreenY(cellY * CELL_SIZE),
        CELL_SIZE * this.scale,
        CELL_SIZE * this.scale
      );
    });
  }

  private _drawPixelArea(): void {
    this.context.strokeStyle = "rgb(209,213,219)";
    this.context.lineWidth = 4;

    this.context.beginPath();
    this.context.moveTo(this.toScreenX(0), this.toScreenY(0));
    this.context.lineTo(
      this.toScreenX(0),
      this.toScreenY(CELL_SIZE * this.pixelWidth)
    );
    this.context.lineTo(
      this.toScreenX(CELL_SIZE * this.pixelHeight),
      this.toScreenY(CELL_SIZE * this.pixelWidth)
    );
    this.context.lineTo(
      this.toScreenX(CELL_SIZE * this.pixelHeight),
      this.toScreenY(0)
    );
    this.context.closePath();
    this.context.stroke();
  }

  private _drawPreview(): void {
    const canvasPreview = document.getElementById(
      "preview"
    )! as HTMLCanvasElement;
    const contextPreview = canvasPreview.getContext("2d")!;

    const cellSize = canvasPreview.width / this.pixelWidth;
    Array.from(this.cells.entries()).forEach(([cellKey, { color }]) => {
      const [cellX, cellY] = fromCellKey(cellKey);
      contextPreview.fillStyle = `hsl(${color[0]}deg ${color[1]}% ${color[2]}%)`;
      contextPreview.fillRect(
        cellX * cellSize,
        cellY * cellSize,
        cellSize,
        cellSize
      );
    });
  }
}
