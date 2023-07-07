import { Layer, pipe } from "./common";
import { ParseServiceLive } from "./services/parse-service";
import { StorageServiceLive } from "./services/storage-service";

export const storageLayerLive = pipe(
  ParseServiceLive,
  Layer.provide(StorageServiceLive)
);
