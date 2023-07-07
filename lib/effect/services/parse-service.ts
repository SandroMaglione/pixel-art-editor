import { CanvasGrid } from "@/lib/canvas-grid";
import { canvasGridToSchema } from "@/lib/helpers";
import { Context, Layer, Option, Schema, pipe } from "../common";
import { CanvasGridSchema } from "../schema";

export interface ParseService {
  readonly toJson: (data: Record<string, unknown>) => string;
  readonly fromJson: (data: string) => unknown;
}

export const ParseService = Context.Tag<ParseService>("@app/ParseService");

export const ParseServiceLive = Layer.succeed(
  ParseService,
  ParseService.of({
    toJson: (data) => {
      return JSON.stringify(data, (_, value) => {
        if (value instanceof CanvasGrid) {
          return {
            dataType: "CanvasGrid",
            value: canvasGridToSchema(value),
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
