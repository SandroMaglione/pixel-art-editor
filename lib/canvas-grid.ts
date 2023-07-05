const CELL_SIZE = 40;

export class CanvasGrid {
  scale: number = 1;
  offsetX: number = 0;
  offsetY: number = 0;

  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  touchMode: "single" | "double" = "single";
  prevTouch: [React.Touch | null, React.Touch | null] = [null, null];

  constructor() {
    this.canvas = document.getElementById("canvas")! as HTMLCanvasElement;
    this.context = this.canvas.getContext("2d")!;
  }

  draw(): void {
    this.canvas.width = document.body.clientWidth;
    this.canvas.height = document.body.clientHeight;
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this._drawGrid();
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

  private _drawGrid(): void {
    this.context.strokeStyle = "#e1e1e1";
    this.context.beginPath();
    for (let x = 0; x <= this.trueWidth(); x += CELL_SIZE * this.scale) {
      this.context.moveTo(this.toScreenX(x), this.toScreenY(0));
      this.context.lineTo(this.toScreenX(x), this.toScreenX(this.trueHeight()));
    }

    for (let y = 0; y <= this.trueHeight(); y += CELL_SIZE * this.scale) {
      this.context.moveTo(this.toScreenX(0), this.toScreenY(y));
      this.context.lineTo(this.toScreenX(this.trueWidth()), this.toScreenY(y));
    }
    this.context.stroke();
  }
}
