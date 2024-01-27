import Success from "@assets/illustrations/Success.svg";
import Image from "next/image";
import React from "react";
import { IoIosClose } from "react-icons/io";
import ModalContainer from "./ModalContainer";

function ProductMoved({ close, name }: { close: () => void; name: string }) {
  return (
    <ModalContainer>
      <div className="bg-white w-[20rem] z-[200] rounded-[0.5rem] p-[0.75rem] max-w-[97%] h-fit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <IoIosClose
          size={24}
          role="button"
          onClick={close}
          className="absolute right-[0.5rem] top-[0.5rem]"
        />
        <span className="block mx-auto relative w-[7.5rem] max-w-full h-[6.7rem] mb-[2rem]">
          <Image src={Success} alt="status" fill />
        </span>
        <h3 className="text-center text-black text-t20 lg:text-[1.5rem] font-medium font-roboto mb-[1rem]">
          Success!
        </h3>
        <p className="text-spanish_gray text-[0.875rem] font-product_sans text-center">
          You have successfully published{" "}
          <span className="first-letter:capitalize inline-block">‘{name}’</span>
        </p>
      </div>
    </ModalContainer>
  );
}

export default ProductMoved;
