import { ErrorMessage, Field } from "formik";
import React, { useState } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { BsCheckSquareFill } from "react-icons/bs";
import { FiCircle } from "react-icons/fi";
import { IoRadioButtonOn } from "react-icons/io5";
import { MdOutlineCheckBoxOutlineBlank } from "react-icons/md";
import { InputFieldProps, textAreaProps } from "types/inputField";

export function InputField({
  name,
  placeholder = "",
  type,
  classNameContainer,
  className,
  productPlaceholder,
  disabled = false,
  helperText,
  min = 0,
}: InputFieldProps) {
  const [_type, setType] = useState(type);
  const showPasswordHandler = () => {
    if (type === "password") {
      setType("text");
    }
  };

  return (
    <Field as="label" className={classNameContainer}>
      <div className="relative h-fit">
        <Field
          name={name}
          type={_type}
          placeholder={" "}
          aria-label={placeholder || productPlaceholder}
          className={`peer ${className}`}
          disabled={disabled}
          min={min}
        />
        {helperText && (
          <p className="text-xs opacity-70 mt-[0.5rem]">{helperText}</p>
        )}
        {/* FOR CREATE PRODUCT INPUTS */}
        {(productPlaceholder || placeholder) && (
          <p
            className={`absolute text-tangerine bg-white px-1 left-[21px] scale-[.85] font-bold duration-100 transform -translate-y-7 top-[18px] origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:font-light peer-placeholder-shown:text-light_silver peer-placeholder-shown:translate-y-0 peer-placeholder-shown:bg-transparent `}
          >
            {productPlaceholder || placeholder}
          </p>
        )}

        {type === "password" && _type === "text" ? (
          <span
            className="absolute block -translate-y-1/2 top-1/2 right-[1.33rem]"
            onClick={() => setType("password")}
          >
            <AiFillEyeInvisible className="w-5 h-5 text-black cursor-pointer" />
          </span>
        ) : type === "password" ? (
          <span
            className="absolute block -translate-y-1/2 top-1/2 right-[1.33rem]"
            onClick={showPasswordHandler}
          >
            <AiFillEye className="w-5 h-5 text-black cursor-pointer" />
          </span>
        ) : (
          <></>
        )}
      </div>

      <ErrorMessage name={name}>
        {(msg: string) => <p className="mt-1 text-xs text-red-500">{msg}</p>}
      </ErrorMessage>
    </Field>
  );
}

export function AccountVerifyInputField({
  name,
  placeholder = "",
  type,
  classNameContainer,
  className,
  productPlaceholder,
  disabled = false,
  helperText,
  value = "",
  onChange,
}: InputFieldProps) {
  const [_type, setType] = useState(type);
  const showPasswordHandler = () => {
    if (type === "password") {
      setType("text");
    }
  };

  return (
    <Field as="label" className={classNameContainer}>
      <div className="relative h-fit">
        <Field
          name={name}
          type={_type}
          placeholder={" "}
          aria-label={placeholder || productPlaceholder}
          className={`peer ${className}`}
          disabled={disabled}
          value={value}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (onChange) {
              onChange(e.target.value);
            }
          }}
        />
        {helperText && (
          <p className="text-xs opacity-70 mt-[0.5rem]">{helperText}</p>
        )}
        {/* FOR CREATE PRODUCT INPUTS */}
        {(productPlaceholder || placeholder) && (
          <p
            className={`absolute text-tangerine bg-white px-1 left-[21px] scale-[.85] font-bold duration-100 transform -translate-y-7 top-[18px] origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:font-light peer-placeholder-shown:text-light_silver peer-placeholder-shown:translate-y-0 peer-placeholder-shown:bg-transparent `}
          >
            {productPlaceholder || placeholder}
          </p>
        )}

        {type === "password" && _type === "text" ? (
          <span
            className="absolute block -translate-y-1/2 top-1/2 right-[1.33rem]"
            onClick={() => setType("password")}
          >
            <AiFillEyeInvisible className="w-5 h-5 text-black cursor-pointer" />
          </span>
        ) : type === "password" ? (
          <span
            className="absolute block -translate-y-1/2 top-1/2 right-[1.33rem]"
            onClick={showPasswordHandler}
          >
            <AiFillEye className="w-5 h-5 text-black cursor-pointer" />
          </span>
        ) : (
          <></>
        )}
      </div>

      <ErrorMessage name={name}>
        {(msg: string) => <p className="mt-1 text-xs text-red-500">{msg}</p>}
      </ErrorMessage>
    </Field>
  );
}

interface CheckBoxProps {
  name: string;
  handleCheck: (checked: boolean) => void;
  checked: boolean;
  parentStyle?: {
    [s: string]: any;
  };
}

