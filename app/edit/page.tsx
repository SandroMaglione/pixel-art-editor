"use client";

import { db } from "@/lib/db";
import { canvasSchemaToGrid } from "@/lib/helpers";
import { useLiveQuery } from "dexie-react-hooks";
import { useSearchParams } from "next/navigation";
import Editor from "./Editor";

export default function Home() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name") ?? "";
  const canvasGrid = useLiveQuery(() =>
    db.file.where("name").equals(name).first()
  );

  if (canvasGrid === undefined) {
    return <span>...</span>;
  }

  return <Editor name={name} canvasGrid={canvasSchemaToGrid(canvasGrid)} />;
}
