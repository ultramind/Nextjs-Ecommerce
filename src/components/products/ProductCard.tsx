import { useEditProduct } from "@api/product";
import {
  useAddToWishlist,
  useRemoveProductFromWishlist,
} from "@api/user/wishlist";
import { AuthState } from "@atoms/authenticationState";
import { MobileNavigatorState } from "@atoms/mobileNavigator";
import { userState } from "@atoms/userState";
import { WishlistState } from "@atoms/wishlistState";
import Portal from "@components/HOC/Portal";
import ProductDeleteModal from "@components/Modals/ProductDeleteModal";
import ProductMoved from "@components/Modals/ProductMoved";
import { useCalculatePrice } from "@hooks/useCalculatePrice";
import config from "@utils/config";
import Cookies from "js-cookie";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { BiLoader, BiLoaderAlt } from "react-icons/bi";
import {
  BsFillPatchCheckFill,
  BsHeart,
  BsHeartFill,
  BsImage,
} from "react-icons/bs";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { MdPending } from "react-icons/md";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { ProductCardProps } from "types/index";
import { ProductProps } from "types/product";
import { WishlistProps } from "types/user";

export const Heart = ({
  product,
  quantity,
}: {
  product: ProductProps;
  quantity?: number;
}) => {
  const router = useRouter();
  const [isLiked, setIsLiked] = useState(false);
  const { isLoggedIn, emailVerified } = useRecoilValue(AuthState);
  const setMobileNavigatorComponent = useSetRecoilState(MobileNavigatorState);
  const accessToken = Cookies.get(config.key.token);

  const { isLoading, mutate, isSuccess } = useAddToWishlist();
  const {
    isLoading: removing,
    mutate: remove,
    isSuccess: removed,
  } = useRemoveProductFromWishlist(product?._id || product?.productId);

  const wishList = useRecoilValue(WishlistState);

  useEffect(() => {
    if (wishList?.length > 0) {
      const alreadyInWishlist: Partial<WishlistProps> =
        wishList?.find(
          (item: WishlistProps) =>
            item?.product?.productId === product?._id ||
            item?.product?.productId === product?.productId,
        ) || {};
      if (
        Object.keys(alreadyInWishlist).length > 0 &&
        alreadyInWishlist?.product?.productId
      ) {
        setIsLiked(true);
      } else {
        setIsLiked(false);
      }
    } else {
      setIsLiked(false);
    }
  }, [wishList]);

  useEffect(() => {
    if (removed && isLiked) {
      setIsLiked(false);
      return;
    }
    if (isSuccess && !isLiked) {
      setIsLiked(true);
      return;
    }
  }, [isSuccess, removed]);

  const handleClick = () => {
    if (!isLoggedIn && !emailVerified && !accessToken) {
      if (isMobile) {
        setMobileNavigatorComponent("login");
        return;
      }
      router.push({
        pathname: "/auth/login",
        query: {
          next: router.asPath,
        },
      });
      return;
    }

    if (isLiked) {
      remove();
      return;
    }

    mutate({
      quantity: quantity || 1,
      productId: product?._id || product?.productId,
    });
  };
  return (
    <button
      disabled={isLoading || removing}
      onClick={handleClick}
      className="grid w-8 h-8 bg-white rounded-full place-content-center"
    >
      {!isLoading && !removing ? (
        <>
          {isLiked ? (
            <BsHeartFill className="text-tangerine" />
          ) : (
            <BsHeart className="text-black/30" />
          )}
        </>
      ) : (
        <BiLoaderAlt className="text-tangerine w-[1rem] h-[1rem] animate-spin" />
      )}
    </button>
  );
};

// DROPDOWN MENU FOR SELLER
const SellerOptions = ({
  productName,
  product_id,
  state,
}: {
  state?: string;
  product_id?: string;
  productName?: string;
  owner?: boolean;
}) => {
  const { isLoading, mutate, isSuccess } = useEditProduct(product_id as string);
  const [toDelete, setDeleteState] = useState(false);
  const [productMoved, setProductMoved] = useState(false);

  useEffect(() => {
    if (isSuccess && state === "draft") {
      setProductMoved(true);
    }
  }, [isSuccess]);
  return (
    <>
      <div className="relative group">
        <div className="grid w-6 h-6 bg-white place-content-center rounded-xs">
          <HiOutlineDotsVertical />
        </div>
        <div className="hidden overflow-hidden bg-white rounded-lg group-hover:flex z-50 items-start absolute w-[8rem] top-6 right-0 shadow-md ">
          <div className="flex flex-col items-start flex-none order-none w-full grow-0 text-[0.95rem]">
            <Link
              href={`/seller/products/edit/${product_id}`}
              className="border-b-[0.5px] pl-2 py-[10px] text-left w-full hover:bg-gray-50"
            >
              Edit Product
            </Link>
            {state === "published" && (
              <button
                disabled={isLoading}
                onClick={() => {
                  mutate({ state: "draft" });
                }}
                className="border-b-[0.5px] pl-2 py-[10px] text-left  w-full hover:bg-gray-50"
              >
                {isLoading && state === "published" ? (
                  <BiLoader className="block w-5 h-5 mx-auto text-tangerine animate-spin" />
                ) : (
                  <span>Return to draft</span>
                )}
              </button>
            )}
            {state === "draft" && (
              <button
                disabled={isLoading}
                onClick={() => {
                  mutate({ state: "published" });
                }}
                className="border-b-[0.5px] pl-2 py-[10px] text-left  w-full hover:bg-gray-50"
              >
                {isLoading && state === "draft" ? (
                  <BiLoader className="block w-5 h-5 mx-auto text-tangerine animate-spin" />
                ) : (
                  <span>Publish Product</span>
                )}
              </button>
            )}
            <button
              onClick={() => setDeleteState(true)}
              className="border-b-[0.5px] py-[10px] pl-2 text-left w-full hover:bg-gray-50 text-[#F84343]"
            >
              Delete Product
            </button>
          </div>
        </div>
      </div>
      <Portal>
        {toDelete && (
          <ProductDeleteModal
            name={productName as string}
            close={() => setDeleteState(false)}
            productId={product_id as string}
          />
        )}
        {productMoved && (
          <ProductMoved
            name={productName as string}
            close={() => setProductMoved(false)}
          />
        )}
      </Portal>
    </>
  );
};