export function CheckBox({
  parentStyle,
  name,
  handleCheck,
  checked,
}: CheckBoxProps) {
  return (
    <span
      style={parentStyle}
      className="relative inline-block w-[18px] h-[18px] lg:w-6 lg:h-6"
    >
      <input
        name={name}
        type="checkbox"
        onChange={() => handleCheck(checked)}
        checked={checked}
        className="absolute top-0 left-0 z-10 w-full h-full opacity-0 cursor-pointer"
        role="checkbox"
        aria-checked="false"
        aria-labelledby="Remember me"
      />
      {checked ? (
        <BsCheckSquareFill className="w-full h-full cursor-pointer text-tangerine" />
      ) : (
        <MdOutlineCheckBoxOutlineBlank className="w-full h-full cursor-pointer text-tangerine" />
      )}
    </span>
  );
}

interface RadioProps {
  label: string;
  name: string;
  value: string;
  handleSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
  selected?: boolean;
  labelStyle?: { [x: string]: any };
  disabled?: boolean;
}

export function Radio({
  value,
  label,
  name,
  handleSelect,
  selected,
  labelStyle,
  disabled,
}: RadioProps) {
  return (
    <label htmlFor={label} className="flex items-center space-x-[0.59rem]">
      <span className="relative inline-block w-[16px] h-[16px] lg:w-[1.19rem] lg:h-[1.19rem]">
        <input
          name={name}
          type="radio"
          id={label}
          value={value}
          onChange={handleSelect}
          disabled={disabled}
          checked={selected}
          className="absolute top-0 left-0 z-20 w-full h-full opacity-0 cursor-pointer disabled:cursor-default"
          role="radio"
          aria-checked="false"
        />
        {selected ? (
          <IoRadioButtonOn className="w-full h-full cursor-pointer text-tangerine" />
        ) : (
          <FiCircle className="w-full h-full cursor-pointer text-american_silver" />
        )}
      </span>
      <span
        style={labelStyle}
        className="text-black text-t14 lg:text-t16 font-product_sans first-letter:capitalize"
      >
        {label}
      </span>
    </label>
  );
}

export function TextArea({
  name,
  placeholder = "",
  classNameContainer,
  className,
  productPlaceholder,
}: textAreaProps) {
  return (
    <Field as="label" className={classNameContainer}>
      <div className="relative">
        <Field
          name={name}
          component="textarea"
          placeholder={" "}
          aria-label={placeholder || productPlaceholder}
          className={`peer ${className}`}
        />
        {/* FOR CREATE PRODUCT INPUTS */}
        {(productPlaceholder || placeholder) && (
          <p
            className={`absolute text-tangerine bg-white px-1 left-[21px] scale-[.85] font-bold duration-100 transform -translate-y-7  top-[18px] origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:font-light peer-placeholder-shown:text-light_silver peer-placeholder-shown:translate-y-0 peer-placeholder-shown:bg-transparent `}
          >
            {productPlaceholder || placeholder}
          </p>
        )}
      </div>
      <ErrorMessage name={name}>
        {(msg: string) => <p className="mt-1 text-xs text-red-500">{msg}</p>}
      </ErrorMessage>
    </Field>
  );
}
interface NumberProps {
  name: string;
  value?: string;
  handleFormatting?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  className?: string;
  classNameContainer?: string;
  productPlaceholder?: string;
  max: number;
}
export function NumberInput({
  name,
  value,
  placeholder,
  classNameContainer,
  className,
  productPlaceholder,
  handleFormatting,
  max,
}: NumberProps) {
  return (
    <Field as="label" className={classNameContainer}>
      <div className="relative">
        <Field
          name={name}
          component="input"
          type="text"
          inputMode="numeric"
          value={value}
          maxLength={max}
          placeholder={productPlaceholder ? " " : placeholder}
          aria-label={placeholder}
          onChange={handleFormatting}
          className={`peer ${className}`}
        />
        {/* FOR CREATE PRODUCT INPUTS */}
        {productPlaceholder && (
          <p
            className={`absolute text-tangerine bg-white px-1 left-[21px] scale-[.85] font-bold duration-100 transform -translate-y-7  top-[18px] origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:font-light peer-placeholder-shown:text-light_silver peer-placeholder-shown:translate-y-0 peer-placeholder-shown:bg-transparent `}
          >
            {productPlaceholder}
          </p>
        )}
      </div>
      <ErrorMessage name={name}>
        {(msg: string) => <p className="mt-1 text-xs text-red-500">{msg}</p>}
      </ErrorMessage>
    </Field>
  );
}
