const CELL_SIZE = 40;

export class CanvasGrid {
  scale: number = 1;
  offsetX: number = 0;
  offsetY: number = 0;

  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  touchMode: "single" | "double" = "single";
  prevTouch: [React.Touch | null, React.Touch | null] = [null, null];

  cells: [number, number][] = [
    [0, 0],
    [10, 4],
    [5, 5],
    [4, 12],
  ];

  constructor() {
    this.canvas = document.getElementById("canvas")! as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d")!;
  }

  draw(): void {
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this._drawGrid();
    this._drawCells();
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

  addCellAt(touchX: number, touchY: number): void {
    this.cells.push([
      Math.floor(touchX / this.toScreenX(CELL_SIZE)),
      Math.floor(touchY / this.toScreenY(CELL_SIZE)),
    ]);
  }

  private _drawGrid(): void {
    this.context.strokeStyle = "#e1e1e1";
    this.context.fillStyle = "#0000ff";

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
    this.context.fillStyle = "#111";
    this.cells.forEach(([cellX, cellY]) => {
      this.context.fillRect(
        this.toScreenX(cellX * CELL_SIZE),
        this.toScreenY(cellY * CELL_SIZE),
        CELL_SIZE * this.scale,
        CELL_SIZE * this.scale
      );
    });
  }
}
