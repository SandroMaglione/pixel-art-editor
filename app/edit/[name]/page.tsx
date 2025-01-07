"use client";

import { CanvasGrid } from "@/lib/canvas-grid";
import type { Effect, pipe } from "effect";
import { useEffect, useState } from "react";
import Editor from "./Editor";

interface Params {
  params: { name: string };
}

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
