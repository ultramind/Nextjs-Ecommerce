interface ButtonProps extends React.ComponentProps<"button"> {
  text: string;
}

export function PrimaryButton({
  text,
  type,
  disabled = false,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      {...props}
      className="w-full py-4 font-medium font-roboto text-14 lg:text-t16 disabled:opacity-50 !leading-[1.11rem] rounded-xs text-white bg-tangerine"
    >
      {text}
    </button>
  );
}

export function SecondaryButton({
  text,
  type,
  disabled = false,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      {...props}
      className="w-full py-4 font-medium font-roboto text-14 lg:text-t16 disabled:opacity-50 !leading-[1.11rem] rounded-xs text-tangerine border border-tangerine bg-transparent"
    >
      {text}
    </button>
  );
}

export function DangerButton({
  text,
  type,
  disabled = false,
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled}
      {...props}
      className="w-full py-4 font-medium font-roboto text-14 lg:text-t16 disabled:opacity-50 !leading-[1.11rem] rounded-xs text-rose_light border border-rose_light bg-transparent"
    >
      {text}
    </button>
  );
}
