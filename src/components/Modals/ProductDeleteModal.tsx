import { useDeleteProduct } from "@api/product";
import { PrimaryButton, SecondaryButton } from "@components/Common/Buttons";
import React, { useEffect } from "react";
import { IoIosClose } from "react-icons/io";
import ModalContainer from "./ModalContainer";

function ProductDeleteModal({
  close,
  name,
  productId,
}: {
  close: () => void;
  productId: string;
  name: string;
}) {
  const {
    isLoading: isDeleting,
    mutate: deleteProduct,
    isSuccess,
  } = useDeleteProduct(productId);

  useEffect(() => {
    if (isSuccess) {
      close();
    }
  }, [isSuccess]);
  return (
    <ModalContainer>
      <div className="bg-white w-[20rem] z-[200] rounded-[0.5rem] p-[0.75rem] max-w-[97%] h-fit absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
        <IoIosClose
          size={24}
          role="button"
          onClick={close}
          className="absolute right-[0.5rem] top-[0.5rem]"
        />
        <h3 className="text-center text-black text-t20 lg:text-[1.5rem] font-medium font-roboto mb-[1rem]">
          Delete product
        </h3>
        <p className="text-spanish_gray text-[0.875rem] font-product_sans text-center mb-[2rem]">
          Are you sure you want to delete{" "}
          <span className="first-letter:capitalize inline-block">‘{name}’</span>
        </p>
        <PrimaryButton
          disabled={isDeleting}
          text="Yes, Delete"
          onClick={() => deleteProduct()}
        />
        <SecondaryButton
          disabled={isDeleting}
          text="No, Return to products"
          onClick={close}
          style={{
            border: "none",
            padding: 0,
            marginTop: "1rem",
            textAlign: "center",
            fontSize: "0.875rem",
            fontFamily: "var(--font-roboto)",
            fontWeight: 500,
            lineHeight: "1.25rem",
          }}
        />
      </div>
    </ModalContainer>
  );
}

export default ProductDeleteModal;
