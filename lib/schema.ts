import { Schema } from "effect";

export class CanvasGridSchema extends Schema.Class<CanvasGridSchema>(
  "CanvasGridSchema"
)({
  cells: Schema.Struct({
    x: Schema.Number.pipe(Schema.nonNegative()),
    y: Schema.Number.pipe(Schema.nonNegative()),
    color: Schema.Tuple(Schema.Number, Schema.Number, Schema.Number),
  }).pipe(Schema.Array),
  pixelWidth: Schema.Number.pipe(Schema.nonNegative()),
  pixelHeight: Schema.Number.pipe(Schema.nonNegative()),
}) {}

export class StorageSchema extends Schema.Class<StorageSchema>("StorageSchema")(
  {
    name: Schema.String,
    value: CanvasGridSchema,
  }
) {}

export class StorageSchemaData extends Schema.Class<StorageSchemaData>(
  "StorageSchemaData"
)({
  key: Schema.String,
  value: StorageSchema,
}) {}
