import { ReactElement } from "react";

interface InputFieldProps {
  value: number;
  onChange: (n: number) => void;
}

export default function InputField({
  onChange,
  value,
}: InputFieldProps): ReactElement {
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
