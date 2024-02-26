import clsx from "clsx";

const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input {...props} className={clsx("rounded-md border-gray-600 p-1", props.className)} />
)

export default Input