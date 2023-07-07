"use client";
import { Effect, pipe } from "@/lib/effect/common";
import { StorageSchemaList } from "@/lib/effect/schema";
import { StorageService } from "@/lib/effect/services/storage-service";
import { storageLayerLive } from "@/lib/effect/storage-layer";
import Link from "next/link";
import { ReactElement, useEffect, useState } from "react";

const getFileList = pipe(
  Effect.gen(function* (_) {
    const storage = yield* _(StorageService);
    return storage.getFileList();
  }),
  Effect.provideLayer(storageLayerLive)
);

const newFile = (name: string) =>
  pipe(
    Effect.gen(function* (_) {
      const storage = yield* _(StorageService);
      return storage.newFile(name);
    }),
    Effect.provideLayer(storageLayerLive)
  );

export default function Page(): ReactElement {
  const [fileList, setFileList] = useState<StorageSchemaList>([]);

  const onNew = () => {
    pipe(newFile("added"), Effect.runSync);
  };

  useEffect(() => {
    const loadFileList = pipe(getFileList, Effect.runSync);
    setFileList(loadFileList);
  }, []);

  return (
    <div>
      <div>
        <button onClick={onNew}>New</button>
        {fileList.map((file) => (
          <Link key={file.name} href={`/edit/${file.name}`}>
            {file.name}
          </Link>
        ))}
      </div>
    </div>
  );
}
