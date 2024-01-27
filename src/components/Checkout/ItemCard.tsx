import { useCalculatePrice } from "@hooks/useCalculatePrice";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import React from "react";
import { BsImage } from "react-icons/bs";
import { CartItem } from "types/cart";

function ItemCard({ data }: { data?: CartItem }) {
  const { calculatePrice } = useCalculatePrice();

  return (
    <Link href={`/product/${data?.productId}`} className="block">
      <div className="w-[12rem] md:w-[14rem] max-w-full flex flex-col space-y-[1.50rem] px-[0.95rem]">
        <span className="block h-[6.5rem] bg-light_silver lg:h-[8.5rem] relative overflow-hidden rounded-xs">
          {data?.productImages && data?.productImages[0] ? (
            <CldImage
              width={263}
              height={129}
              src={data?.productImages[0]}
              alt="product image"
              // fillBackground
              className="object-cover object-center"
            />
          ) : (
            <BsImage className="w-full h-full text-tangerine" />
          )}
        </span>
        <span className="block w-full">
          <h4 className="text-t14 lg:text-t16 font-product_sans text-black mb-[0.47rem] first-letter:capitalize">
            {data?.productName}
          </h4>
          <h3 className="text-t16 lg:text-t20 font-roboto font-medium text-denim_blue mb-[0.47rem]">
            {calculatePrice(
              (data?.currency as string) || "",
              (data?.purchaseAmount as number) || 0,
            )}
          </h3>
          <span className="hidden lg:block text-t14 font-product_sans text-spanish_gray mb-[0.95rem]">
            Seller: {data?.storeName}
          </span>
          {data?.productType === "physical" && (
            <span className="flex items-center space-x-[0.95rem]">
              <span className="grid place-content-center border border-platinum text-tangerine text-t12 lg:text-t14 font-product_sans rounded-xs bg-tangerine/10 py-[0.24rem] px-[0.47rem]">
                Size: {data?.size || "None"}
              </span>
              <span
                style={{
                  background:
                    data?.color?.toLowerCase() !== "white"
                      ? data?.color?.toLowerCase()
                      : "black" || "black",
                }}
                className="grid place-content-center border border-white text-white text-t12 lg:text-t14 font-product_sans rounded-xs py-[0.24rem] px-[0.47rem]"
              >
                Color: {data?.color || "None"}
              </span>
            </span>
          )}
        </span>
      </div>
    </Link>
  );
}

export default ItemCard;
