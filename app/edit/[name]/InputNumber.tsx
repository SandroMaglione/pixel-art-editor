import { ReactElement } from "react";

interface InputNumberProps {
  value: number;
  onChange: (n: number) => void;
}

export default function InputNumber({
  onChange,
  value,
}: InputNumberProps): ReactElement {
  return (
    <input
      type="number"
      min={1}
      max={256}
      required
      onChange={(e) => {
        const newValue = e.target.valueAsNumber;
        onChange(!isNaN(newValue) ? newValue : 0);
      }}
      value={value || ""}
      className="text-lg px-4 py-1.5 text-center border border-gray-300 rounded-md w-full"
    />
  );
}
