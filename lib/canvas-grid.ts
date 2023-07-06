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

  cells: [number, number][] = [];

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

    // this.canvas.clientWidth / (CELL_SIZE * this.scale) = pixelWidth
    // this.canvas.clientWidth = pixelWidth * (CELL_SIZE * this.scale)
    // this.canvas.clientWidth / (pixelWidth * CELL_SIZE) = this.scale

    const padding = 2;
    this.scale =
      document.body.clientWidth / (CELL_SIZE * (pixelWidth + padding * 2));

    console.log({
      w: this.canvas.clientWidth,
      r: this.canvas.clientWidth / (CELL_SIZE * pixelWidth),
    });

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

  addCellAt(touchX: number, touchY: number): void {
    // TODO: Make cells in array unique, add color to them, make searching near cells easier
    const x = Math.floor(this.toTrueX(touchX) / CELL_SIZE);
    const y = Math.floor(this.toTrueY(touchY) / CELL_SIZE);
    if (x >= 0 && y >= 0 && x < this.pixelWidth && y < this.pixelHeight) {
      this.cells.push([x, y]);
    }
  }

  private _drawGrid(): void {
    this.context.strokeStyle = "#e1e1e1";
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

  private _drawPixelArea(): void {
    this.context.strokeStyle = "#0000ff";

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
}
