import { SecondaryButton } from "@components/Common/Buttons";
import { useCalculatePrice } from "@hooks/useCalculatePrice";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import React from "react";
import { BsImage } from "react-icons/bs";
import { ProductProps } from "types/product";
import ModalContainer from "./ModalContainer";

interface Props {
  close: () => void;
  product: ProductProps;
  color?: string;
  size?: string;
  quantity?: number;
}

function AddedToCart({ close, product, size, color, quantity = 1 }: Props) {
  const { calculatePrice } = useCalculatePrice();

  return (
    <ModalContainer>
      <div className="bg-white w-[19.21rem] lg:w-[35.57rem] max-w-full min-h-[25.02rem] relative left-1/2 -translate-x-1/2 top-[5.81rem] lg:top-[8rem] p-[0.85rem] pt-[2rem] lg:py-[3.20rem] lg:px-[3.32rem]">
        <h2 className="text-t20 text-center lg:text-left lg:text-t24 font-roboto text-black font-medium">
          Your item has been added to cart
        </h2>
        <div className="my-[1.5rem] lg:my-[2.37rem] flex flex-col md:flex-row space-y-[1.90rem] px-[0.95rem] md:px-0 md:space-y-0 md:space-x-[1.90rem]">
          <span className="block min-w-[8.89rem] bg-light_silver max-w-full h-[8.89rem] relative rounded-xs overflow-hidden">
            {product?.productImages && product?.productImages[0] ? (
              // <Image
              //   src={product?.productImages[0]}
              //   alt="product image"
              //   fill
              //   loading="lazy"
              //   className="object-cover object-center"
              //   placeholder="blur"
              //   sizes="45vw"
              //   blurDataURL="data:image/webp;base64,UklGRoQCAABXRUJQVlA4WAoAAAAgAAAAagAAagAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDgglgAAAJAHAJ0BKmsAawA+0WarUaglI6KhWAqJABoJaW7f/O9jWNRgN6sOawiza38KM5x7kI68xZBmPfKN2U+roZFHu99VY1YXAAD+7tywrOoZ0S61X8PpOoS7/jSqdI0S/lfm3ABCD6nbZ+cauOsHbWS3GltBKqUmy0hx0iYp+hD1Qux78QqmwYB21rSveo5okPq51FJQn1+AAA=="
              // />
              <CldImage
                // width={150}
                // height={150}
                src={product?.productImages[0]}
                alt="product image"
                // fillBackground
                fill
                sizes="100vw"
                className="object-cover object-center"
              />
            ) : (
              <BsImage className="w-full h-full text-tangerine" />
            )}
          </span>
          <span className="block w-full">
            <h4 className="text-t16 font-product_sans text-black mb-[0.5rem]">
              {product?.name}
            </h4>
            <h3 className="text-t20 font-roboto font-medium text-denim_blue mb-[0.5rem]">
              {calculatePrice(product?.currency, product?.price * quantity)}
            </h3>
            <span className="text-t14 font-product_sans text-spanish_gray mb-[0.5rem] block">
              Seller: {product?.storeName}
            </span>
            <span className="text-t14 font-product_sans text-spanish_gray mb-[0.95rem] block">
              Quantity: {quantity}
            </span>
            {product?.type === "physical" && (
              <span className="flex items-center space-x-[0.95rem]">
                <span className="grid place-content-center border border-platinum text-tangerine text-t14 font-product_sans rounded-xs bg-tangerine/10 py-[0.24rem] px-[0.47rem]">
                  Size: {size}
                </span>
                <span
                  style={{
                    background:
                      color?.toLowerCase() !== "white"
                        ? color?.toLowerCase()
                        : "black" || "black",
                  }}
                  className="grid place-content-center border border-white text-white text-t14 font-product_sans rounded-xs py-[0.24rem] px-[0.47rem]"
                >
                  Color: {color}
                </span>
              </span>
            )}
          </span>
        </div>
        <span className="flex flex-col md:flex-row items-center space-y-[0.47rem] md:space-y-0 md:space-x-[0.47rem]">
          <SecondaryButton text="Continue Shopping" onClick={close} />
          {/* <PrimaryButton
            text="View Cart"
            onClick={() => router.push("/cart")}
          /> */}
          <Link
            href="/cart"
            className="w-full py-4 font-medium font-roboto text-center text-14 lg:text-t16 disabled:opacity-50 !leading-[1.11rem] rounded-xs text-white bg-tangerine"
          >
            View Cart
          </Link>
        </span>
      </div>
    </ModalContainer>
  );
}

export default AddedToCart;
