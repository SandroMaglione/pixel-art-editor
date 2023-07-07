import { Schema, pipe } from "./common";

export const CanvasGridSchema = Schema.struct({
  cells: pipe(
    Schema.struct({
      x: pipe(Schema.number, Schema.nonNegative()),
      y: pipe(Schema.number, Schema.nonNegative()),
      color: Schema.tuple(Schema.number, Schema.number, Schema.number),
    }),
    Schema.array
  ),
  pixelWidth: pipe(Schema.number, Schema.nonNegative()),
  pixelHeight: pipe(Schema.number, Schema.nonNegative()),
});

export type CanvasGridSchema = Schema.To<typeof CanvasGridSchema>;

export const StorageSchema = Schema.struct({
  name: Schema.string,
  value: CanvasGridSchema,
});

export type StorageSchema = Schema.To<typeof StorageSchema>;

export const StorageSchemaList = pipe(StorageSchema, Schema.array);

export type StorageSchemaList = Schema.To<typeof StorageSchemaList>;
