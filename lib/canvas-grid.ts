import { eqColor, fromCellKey, toCellKey } from "./helpers";
import { CellKey, ColorHSL, EditorMode } from "./types";

const CELL_SIZE = 40;
const PREVIEW_MAX_WIDTH = 50; // px
const PREVIEW_MAX_HEIGHT = 100; // px

export class CanvasGrid {
  scale: number = 1;
  offsetX: number = 0;
  offsetY: number = 0;

  pixelWidth: number;
  pixelHeight: number;

  canvas: HTMLCanvasElement | null = null;
  context: CanvasRenderingContext2D | null = null;

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
    this.pixelWidth = pixelWidth;
    this.pixelHeight = pixelHeight;
  }

  init(): void {
    const canvas = document.getElementById(
      "canvas"
    ) as HTMLCanvasElement | null;
    const context = canvas?.getContext("2d");
    if (canvas && context) {
      this.canvas = canvas;
      this.context = context;
      this.recenter();
      this.draw();
    }
  }

  draw(): void {
    if (this.canvas && this.context) {
      this.canvas.width = document.body.clientWidth;
      this.canvas.height = document.body.clientHeight;
      this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

      this._drawGrid();
      this._drawPixelArea();
      this._drawCells();
      this._drawPreview();
    }
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
    return (this.canvas?.clientHeight ?? 0) / this.scale;
  }

  trueWidth(): number {
    return (this.canvas?.clientWidth ?? 0) / this.scale;
  }

  zoom(amount: number): void {
    this.scale *= amount;
  }

  resize(x: number, y: number): void {
    this.pixelWidth = x;
    this.pixelHeight = y;

    const keys = this.cells.keys();
    for (const mapCellKey of keys) {
      const [cellX, cellY] = fromCellKey(mapCellKey);
      if (cellX >= x || cellY >= y) {
        this.cells.delete(mapCellKey);
      }
    }

    this.recenter();
  }

  recenter(): void {
    const padding = 2;
    this.scale =
      document.body.clientWidth / (CELL_SIZE * (this.pixelWidth + padding * 2));
    this.offsetX = CELL_SIZE * padding;
    this.offsetY = CELL_SIZE * padding;

    this.draw();
  }

  addCellAt(
    touchX: number,
    touchY: number,
    color: ColorHSL,
    mode: EditorMode,
    onColorPick: (color: ColorHSL) => void
  ): void {
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
      } else if (mode === "swap-color" && findCell) {
        const entries = this.cells.entries();
        for (const [mapCellKey, value] of entries) {
          if (eqColor(value.color, findCell.color)) {
            this.cells.set(mapCellKey, { color });
          }
        }
      }

      this.draw();
    }
  }

  private _fill(
    x: number,
    y: number,
    newColor: ColorHSL,
    sourceColor: ColorHSL | null
  ): void {
    if (x >= 0 && x < this.pixelWidth && y >= 0 && y < this.pixelHeight) {
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
    if (this.canvas && this.context) {
      this.context.strokeStyle = "rgb(229,231,235)";
      this.context.lineWidth = 1;
      this.context.beginPath();

      const minX = this.toScreenX(0);
      const minY = this.toScreenY(0);
      const maxX = this.toScreenY(CELL_SIZE * this.pixelWidth);
      const maxY = this.toScreenX(CELL_SIZE * this.pixelHeight);
      for (let x = minX; x <= maxX; x += CELL_SIZE * this.scale) {
        const source = x;
        this.context.moveTo(source, minY);
        this.context.lineTo(source, maxY);
      }

      for (let y = minY; y <= maxY; y += CELL_SIZE * this.scale) {
        const destination = y;
        this.context.moveTo(minX, destination);
        this.context.lineTo(maxX, destination);
      }
      this.context.stroke();
    }
  }

  private _drawCells(): void {
    Array.from(this.cells.entries()).forEach(([cellKey, { color }]) => {
      if (this.canvas && this.context) {
        const [cellX, cellY] = fromCellKey(cellKey);
        this.context.fillStyle = `hsl(${color[0]}deg ${color[1]}% ${color[2]}%)`;
        this.context.fillRect(
          this.toScreenX(cellX * CELL_SIZE),
          this.toScreenY(cellY * CELL_SIZE),
          CELL_SIZE * this.scale,
          CELL_SIZE * this.scale
        );
      }
    });
  }

  private _drawPixelArea(): void {
    if (this.canvas && this.context) {
      this.context.strokeStyle = "rgb(209,213,219)";
      this.context.lineWidth = 4;

      this.context.beginPath();
      this.context.moveTo(this.toScreenX(0), this.toScreenY(0));
      this.context.lineTo(
        this.toScreenX(0),
        this.toScreenY(CELL_SIZE * this.pixelHeight)
      );
      this.context.lineTo(
        this.toScreenX(CELL_SIZE * this.pixelWidth),
        this.toScreenY(CELL_SIZE * this.pixelHeight)
      );
      this.context.lineTo(
        this.toScreenX(CELL_SIZE * this.pixelWidth),
        this.toScreenY(0)
      );
      this.context.closePath();
      this.context.stroke();
    }
  }

  private _drawPreview(): void {
    const canvasPreview = document.getElementById(
      "preview"
    )! as HTMLCanvasElement;
    const contextPreview = canvasPreview.getContext("2d")!;
    canvasPreview.width = PREVIEW_MAX_WIDTH;
    let cellSize = canvasPreview.width / this.pixelWidth;
    const newHeight = cellSize * this.pixelHeight;
    if (newHeight > PREVIEW_MAX_HEIGHT) {
      canvasPreview.height = PREVIEW_MAX_HEIGHT;
      cellSize = canvasPreview.height / this.pixelHeight;
      canvasPreview.width = cellSize * this.pixelWidth;
    } else {
      canvasPreview.height = cellSize * this.pixelHeight;
    }

    contextPreview.clearRect(0, 0, canvasPreview.width, canvasPreview.height);

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
