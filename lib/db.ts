import Dexie, { type EntityTable } from "dexie";
import type { PixelArtCanvas } from "./schema";

const db = new Dexie("pixel-editor") as Dexie & {
  file: EntityTable<PixelArtCanvas, "name">;
};

db.version(1).stores({ file: "&name" });

export { db };
