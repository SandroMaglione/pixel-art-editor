import { EditorMode } from "@/lib/types";
import clsx from "clsx";
import { ReactElement, ReactNode } from "react";

interface ModeButtonProps {
  children: ReactNode;
  onClick: (mode: EditorMode) => void;
  mode: EditorMode;
  currentMode: EditorMode;
}

export default function ModeButton({
  children,
  onClick,
  currentMode,
  mode,
}: ModeButtonProps): ReactElement {
  const isSelected = mode === currentMode;
  return (
    <button
      type="button"
      onClick={() => onClick(mode)}
      className={clsx(
        isSelected ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-800",
        "border border-black w-12 h-12 flex items-center justify-center"
      )}
    >
      {children}
    </button>
  );
}
