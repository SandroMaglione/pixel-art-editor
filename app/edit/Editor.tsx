"use client";

import { machine } from "@/lib/machine";
import type { PixelArtCanvas } from "@/lib/schema";
import { useActor, useSelector } from "@xstate/react";
import InfiniteCanvas from "./InfiniteCanvas";
import Resize from "./Resize";
import ActionsBar from "./actions-bar";
import ColorSelection from "./color-selection";
import OptionsBar from "./options-bar";

export default function Editor({
  pixelArtCanvas,
  name,
}: {
  pixelArtCanvas: PixelArtCanvas;
  name: string;
}) {
  const [snapshot, , actor] = useActor(machine, {
    input: { pixelArtCanvas, name },
  });
  const { isResizing, canvasGrid } = useSelector(actor, (snapshot) => ({
    isResizing: snapshot.matches("Resizing"),
    canvasGrid: snapshot.context.canvasGrid,
  }));

  return (
    <main className="absolute inset-0 overflow-hidden flex flex-col">
      <InfiniteCanvas actor={snapshot.context.infiniteCanvas} />

      <div className="fixed bottom-0 inset-x-0 px-4 pb-4">
        <div className="flex items-center justify-between mb-1">
          <OptionsBar actor={actor} />
          <ActionsBar actor={actor} />
        </div>

        <ColorSelection actor={actor} />
      </div>

      {isResizing && (
        <Resize
          initial={[canvasGrid.pixelWidth, canvasGrid.pixelHeight]}
          onClose={() => actor.send({ type: "resize.close" })}
          onResize={(x, y) =>
            actor.send({ type: "resize.update", value: { x, y } })
          }
        />
      )}
    </main>
  );
}
