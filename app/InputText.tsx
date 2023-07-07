import { ReactElement } from "react";

interface InputTextProps {
  value: string;
  onChange: (str: string) => void;
  placeholder?: string;
}

export default function InputText({
  onChange,
  value,
  placeholder,
}: InputTextProps): ReactElement {
  return (
    <input
      type="text"
      required
      onChange={(e) => onChange(e.target.value)}
      value={value}
      placeholder={placeholder}
      className="text-lg px-4 py-1.5 placeholder:text-gray-300 focus:outline-indigo-400 text-center border border-gray-300 rounded-md w-full"
    />
  );
}
