export default function InputText(
  props: React.DetailedHTMLProps<
    React.InputHTMLAttributes<HTMLInputElement>,
    HTMLInputElement
  >
) {
  return (
    <input
      {...props}
      className="text-lg px-4 py-1.5 placeholder:text-gray-300 focus:outline-indigo-400 text-center border border-gray-300 rounded-md w-full"
    />
  );
}
