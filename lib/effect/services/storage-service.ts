import { CanvasGrid } from "@/lib/canvas-grid";
import { Context, Effect, Either, Layer, Schema, pipe } from "../common";
import { StorageSchemaList } from "../schema";
import { ParseService } from "./parse-service";

const STORAGE_KEY = "pixel-editor-storage";

interface StorageService {
  readonly getFileList: () => StorageSchemaList;
  //   readonly saveFile: (name: string, canvasGrid: CanvasGrid) => void;
  //   readonly getFile: (name: string) => void;
  readonly newFile: (name: string) => void;
}

export const StorageService = Context.Tag<StorageService>(
  "@app/StorageService"
);

const getFileList = (parseService: ParseService) => () => {
  const data = localStorage.getItem(STORAGE_KEY);

  if (data === null) {
    return [];
  }

  const json = parseService.fromJson(data);
  console.log(json);

  const parsed = pipe(json, Schema.parseEither(StorageSchemaList));
  console.log(parsed);
  return Either.isLeft(parsed) ? [] : parsed.right;
};

export const StorageServiceLive = Layer.effect(
  StorageService,
  Effect.map(ParseService, (parseService) =>
    StorageService.of({
      getFileList: getFileList(parseService),
      newFile: (name) => {
        const data = getFileList(parseService)();
        localStorage.setItem(
          STORAGE_KEY,
          parseService.toJson([
            ...data,
            {
              name,
              value: new CanvasGrid({ pixelHeight: 16, pixelWidth: 16 }),
            },
          ])
        );
      },
    })
  )
);
