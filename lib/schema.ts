import { Schema } from "effect";

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
