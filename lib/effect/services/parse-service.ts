import { CanvasGrid } from "@/lib/canvas-grid";
import { fromCellKey } from "@/lib/helpers";
import { Context, Layer, Option, Schema, pipe } from "../common";
import { CanvasGridSchema } from "../schema";

export interface ParseService {
  readonly toJson: (data: unknown[]) => string;
  readonly fromJson: (data: string) => unknown;
}

export const ParseService = Context.Tag<ParseService>("@app/ParseService");

export const ParseServiceLive = Layer.succeed(
  ParseService,
  ParseService.of({
    toJson: (data) => {
      return JSON.stringify(data, (_, value) => {
        if (value instanceof CanvasGrid) {
          const schema: CanvasGridSchema = {
            cells: Array.from(value.cells.entries()).map(
              ([cellKey, cellValue]) => {
                const [x, y] = fromCellKey(cellKey);
                return { x, y, color: cellValue.color };
              }
            ),
            pixelHeight: value.pixelHeight,
            pixelWidth: value.pixelWidth,
          };

          return {
            dataType: "CanvasGrid",
            value: schema,
          };
        } else {
          return value;
        }
      });
    },
    fromJson: (data) => {
      return JSON.parse(data, (_, value) => {
        if (typeof value === "object" && value !== null) {
          if (value.dataType === "CanvasGrid") {
            const parsed = pipe(
              value.value,
              Schema.parseOption(CanvasGridSchema)
            );
            return Option.isNone(parsed) ? value : parsed.value;
          }
        }
        return value;
      });
    },
  })
);
