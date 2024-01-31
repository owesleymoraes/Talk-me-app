interface IButtonProps {
  children: string;
  type: "button" | "submit" | "reset";
}

export default function Button({ children, type }: IButtonProps) {
  return (
    <button
      className=" bg-primary w-full text-black font-medium rounded-md py-2"
      type={type}
    >
      <span>{children}</span>
    </button>
  );
}
