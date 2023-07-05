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
      max={64}
      onChange={(e) => onChange(e.target.valueAsNumber)}
      value={value}
      className="text-lg px-4 py-1.5 text-center"
    />
  );
}
