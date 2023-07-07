"use client";

import { CanvasGrid } from "@/lib/canvas-grid";
import { Effect, pipe } from "@/lib/effect/common";
import { StorageService } from "@/lib/effect/services/storage-service";
import { storageLayerLive } from "@/lib/effect/storage-layer";
import { useEffect, useState } from "react";
import Editor from "./Editor";

interface Params {
  params: { name: string };
}

const getFile = (name: string) =>
  pipe(
    Effect.gen(function* (_) {
      const storage = yield* _(StorageService);
      return yield* _(storage.getFile(name));
    }),
    Effect.provideLayer(storageLayerLive),
    Effect.catchTags({
      MissingFileError: () => Effect.succeed(null),
    })
  );

export default function Home({ params }: Params) {
  const [canvasGrid, setCanvasGrid] = useState<CanvasGrid | null>(null);
  useEffect(() => {
    const fileData = pipe(getFile(params.name), Effect.runSync);
    setCanvasGrid(fileData);
  }, []);

  return canvasGrid === null ? (
    <span>...</span>
  ) : (
    <Editor name={params.name} canvasGrid={canvasGrid} />
  );
}
