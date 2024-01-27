import { useCalculatePrice } from "@hooks/useCalculatePrice";
import { CldImage } from "next-cloudinary";
import React from "react";
import { BsImage } from "react-icons/bs";
import { Product } from "types/orderReceipt";

function OrderCardItem({ data }: { data: Product }) {
  const { calculatePrice } = useCalculatePrice();
  return (
    <div className="flex items-start space-x-[1rem] lg:space-x-[1.90rem]">
      <span className="block relative bg-light_silver h-[5rem] lg:h-[7rem] w-[6rem] lg:w-[8.5rem] overflow-hidden rounded-xs md:w-[10.14rem]">
        {data?.productImages && data?.productImages[0] ? (
          <CldImage
            width={150}
            height={150}
            src={data?.productImages[0]}
            alt="product image"
            // fillBackground
            className="object-cover object-center"
          />
        ) : (
          <BsImage className="w-full h-full text-tangerine" />
        )}
      </span>
      <div className="w-full">
        <span className="block">
          <h3 className="text-black font-product_sans font-medium text-t14 lg:text-t16 mb-[0.47rem]">
            {data?.productName}
          </h3>
          <h3 className="md:my-[0.65rem] md:mt-0 font-medium text-denim_blue font-roboto text-t18 lg:text-t20">
            {calculatePrice(data?.currency, data?.purchaseAmount)}
          </h3>
        </span>
        <span className="text-t12 lg:text-t14 font-product_sans font-normal text-spanish_gray mt-[0.5rem] mb-[0.95rem] md:my-[0.95rem] block">
          Seller: {data?.storeName}
        </span>
        <span className="flex flex-col md:flex-row md:justify-between space-y-5 md:space-y-0 md:gap-x-5">
          <span className="flex w-full md:w-auto items-center capitalize justify-between md:justify-normal md:space-x-[1rem]">
            {data?.size && (
              <span className="grid place-content-center border border-platinum text-tangerine text-t12 lg:text-t14 font-product_sans rounded-xs bg-tangerine/10 py-[0.24rem] px-[0.47rem]">
                Size: {data?.size}
              </span>
            )}
            {data?.color && (
              <span
                style={{
                  background:
                    data?.color?.toLowerCase() !== "white"
                      ? data?.color?.toLowerCase()
                      : "black" || "black",
                }}
                className="grid place-content-center border border-white text-white text-t12 lg:text-t14 font-product_sans rounded-xs py-[0.24rem] px-[0.47rem]"
              >
                Color: {data?.color}
              </span>
            )}
          </span>
          <span className="grid place-content-center border whitespace-nowrap border-platinum text-tangerine text-t12 w-fit lg:text-t14 font-product_sans rounded-xs bg-tangerine/10 py-[0.24rem] px-[0.47rem]">
            Quantity: {data?.purchaseQuantity}
          </span>
        </span>
      </div>
    </div>
  );
}

export default OrderCardItem;
