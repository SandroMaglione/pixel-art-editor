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
        isSelected
          ? "bg-indigo-500 text-white"
          : "bg-gray-100 text-gray-600 border-gray-300",
        "border w-8 h-8 flex items-center justify-center"
      )}
    >
      {children}
    </button>
  );
}
