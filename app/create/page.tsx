"use client";
import { Effect, Layer, pipe } from "@/lib/effect/common";
import { StorageSchemaList } from "@/lib/effect/schema";
import { ParseServiceLive } from "@/lib/effect/services/parse-service";
import {
  StorageService,
  StorageServiceLive,
} from "@/lib/effect/services/storage-service";
import { ReactElement, useEffect, useState } from "react";

const layerLive = pipe(ParseServiceLive, Layer.provide(StorageServiceLive));

const getFileList = pipe(
  Effect.gen(function* (_) {
    const storage = yield* _(StorageService);
    return storage.getFileList();
  }),
  Effect.provideLayer(layerLive)
);

const newFile = (name: string) =>
  pipe(
    Effect.gen(function* (_) {
      const storage = yield* _(StorageService);
      return storage.newFile(name);
    }),
    Effect.provideLayer(layerLive)
  );

export default function Page(): ReactElement {
  const [fileList, setFileList] = useState<StorageSchemaList>([]);

  const onNew = () => {
    pipe(newFile("added"), Effect.runSync);
  };

  useEffect(() => {
    const loadFileList = pipe(getFileList, Effect.runSync);
    console.log(loadFileList);

    setFileList(loadFileList);
  }, []);

  return (
    <div>
      <div>
        <button onClick={onNew}>New</button>
        {fileList.map((file) => (
          <p key={file.name}>{file.name}</p>
        ))}
      </div>
    </div>
  );
}
