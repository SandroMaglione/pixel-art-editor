import InputButton from "@/app/InputButton";
import { ReactElement, useState } from "react";
import InputNumber from "./InputNumber";

interface ResizeProps {
  onClose: () => void;
  onResize: (x: number, y: number) => void;
  initial: [x: number, y: number];
}

export default function Resize({
  onResize,
  onClose,
  initial,
}: ResizeProps): ReactElement {
  const [x, setX] = useState<number>(initial[0]);
  const [y, setY] = useState<number>(initial[1]);
  return (
    <div
      className="absolute z-10 inset-0 p-6 bg-black/30 flex items-center justify-center"
      onClick={onClose}
    >
      <form
        onClick={(e) => e.stopPropagation()}
        className="w-full flex items-center flex-col p-4 gap-y-2 bg-white rounded-md"
        onSubmit={(e) => {
          e.preventDefault();
          onResize(x, y);
        }}
      >
        <InputNumber value={x} onChange={setX} />
        <InputNumber value={y} onChange={setY} />
        <InputButton>Confirm</InputButton>
      </form>
    </div>
  );
}
