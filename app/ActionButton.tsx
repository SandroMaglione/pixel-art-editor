import { EditorAction } from "@/lib/types";
import { ReactElement, ReactNode } from "react";

interface ActionButtonProps {
  children: ReactNode;
  onClick: () => void;
  action: EditorAction;
}

export default function ActionButton({
  children,
  onClick,
}: ActionButtonProps): ReactElement {
  return (
    <button
      type="button"
      onClick={onClick}
      className="border w-8 h-8 flex items-center justify-center active:bg-indigo-500 active:text-white"
    >
      {children}
    </button>
  );
}
