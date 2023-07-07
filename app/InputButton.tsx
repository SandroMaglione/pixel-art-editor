import { ReactElement, ReactNode } from "react";

interface InputButtonProps {
  children: ReactNode;
  disabled?: boolean;
}

export default function InputButton({
  children,
  disabled,
}: InputButtonProps): ReactElement {
  return (
    <button
      type="submit"
      disabled={disabled}
      className="text-center disabled:opacity-50 font-bold w-full rounded-md bg-indigo-500 text-white py-2"
    >
      {children}
    </button>
  );
}
