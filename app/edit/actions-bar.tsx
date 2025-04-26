import { useEditorMachine } from "@/lib/machine";
import ActionButton from "./ActionButton";

export default function ActionsBar() {
  const editorActor = useEditorMachine();
  return (
    <div className="flex justify-end">
      <ActionButton
        action="undo"
        onClick={() => editorActor.send({ type: "undo" })}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="M9 14 4 9l5-5" />
          <path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11" />
        </svg>
      </ActionButton>
      <ActionButton
        action="centering"
        onClick={() => editorActor.send({ type: "centering" })}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <rect width="6" height="10" x="9" y="7" rx="2" />
          <path d="M4 22V2" />
          <path d="M20 22V2" />
        </svg>
      </ActionButton>
      <ActionButton
        action="resize"
        onClick={() => editorActor.send({ type: "resize.init" })}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <path d="m21 21-6-6m6 6v-4.8m0 4.8h-4.8" />
          <path d="M3 16.2V21m0 0h4.8M3 21l6-6" />
          <path d="M21 7.8V3m0 0h-4.8M21 3l-6 6" />
          <path d="M3 7.8V3m0 0h4.8M3 3l6 6" />
        </svg>
      </ActionButton>
    </div>
  );
}
