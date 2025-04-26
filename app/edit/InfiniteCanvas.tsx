import type { machine } from "@/lib/machine";
import { ReactElement } from "react";
import type { SnapshotFrom } from "xstate";

export default function InfiniteCanvas({
  actor,
}: {
  actor: SnapshotFrom<typeof machine>["context"]["infiniteCanvas"];
}): ReactElement {
  return (
    <div className="touch-none select-none fixed bg-gray-50 inset-0 w-full h-full">
      <canvas
        id="canvas"
        onTouchStart={(event) => actor.send({ type: "touch.start", event })}
        onTouchMove={(event) => actor.send({ type: "touch.move", event })}
      ></canvas>

      <canvas
        id="preview"
        className="absolute top-4 right-4 bg-gray-50 border-4 border-gray-300"
      ></canvas>
    </div>
  );
}
