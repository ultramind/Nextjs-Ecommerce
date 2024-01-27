import useDisclosure from "@hooks/useDisclosure";
import { ErrorMessage, Field } from "formik";
import React from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { InputFieldProps } from "types/inputField";
interface SelectProps extends InputFieldProps {
  options: { label: string; value: string; code?: string }[] | string[];
  onChange: (value: string, code?: string) => void;
  productPlaceholder?: string;
}

function Select({
  name,
  placeholder,
  classNameContainer,
  className,
  options,
  onChange,
  productPlaceholder,
  disabled = false,
}: SelectProps) {
  const {
    openModal,
    isOpen: optionsShown,
    closeModal,
    modalRef,
  } = useDisclosure();

  return (
    <Field as="label" className={classNameContainer}>
      <div
        className="relative cursor-pointer"
        // onClick={() => {
        //   if (disabled) return;
        //   openModal();
        // }}
        ref={modalRef}
      >
        <Field
          name={name}
          // value={name}
          aria-label={placeholder || productPlaceholder}
          placeholder={" "}
          className={`peer disabled:bg-white ${className} capitalize cursor-pointer`}
          onClick={() => {
            if (disabled) return;
            openModal();
          }}
          // disabled
          readOnly
          style={{
            opacity: disabled ? "0.5" : "1",
          }}
        />

        {/* FOR PRODUCT SELECT STYLING */}
        {(productPlaceholder || placeholder) && (
          <span
            onClick={() => {
              if (disabled) return;
              openModal();
            }}
            className={`absolute text-tangerine bg-white px-1 left-[21px] scale-[.85] cursor-pointer font-bold duration-100 transform -translate-y-7 top-[18px] origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:font-light peer-placeholder-shown:text-light_silver z-10 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:bg-transparent `}
          >
            {productPlaceholder || placeholder}
          </span>
        )}

        {optionsShown ? (
          <IoIosArrowUp className="absolute w-2 lg:w-3 z-50 h-2 lg:h-3 right-[1.88rem] top-1/2 -translate-y-1/2 cursor-pointer" />
        ) : (
          <IoIosArrowDown className="absolute z-50 right-[1.88rem] top-1/2 -translate-y-1/2 w-2 lg:w-3 h-2 lg:h-3 cursor-pointer" />
        )}
        <ul
          className={`absolute top-[3.2rem] z-50 shadow rounded-md left-0 bg-white ${
            optionsShown
              ? "max-h-[15rem] h-auto overflow-auto min-w-fit w-full"
              : "min-h-0 h-0 overflow-hidden"
          } transition-all duration-150`}
        >
          {options.length > 0 &&
            options.map((option) => {
              if (typeof option !== "string") {
                return (
                  <li key={option?.label} className="block">
                    <button
                      type="button"
                      name={name}
                      onClick={() => {
                        closeModal();
                        onChange(option?.value, option?.code);
                      }}
                      className="block w-full text-left px-[1.5rem] py-[0.5rem] transition-colors duration-75 hover:bg-tangerine/20 capitalize"
                    >
                      {option?.label}
                    </button>
                  </li>
                );
              }
              return (
                <li key={option} className="block">
                  <button
                    type="button"
                    name={name}
                    onClick={() => {
                      closeModal();
                      onChange(option);
                    }}
                    className="block w-full text-left px-[1.5rem] py-[0.5rem] transition-colors duration-75 hover:bg-tangerine/20 capitalize"
                  >
                    {option}
                  </button>
                </li>
              );
            })}
        </ul>
      </div>
      <ErrorMessage name={name}>
        {(msg: string) => <p className="mt-1 text-xs text-red-500">{msg}</p>}
      </ErrorMessage>
    </Field>
  );
}

export default Select;
