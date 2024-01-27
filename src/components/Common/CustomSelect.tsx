import useDisclosure from "@hooks/useDisclosure";
import { ErrorMessage, Field } from "formik";
import React, { useEffect, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { InputFieldProps } from "types/inputField";

interface SelectProps extends InputFieldProps {
  // options: { label: string; value: string; code?: string }[] | string[];
  options: any[];
  onChange: (value: string, code?: string) => void;
  productPlaceholder?: string;
  handleOnClick?: (toggleFunc: () => void) => void;
  maxLength?: number;
}

function CustomSelect({
  name = "",
  value = "",
  placeholder,
  classNameContainer,
  className,
  options,
  onChange,
  productPlaceholder,
  disabled = false,
  handleOnClick,
}: SelectProps) {
  const {
    isOpen: optionsShown,
    closeModal,
    openModal,
    modalRef,
  } = useDisclosure();

  const [selectOptions, setSelectOptions] = useState(options ?? []);

  const [inputValue, setInputValue] = useState("");
  const [typing, setTyping] = useState(false);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  useEffect(() => {
    if (inputValue && typing) {
      const res = options?.filter((opt) => {
        if (
          typeof opt === "string" &&
          opt?.toLowerCase().includes(inputValue.toLowerCase())
        ) {
          return opt;
        }
        if (
          typeof opt !== "string" &&
          opt?.label?.toLowerCase().includes(inputValue.toLowerCase())
        ) {
          return opt;
        }
      });

      if (res?.length > 0) {
        setSelectOptions(
          res as { label: string; value: string; code?: string }[] | string[],
        );
        return;
      }
      if (name === "product_brand") {
        setSelectOptions([
          { value: inputValue, label: `Add as brand - ${inputValue}` },
          { value: "No option available", label: "No option available" },
        ]);
        return;
      }
      if (options?.length === 0 && name === "product_sub_category") {
        setSelectOptions(["No subcategory under the selected category"]);
        return;
      }
      setSelectOptions(["No option available"]);
      return;
    }

    setSelectOptions(options);
  }, [inputValue, options, typing]);

  return (
    <Field as="label" className={classNameContainer}>
      <div className="relative cursor-pointer" ref={modalRef}>
        <Field
          name={`custom-input-${name}`}
          value={inputValue}
          aria-label={placeholder || productPlaceholder}
          placeholder={" "}
          className={`peer disabled:bg-white ${className} capitalize`}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            if (options?.length === 0) {
              if (handleOnClick) {
                handleOnClick(openModal);
                // return;
              }
            }

            if (!optionsShown) {
              openModal();
            }
            const value = e.target.value;
            setInputValue(value);
            setTyping(true);
          }}
          onClick={() => {
            if (disabled) return;

            if (name !== "product_brand") {
              openModal();
              return;
            }
          }}
          autoComplete="off"
          aria-autocomplete="none"
        />
        <Field
          name={name}
          className={`h-0 w-0 opacity-0 overflow-hidden`}
          readOnly
          autoComplete="off"
          aria-autocomplete="none"
        />

        {/* FOR PRODUCT SELECT STYLING */}
        {(productPlaceholder || placeholder) && (
          <span
            className={`absolute text-tangerine bg-white px-1 left-[21px] z-10 scale-[.85] font-bold duration-100 transform -translate-y-7 top-[18px] origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:font-light peer-placeholder-shown:text-light_silver peer-placeholder-shown:translate-y-0 peer-placeholder-shown:bg-transparent `}
          >
            {inputValue === "" && options.length > 0
              ? `Type to search or select a '${
                  productPlaceholder || placeholder
                }'`
              : `${productPlaceholder || placeholder}`}
          </span>
        )}
        {name !== "product_brand" && (
          <>
            {optionsShown ? (
              <IoIosArrowUp className="absolute w-2 z-50 lg:w-3 h-2 lg:h-3 right-[1.88rem] top-1/2 -translate-y-1/2 cursor-pointer" />
            ) : (
              <IoIosArrowDown className="absolute z-50 right-[1.88rem] top-1/2 -translate-y-1/2 w-2 lg:w-3 h-2 lg:h-3 cursor-pointer" />
            )}
          </>
        )}
        <ul
          className={`absolute top-[3.2rem] z-50 shadow rounded-md left-0 bg-white ${
            optionsShown
              ? "max-h-[15rem] h-auto overflow-auto min-w-fit w-full"
              : "min-h-0 h-0 overflow-hidden"
          } transition-all duration-150`}
        >
          {selectOptions.length > 0 &&
            selectOptions.map((option) => {
              if (typeof option !== "string") {
                return (
                  <li key={option?.label} className="block">
                    <button
                      type="button"
                      name={name}
                      disabled={
                        option?.label === "No option available" ||
                        option?.label ===
                          "No subcategory under the selected category"
                      }
                      style={{
                        opacity:
                          option?.label === "No option available" ||
                          option?.label ===
                            "No subcategory under the selected category"
                            ? "0.5"
                            : "",
                      }}
                      onClick={() => {
                        closeModal();
                        onChange(option?.value, option?.code);
                        setTyping(false);
                      }}
                      className="block w-full text-left px-[1.5rem] py-[0.5rem] transition-colors duration-75 hover:bg-tangerine/20 first-letter:capitalize"
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
                    disabled={
                      option === "No option available" ||
                      option === "No subcategory under the selected category"
                    }
                    style={{
                      opacity:
                        option === "No option available" ||
                        option === "No subcategory under the selected category"
                          ? "0.5"
                          : "",
                    }}
                    onClick={() => {
                      closeModal();
                      onChange(option);
                      setTyping(false);
                    }}
                    className="block w-full text-left px-[1.5rem] py-[0.5rem] transition-colors duration-75 hover:bg-tangerine/20 first-letter:capitalize"
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

export default CustomSelect;
