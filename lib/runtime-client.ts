import { Layer, ManagedRuntime } from "effect";
import { FileStorage } from "./services/file-storage";

const MainLayer = Layer.mergeAll(FileStorage.Default);

export const RuntimeClient = ManagedRuntime.make(MainLayer);
