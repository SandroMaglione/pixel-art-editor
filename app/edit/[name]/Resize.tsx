import { ReactElement, useState } from "react";
import InputField from "./InputField";

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
        <InputField value={x} onChange={setX} />
        <InputField value={y} onChange={setY} />
        <button
          type="submit"
          className="text-center font-bold w-full rounded-md bg-indigo-500 text-white py-2"
        >
          Confirm
        </button>
      </form>
    </div>
  );
}
