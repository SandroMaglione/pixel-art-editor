import { Schema } from "effect";
import { clamp, lerp } from "./helpers";

export const Percentage = Schema.Number.pipe(Schema.between(0, 1)).pipe(
  Schema.brand("percentage")
);

export const Hue = Schema.Number.pipe(Schema.nonNegative()).pipe(
  Schema.brand("hue")
);
export const Saturation = Schema.Number.pipe(Schema.nonNegative()).pipe(
  Schema.brand("saturation")
);
export const Lightness = Schema.Number.pipe(Schema.nonNegative()).pipe(
  Schema.brand("lightness")
);

export class ColorHSL extends Schema.Class<ColorHSL>("ColorHSL")({
  hue: Hue,
  saturation: Saturation,
  lightness: Lightness,
}) {
  static readonly build = (
    hue: number,
    saturation: number,
    lightness: number
  ): ColorHSL =>
    new ColorHSL({
      hue: Hue.make(hue),
      saturation: Saturation.make(saturation),
      lightness: Lightness.make(lightness),
    });

  public get toPercentage(): ColorPercentage {
    const clamp01 = clamp(0, 1);
    return new ColorPercentage({
      hue: Percentage.make(clamp01(this.hue / 360)),
      saturation: Percentage.make(clamp01(this.saturation / 100)),
      lightness: Percentage.make(clamp01(this.lightness / 100)),
    });
  }
}

export class ColorPercentage extends Schema.Class<ColorPercentage>(
  "ColorPercentage"
)({
  hue: Percentage,
  saturation: Percentage,
  lightness: Percentage,
}) {
  public get toHSL(): ColorHSL {
    console.log(this.hue, this.saturation, this.lightness);
    return new ColorHSL({
      hue: Hue.make(lerp(0, 365, this.hue)),
      saturation: Saturation.make(lerp(0, 100, this.saturation)),
      lightness: Lightness.make(lerp(0, 100, this.lightness)),
    });
  }
}

export class PixelArtCanvas extends Schema.Class<PixelArtCanvas>(
  "PixelArtCanvas"
)({
  name: Schema.NonEmptyString,
  pixelWidth: Schema.Number.pipe(Schema.nonNegative()),
  pixelHeight: Schema.Number.pipe(Schema.nonNegative()),
  cells: Schema.Array(
    Schema.Struct({
      x: Schema.Number.pipe(Schema.nonNegative()),
      y: Schema.Number.pipe(Schema.nonNegative()),
      color: Schema.Tuple(Schema.Number, Schema.Number, Schema.Number),
    })
  ),
}) {}
