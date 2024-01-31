import { forwardRef } from "react";

interface IInput {
  placeholder: string;
  type: string;
}
const InputBase: React.ForwardRefRenderFunction<HTMLInputElement, IInput> = (
  { placeholder, type, ...rest },
  ref
) => {
  return (
    <div className="w-full">
      <input
        className="px-3 py-2 bg-gray-950 rounded-md w-full"
        type={type}
        placeholder={placeholder}
        ref={ref}
        {...rest}
      />
    </div>
  );
};

export const Input = forwardRef(InputBase);