function ProductCard({
  item,
  productState,
  owner = false,
  className = "w-[13rem] max-w-full",
}: Partial<ProductCardProps>) {
  const { id, role } = useRecoilValue(userState);
  const { calculatePrice } = useCalculatePrice();

  return (
    <div
      className={`rounded-xs transition-all duration-100 hover:scale-105 hover:shadow-card p-[0.47rem] pb-[1.36rem] relative ${className}`}
    >
      <div className="absolute top-[0.65rem] right-[0.65rem] z-10 cursor-pointer">
        {productState ||
        (id === item?.userId && id !== null && role !== "buyer") ? (
          <SellerOptions
            productName={item?.name}
            state={item?.state}
            product_id={item?._id || item?.productId}
            owner={owner || (id === item?.userId && id !== null)}
          />
        ) : (
          <Heart product={item as ProductProps} />
        )}
      </div>
      <Link
        href={
          owner || (id === item?.userId && id !== null && role !== "buyer")
            ? `/seller/products/${item?._id || item?.productId || ""}`
            : `/product/${item?._id || item?.productId || ""}`
        }
      >
        <span className="relative w-full h-[7rem] bg-light_silver rounded-xs overflow-hidden lg:h-[9.60rem] block mb-[0.65rem] lg:mb-[0.95rem]">
          {item?.productImages && item?.productImages[0] ? (
            // <Image
            //   src={item?.productImages[0]}
            //   alt="product image"
            //   fill
            //   loading="lazy"
            //   placeholder="blur"
            //   blurDataURL="data:image/webp;base64,UklGRoQCAABXRUJQVlA4WAoAAAAgAAAAagAAagAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDgglgAAAJAHAJ0BKmsAawA+0WarUaglI6KhWAqJABoJaW7f/O9jWNRgN6sOawiza38KM5x7kI68xZBmPfKN2U+roZFHu99VY1YXAAD+7tywrOoZ0S61X8PpOoS7/jSqdI0S/lfm3ABCD6nbZ+cauOsHbWS3GltBKqUmy0hx0iYp+hD1Qux78QqmwYB21rSveo5okPq51FJQn1+AAA=="
            //   className="object-cover object-center"
            //   sizes="50vw"
            // />
            <CldImage
              width={300}
              height={162}
              src={item?.productImages[0]}
              alt="product image"
              // fillBackground
              className="object-cover object-center"
              loading="lazy"
            />
          ) : (
            <BsImage className="w-full h-full text-tangerine" />
          )}
          {/* <BsImage className="w-full h-full text-tangerine" /> */}
        </span>
        <h6 className="text-t14 first-letter:capitalize truncate-text lg:text-t16 font-product_sans text-dark_charcoal min-h-[1.78rem] lg:min-h-[2.25rem] mb-[0.30rem] lg:mb-[0.47rem]">
          {item?.name}
        </h6>
        <h4 className="text-t14 lg:text-t20 font-product_sans font-bold text-denim_blue mb-[0.30rem] lg:mb-[0.47rem]">
          {calculatePrice(
            (item?.currency as string) || "",
            owner
              ? (item?.sellerPrice as number) || (item?.price as number) || 0
              : (item?.price as number) || 0,
          )}
        </h4>
        <p
          title="Minimum Order Quantity"
          className="text-t12 font_product_sans text-tangerine"
        >
          MOQ: {item?.moq || 0}{" "}
          {item?.moq && item?.moq > 1 ? "pieces" : "piece"}
        </p>

        {owner && (
          <span
            className={`flex items-center space-x-1 ${
              item?.adminAction !== "approved"
                ? "bg-tangerine/80"
                : "bg-apple_green/80"
            } py-1 pl-1 pr-2 rounded-full w-fit text-white text-t12 font-medium mt-4`}
          >
            {item?.adminAction === "approved" ? (
              <BsFillPatchCheckFill className="w-5 h-5" />
            ) : (
              <MdPending className="w-5 h-5" />
            )}
            <span>
              {item?.adminAction === "approved"
                ? "Approved"
                : "Pending approval"}
            </span>
          </span>
        )}
      </Link>
    </div>
  );
}

export default ProductCard;
