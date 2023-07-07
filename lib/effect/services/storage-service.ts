import { CanvasGrid } from "@/lib/canvas-grid";
import { Context, Effect, Either, Layer, Schema, pipe } from "../common";
import { StorageSchemaList } from "../schema";
import { ParseService } from "./parse-service";

const STORAGE_KEY = "pixel-editor-storage";

export class MissingFileError {
  readonly _tag = "MissingFileError";
}

interface StorageService {
  readonly getFileList: () => StorageSchemaList;
  readonly saveFile: (name: string, canvasGrid: CanvasGrid) => void;
  readonly getFile: (
    name: string
  ) => Either.Either<MissingFileError, CanvasGrid>;
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
  const parsed = pipe(json, Schema.parseEither(StorageSchemaList));
  return Either.isLeft(parsed) ? [] : parsed.right;
};

export const StorageServiceLive = Layer.effect(
  StorageService,
  Effect.map(ParseService, (parseService) =>
    StorageService.of({
      getFileList: getFileList(parseService),
      getFile: (name) => {
        const fileList = getFileList(parseService)();
        const find = fileList.find((file) => file.name === name);
        if (!find) {
          return Either.left(new MissingFileError());
        }

        return Either.right(CanvasGrid.restore(find.value));
      },
      saveFile: (name, canvasGrid) => {
        const data = getFileList(parseService)();
        localStorage.setItem(
          STORAGE_KEY,
          parseService.toJson([
            ...data,
            {
              name,
              value: canvasGrid,
            },
          ])
        );
      },
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
