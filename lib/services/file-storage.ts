import { KeyValueStore } from "@effect/platform";
import { BrowserKeyValueStore } from "@effect/platform-browser";
import { Effect, Schema } from "effect";
import { StorageSchemaData } from "../schema";

const STORAGE_KEY = "pixel-editor-storage";

export class FileStorage extends Effect.Service<FileStorage>()("FileStorage", {
  dependencies: [BrowserKeyValueStore.layerLocalStorage],
  effect: Effect.gen(function* () {
    const store = yield* KeyValueStore.KeyValueStore;
    return {
      getFileList: () =>
        store
          .get(STORAGE_KEY)
          .pipe(
            Effect.flatMap(
              Schema.decodeUnknownEither(
                Schema.parseJson(Schema.Array(StorageSchemaData))
              )
            )
          ),

      newFile: (name: string) =>
        store.set(
          name,
          JSON.stringify({ cells: [], pixelWidth: 0, pixelHeight: 0 })
        ),

      getFile: (name: string) => store.get(name),
      setFile: (name: string, value: any) => store.set(name, value),
    };
  }),
}) {}
