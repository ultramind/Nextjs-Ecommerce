import { useRemoveProductFromCart, useUpdateCartItem } from "@api/user/cart";
import { useRemoveProductFromWishlist } from "@api/user/wishlist";
import { AuthState } from "@atoms/authenticationState";
import { useCalculatePrice } from "@hooks/useCalculatePrice";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { BsImage } from "react-icons/bs";
import { FiMinus, FiPlus } from "react-icons/fi";
import { useRecoilValue } from "recoil";
import { CartItem } from "types/cart";

function Card({ wishlist, data }: { wishlist?: boolean; data?: CartItem }) {
  const [Quantity, setQuantity] = useState(1);
  const router = useRouter();
  const { isLoggedIn, emailVerified } = useRecoilValue(AuthState);
  const { calculatePrice } = useCalculatePrice();

  useEffect(() => {
    if (data) {
      setQuantity(data?.purchaseQuantity || 0);
    }
  }, [data]);

  const { isLoading: isUpdating, mutate: update } = useUpdateCartItem();

  const increase = () => {
    // setQuantity((prev) => ++prev);
    if (!isLoggedIn && !emailVerified) {
      router.push({
        pathname: "/auth/login",
        query: {
          next: router.asPath,
        },
      });
      return;
    }

    update({
      itemId: data?.itemId,
      quantity: (data?.purchaseQuantity || 0) + 1,
    });
  };

  const decrease = () => {
    if (!isLoggedIn && !emailVerified) {
      router.push({
        pathname: "/auth/login",
        query: {
          next: router.asPath,
        },
      });
      return;
    }

    if (Quantity > 1) {
      // setQuantity((prev) => --prev);

      update({
        itemId: data?.itemId,
        quantity: (data?.purchaseQuantity || 0) - 1,
      });
      return;
    }

    if (!wishlist && Quantity === 1) {
      removeFromCard();
    }
  };

  const { isLoading: removing, mutate: remove } = useRemoveProductFromWishlist(
    data?.productId as string,
  );

  const { mutate: removeFromCard, isLoading: removingFromCart } =
    useRemoveProductFromCart(data?.itemId as string);

  const handleRemoveItemFromCart = () => {
    if (!isLoggedIn && !emailVerified) {
      router.push({
        pathname: "/auth/login",
        query: {
          next: router.asPath,
        },
      });
      return;
    }
    removeFromCard();
  };

  return (
    <div
      style={{
        opacity: removing || removingFromCart || isUpdating ? "0.5" : "1",
      }}
    >
      <div className="flex items-start space-x-[1rem] lg:space-x-[1.90rem]">
        <span className="block relative h-[5.5rem] bg-light_silver lg:h-[7.65rem] min-w-[8.83rem] md:w-[10.14rem] rounded-xs overflow-hidden">
          {data?.productImages && data?.productImages[0] ? (
            // <Image
            //   src={data?.product?.productImages[0]}
            //   alt="product image"
            //   fill
            //   loading="lazy"
            //   className="object-cover object-center"
            //   placeholder="blur"
            //   sizes="25vw"
            //   blurDataURL="data:image/webp;base64,UklGRoQCAABXRUJQVlA4WAoAAAAgAAAAagAAagAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDgglgAAAJAHAJ0BKmsAawA+0WarUaglI6KhWAqJABoJaW7f/O9jWNRgN6sOawiza38KM5x7kI68xZBmPfKN2U+roZFHu99VY1YXAAD+7tywrOoZ0S61X8PpOoS7/jSqdI0S/lfm3ABCD6nbZ+cauOsHbWS3GltBKqUmy0hx0iYp+hD1Qux78QqmwYB21rSveo5okPq51FJQn1+AAA=="
            // />
            <CldImage
              width={171}
              height={129}
              src={data?.productImages[0]}
              alt="product image"
              // crop="thumb"
              // fillBackground
              className="object-cover object-center"
            />
          ) : (
            <BsImage className="w-full h-full text-tangerine" />
          )}
        </span>
        <div className="w-full">
          <span className="flex flex-col md:flex-row md:justify-between mb-[0.47rem]">
            <Link
              href={`/product/${data?.productId}`}
              className="lg:max-w-[23.66rem] text-black hover:underline transition-all duration-100 font-product_sans text-t14 lg:text-t16 first-letter:capitalize"
            >
              {data?.productName}
            </Link>
            <h3 className="md:text-right mt-[0.47rem] md:mt-0 font-medium text-black font-roboto text-t18 lg:text-t20">
              {calculatePrice(
                (data?.currency as string) || "",
                (data?.purchaseAmount as number) || 0,
              )}
            </h3>
          </span>
          {data?.storeName && (
            <span className="text-t12 lg:text-t14 font-product_sans font-normal text-spanish_gray mb-[0.95rem] block">
              Seller: {data?.storeName}
            </span>
          )}
          <span className="flex justify-between">
            {data?.productType === "physical" && !wishlist ? (
              <span className="capitalize flex w-full md:w-auto items-center justify-between md:justify-normal md:space-x-[1rem]">
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
            ) : (
              <span></span>
            )}
            {!wishlist && (
              <span className="hidden md:flex items-center space-x-[0.95rem]">
                <span className="hidden font-normal md:block text-t16 font-product_sans text-spanish_gray">
                  Quantity:
                </span>
                <span className="flex items-center space-x-[0.75rem]">
                  <button
                    onClick={decrease}
                    disabled={Quantity === 1 || isUpdating}
                    className="bg-tangerine rounded-xs disabled:opacity-50 grid place-content-center text-white h-[1.42rem] w-[1.42rem]"
                  >
                    <FiMinus />
                  </button>
                  {isUpdating ? (
                    <BiLoaderAlt className="w-5 h-5 text-tangerine animate-spin" />
                  ) : (
                    <span className="text-t16 h-7 w-7 flex items-center justify-center transition-all duration-100 border-xs rounded-xs border-platinum font-product_sans font-normal text-spanish_gray">
                      {Quantity}
                    </span>
                  )}
                  <button
                    onClick={increase}
                    disabled={isUpdating}
                    className="bg-tangerine rounded-xs grid place-content-center disabled:opacity-50 text-white h-[1.42rem] w-[1.42rem]"
                  >
                    <FiPlus />
                  </button>
                </span>
              </span>
            )}
          </span>
        </div>
      </div>
      <span className="flex items-center justify-between mt-[0.47rem] md:mt-0">
        <button
          onClick={() => {
            if (!isLoggedIn && !emailVerified) {
              router.push({
                pathname: "/auth/login",
                query: {
                  next: router.asPath,
                },
              });
              return;
            }
            if (wishlist) {
              remove();
              return;
            }
            handleRemoveItemFromCart();
          }}
          disabled={removing || removingFromCart}
          className="text-coral_red border-b border-coral_red text-t12 lg:text-t14 font-product_sans mt-[0.47rem]"
        >
          {wishlist ? "Delete" : "Remove from cart"}
        </button>
        {!wishlist && (
          <span className="flex md:hidden items-center space-x-[0.75rem]">
            <button
              onClick={decrease}
              disabled={Quantity === 1 || isUpdating}
              className="bg-tangerine rounded-xs disabled:opacity-50 grid place-content-center text-white h-[1.42rem] w-[1.42rem]"
            >
              <FiMinus />
            </button>
            {isUpdating ? (
              <BiLoaderAlt className="w-5 h-5 text-tangerine animate-spin" />
            ) : (
              <span className="text-t16 w-7 h-7 flex items-center justify-center border-xs transition-all duration-100 rounded-xs border-platinum font-product_sans font-normal text-spanish_gray">
                {Quantity}
              </span>
            )}
            <button
              onClick={increase}
              disabled={isUpdating}
              className="bg-tangerine rounded-xs grid place-content-center disabled:opacity-50 text-white h-[1.42rem] w-[1.42rem]"
            >
              <FiPlus />
            </button>
          </span>
        )}
      </span>
    </div>
  );
}

export default Card;
