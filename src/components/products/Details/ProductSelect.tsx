import useDisclosure from "@hooks/useDisclosure";
import React from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { InputFieldProps } from "types/inputField";

interface SelectProps extends InputFieldProps {
  options: string[];
  onChange: (value: string) => void;
  value?: string;
}

function ProductSelect({
  name,
  placeholder,
  classNameContainer,
  className,
  options,
  value,
  onChange,
}: SelectProps) {
  const {
    toggleModal,
    isOpen: optionsShown,
    closeModal,
    modalRef,
  } = useDisclosure();

  return (
    <label className={classNameContainer}>
      <div
        className="relative cursor-pointer"
        onClick={toggleModal}
        ref={modalRef}
      >
        <input
          name={name}
          aria-label={placeholder}
          placeholder={placeholder}
          value={value}
          className={`disabled:bg-white ${className} capitalize cursor-pointer`}
          // disabled
          readOnly
        />
        {value && (
          <p
            className={`absolute text-tangerine bg-white px-1 left-[8px] scale-[.85] font-bold duration-100 transform -translate-y-7 top-[19px] origin-[0] peer-placeholder-shown:scale-100 peer-placeholder-shown:font-light peer-placeholder-shown:text-light_silver peer-placeholder-shown:translate-y-0 peer-placeholder-shown:bg-transparent `}
          >
            {placeholder}
          </p>
        )}
        {optionsShown ? (
          <IoIosArrowUp className="absolute w-2 lg:w-3 h-2 lg:h-3 right-[1rem] top-1/2 -translate-y-1/2 cursor-pointer text-tangerine" />
        ) : (
          <IoIosArrowDown className="absolute right-[1rem] top-1/2 -translate-y-1/2 w-2 lg:w-3 h-2 lg:h-3 cursor-pointer text-tangerine" />
        )}
        {/* min-h-[7.28rem] */}
        <ul
          className={`absolute top-[2.7rem] z-50 shadow rounded-md left-0 w-full bg-white ${
            optionsShown ? "min-h-fit h-auto" : "min-h-0 h-0"
          } overflow-hidden transition-all duration-150`}
        >
          {options.length > 0 &&
            options.map((option) => (
              <li key={option} className="block">
                <button
                  type="button"
                  name={name}
                  onClick={() => {
                    closeModal();
                    onChange(option);
                  }}
                  className="capitalize block w-full text-left px-[1.5rem] py-[0.5rem] transition-colors duration-75 hover:bg-tangerine/20"
                >
                  {option}
                </button>
              </li>
            ))}
        </ul>
      </div>
    </label>
  );
}

export default ProductSelect;
