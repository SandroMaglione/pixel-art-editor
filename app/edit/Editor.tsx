"use client";

import { useColorActor, useEditorMachine, useModeActor } from "@/lib/machine";
import { useSelector } from "@xstate/react";
import InfiniteCanvas from "./InfiniteCanvas";
import Resize from "./Resize";
import ActionsBar from "./actions-bar";
import ColorSelection from "./color-selection";
import OptionsBar from "./options-bar";

export default function Editor() {
  const editorActor = useEditorMachine();
  const modeActor = useModeActor();
  const colorActor = useColorActor();
  const color = useSelector(colorActor, (snapshot) => snapshot.context.color);
  const canvasGrid = useSelector(
    editorActor,
    (snapshot) => snapshot.context.canvasGrid
  );
  const mode = useSelector(modeActor, (snapshot) => snapshot.context.mode);
  const isResizing = useSelector(editorActor, (snapshot) =>
    snapshot.matches("Resizing")
  );

  return (
    <main className="absolute inset-0 overflow-hidden flex flex-col">
      <InfiniteCanvas
        onExecute={(action) => editorActor.send({ type: "execute", action })}
        canvasGrid={canvasGrid}
        color={color}
        mode={mode}
        onColorPick={(colorPercentage) =>
          colorActor.send({ type: "update", value: colorPercentage })
        }
      />

      <div className="fixed bottom-0 inset-x-0 px-4 pb-4">
        <div className="flex items-center justify-between mb-1">
          <OptionsBar />
          <ActionsBar />
        </div>

        <ColorSelection />
      </div>

      {isResizing && (
        <Resize
          initial={[canvasGrid.pixelWidth, canvasGrid.pixelHeight]}
          onClose={() => editorActor.send({ type: "resize.close" })}
          onResize={(x, y) => {
            editorActor.send({
              type: "resize.update",
              value: { x, y },
            });
          }}
        />
      )}
    </main>
  );
}
