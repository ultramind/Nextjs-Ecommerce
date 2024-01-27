export interface InputFieldProps {
  name: string;
  placeholder?: string;
  label?: string;
  type?: string;
  className?: string;
  classNameContainer?: string;
  inputMode?: string;
  productPlaceholder?: string;
  disabled?: boolean;
  helperText?: string;
  onChange?: (value: string) => void;
  value?: string
  min?: number | string
}

export interface textAreaProps {
  name: string;
  placeholder?: string;
  className: string;
  classNameContainer: string;
  productPlaceholder?: string;
}
