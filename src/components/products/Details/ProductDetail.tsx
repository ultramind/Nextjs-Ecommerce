import { useGetRefreshToken } from "@api/authentication";
import { useEditProduct } from "@api/product";
import { useAddToCart } from "@api/user/cart";
import { AuthState } from "@atoms/authenticationState";
import { MobileNavigatorState } from "@atoms/mobileNavigator";
import { userState } from "@atoms/userState";
import { PrimaryButton, SecondaryButton } from "@components/Common/Buttons";
import Portal from "@components/HOC/Portal";
import AddedToCart from "@components/Modals/AddedToCart";
import ProductMoved from "@components/Modals/ProductMoved";
import { useCalculatePrice } from "@hooks/useCalculatePrice";
import { removeEmptyProperties } from "@utils/RemoveEmptyProps";
import config from "@utils/config";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import { isMobile } from "react-device-detect";
import toast from "react-hot-toast";
import { FiMinus, FiPlus } from "react-icons/fi";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { ProductProps } from "types/product";
import Rating from "../Rating";
import ProductImages from "./ProductImages";
import ProductSelect from "./ProductSelect";

interface ProductDetailProps {
  product: ProductProps;
  productState?: string;
  totalReview?: number;
  fromSeller?: boolean;
}

function ProductDetail({
  product,
  productState,
  fromSeller = false,
}: ProductDetailProps) {
  const router = useRouter();
  const { isLoggedIn, emailVerified } = useRecoilValue(AuthState);
  const { id } = useRecoilValue(userState);
  const [showAddedToCartModal, setShowAddedToCartModalState] = useState(false);
  const [Quantity, setQuantity] = useState(1);
  const [productMoved, setProductMoved] = useState(false);
  const setMobileNavigatorComponent = useSetRecoilState(MobileNavigatorState);

  // refresh access token
  const { refetch } = useGetRefreshToken(!fromSeller);

  const { calculatePrice } = useCalculatePrice();

  const [color, setColor] = useState("");
  const [size, setSize] = useState("");

  const {
    isLoading: updating,
    mutate,
    isSuccess: published,
  } = useEditProduct(router?.query?.slug as string);

  useEffect(() => {
    if (published && productState === "draft") {
      setProductMoved(true);
    }
  }, [published]);

  const selectContainerStyle = productState ? "w-full md:w-1/2" : "";
  const primaryBtnTitle = useMemo(() => {
    return productState == "published" ? "Move to Drafts" : "Publish Product";
  }, [productState]);

  const increase = () => {
    if (Quantity !== product?.quantity) {
      setQuantity((prev) => ++prev);
    }
  };

  const decrease = () => {
    if (Quantity > 1) {
      setQuantity((prev) => --prev);
    }
  };

  const { isLoading, isSuccess, mutate: addToCart } = useAddToCart();

  useEffect(() => {
    if (isSuccess) {
      setShowAddedToCartModalState(true);
    }
  }, [isSuccess]);

  const addToCartHandler = () => {
    const accessToken = Cookies.get(config.key.token);
    const refreshToken = Cookies.get(config.key.refresh);

    if (!isLoggedIn && !emailVerified && !accessToken && !refreshToken) {
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

    if (Quantity < product?.moq) {
      toast.error(`You must purchase ${product?.moq} or more quantities.`);
      return;
    }

    const data = {
      quantity: Quantity,
      productId: product?._id,
      color,
      size,
    };
    removeEmptyProperties(data);

    if (!accessToken && refreshToken) {
      refetch().then(() => {
        setTimeout(() => {
          addToCart(data);
        }, 1000);
      });
      return;
    }

    addToCart(data);
  };
  return (
    <>
      <div className="lg:grid max-w-full space-y-[2.02rem] lg:grid-cols-2 lg:min-h-[25.38rem] lg:gap-[1.5rem] mb-[3.56rem]">
        <div className="h-full max-w-full overflow-hidden">
          <ProductImages
            fromSeller={fromSeller || id === product?.userId}
            product={product}
            quantity={Quantity}
          />
        </div>
        <div className="max-w-full lg:max-w-[33.02rem]">
          <span
            title="Minimum Order Quantity"
            className="grid place-content-center w-fit text-tangerine mb-2 text-t12 lg:text-t14 font-product_sans rounded-xs bg-tangerine/10 py-[0.24rem] px-[0.47rem]"
          >
            MOQ: {product?.moq}
          </span>
          <span className="block lg:max-w-[29rem] overflow-hidden max-w-full">
            <h1 className="text-black text-t20 lg:text-t32 font-roboto first-letter:capitalize">
              {product?.name}
            </h1>
            <span className="flex items-center my-[0.95rem] space-x-[1.19rem]">
              <Rating
                filled={Math.round(product?.rating?.averageRating || 0)}
                unfilled={5 - Math.round(product?.rating?.averageRating || 0)}
              />
              <span className="text-granite_gray font-product_sans text-t14">
                (
                <span className="underline underline-offset-4">
                  {product?.rating?.totalReview || 0} verified rating
                  {product?.rating?.totalReview > 1 ? "s" : ""}
                </span>
                )
              </span>
            </span>
            <h5 className="truncate text-spanish_gray text-t14 lg:text-t16 font-product_sans">
              {product?.description}
            </h5>
          </span>
          <span className="flex items-center justify-between mt-[1.42rem] mb-[2.37rem] lg:my-[1.90rem]">
            <span className="flex items-end font-medium text-black font-roboto">
              <h4 className="text-t24 lg:text-t32">
                {calculatePrice(
                  product?.currency,
                  fromSeller
                    ? Quantity > 0
                      ? (product?.sellerPrice || product?.price) * Quantity
                      : product?.sellerPrice || product?.price
                    : Quantity > 0
                    ? product?.price * Quantity
                    : product?.price,
                )}
              </h4>
              {Quantity < 2 && <span className="text-t16">/piece</span>}
            </span>

            <span className="grid place-content-center border border-platinum text-tangerine text-t12 lg:text-t14 font-product_sans rounded-xs bg-tangerine/10 py-[0.24rem] px-[0.47rem]">
              {product?.quantity} piece{product?.quantity > 1 ? "s" : ""} left
            </span>
          </span>
          <span className="flex md:items-center mb-[1.90rem] flex-col md:flex-row md:justify-between space-y-[0.95rem] md:space-y-0 md:space-x-[0.47rem]">
            {!productState && (
              <span className="flex md:hidden items-center space-x-[0.95rem] justify-between">
                <span className="block font-normal text-t14 font-product_sans text-spanish_gray">
                  Quantity:
                </span>
                <span className="flex items-center space-x-[0.95rem]">
                  <button
                    onClick={decrease}
                    disabled={Quantity === 1}
                    className="bg-tangerine rounded-xs disabled:opacity-50 grid place-content-center text-white h-[1.42rem] w-[1.42rem]"
                  >
                    <FiMinus />
                  </button>
                  {/* <span className="text-t16 px-[0.47rem] transition-all duration-100 border-xs rounded-xs border-platinum py-[0.18rem] font-product_sans font-normal text-spanish_gray">
                    {Quantity}
                  </span> */}
                  <input
                    type="number"
                    value={Quantity === 0 ? "" : Quantity}
                    min={1}
                    max={product?.quantity}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (Number(e.target.value) <= product?.quantity) {
                        setQuantity(Number(e.target.value));
                        return;
                      }
                    }}
                    className="text-t16 px-[0.47rem] transition-all w-[2.25rem] text-center duration-100 border-xs rounded-xs border-platinum py-[0.18rem] font-product_sans font-normal text-spanish_gray outline-none"
                    name="quantity"
                  />
                  <button
                    onClick={increase}
                    disabled={Quantity === product?.quantity}
                    className="bg-tangerine rounded-xs grid place-content-center disabled:opacity-50 text-white h-[1.42rem] w-[1.42rem]"
                  >
                    <FiPlus />
                  </button>
                </span>
              </span>
            )}

            {product?.type === "physical" && (
              <>
                {product?.size?.length > 0 && (
                  <ProductSelect
                    name="size"
                    placeholder="Select Size:"
                    classNameContainer={`${selectContainerStyle} block w-full font-product_sans font-normal text-t14`}
                    className="w-full border-platinum border-xs pl-[0.47rem] outline-none py-[0.65rem] placeholder:text-dark_charcoal rounded-xs"
                    options={
                      product?.size?.sort((a: any, b: any) => {
                        if (!isNaN(Number(a)) && !isNaN(Number(b))) {
                          return a - b;
                        }
                        return a.localeCompare(b);
                      }) || []
                    }
                    onChange={(value) => setSize(value)}
                    value={size}
                  />
                )}
                {product?.color?.length > 0 && (
                  <ProductSelect
                    name="color"
                    placeholder="Select Color:"
                    classNameContainer={`${selectContainerStyle} block w-full font-product_sans font-normal text-t14`}
                    className="w-full border-platinum border-xs pl-[0.47rem] outline-none py-[0.65rem] placeholder:text-dark_charcoal rounded-xs"
                    options={
                      product?.color?.sort((a, b) => a.localeCompare(b)) || []
                    }
                    value={color}
                    onChange={(value) => setColor(value)}
                  />
                )}
              </>
            )}
            {!productState && (
              <span className="hidden md:flex items-center space-x-[0.95rem]">
                <span className="block font-normal text-t16 font-product_sans text-spanish_gray">
                  Quantity:
                </span>
                <span className="flex items-center space-x-[0.95rem]">
                  <button
                    onClick={decrease}
                    disabled={Quantity === 1}
                    className="bg-tangerine rounded-xs disabled:opacity-50 grid place-content-center text-white h-[1.42rem] w-[1.42rem]"
                  >
                    <FiMinus />
                  </button>
                  {/* <span className="text-t16 px-[0.47rem] transition-all duration-100 border-xs rounded-xs border-platinum py-[0.18rem] font-product_sans font-normal text-spanish_gray">
                    {Quantity}
                  </span> */}
                  <input
                    type="number"
                    value={Quantity === 0 ? "" : Quantity}
                    min={1}
                    max={product?.quantity}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                      if (Number(e.target.value) <= product?.quantity) {
                        setQuantity(Number(e.target.value));
                        return;
                      }
                    }}
                    className="text-t16 px-[0.47rem] transition-all w-[2.25rem] text-center duration-100 border-xs rounded-xs border-platinum py-[0.18rem] font-product_sans font-normal text-spanish_gray outline-none"
                    name="quantity"
                  />
                  <button
                    onClick={increase}
                    disabled={Quantity === product?.quantity}
                    className="bg-tangerine rounded-xs grid place-content-center disabled:opacity-50 text-white h-[1.42rem] w-[1.42rem]"
                  >
                    <FiPlus />
                  </button>
                </span>
              </span>
            )}
          </span>
          {(productState || (id === product?.userId && id !== null)) && (
            <span className="flex items-center space-x-[0.47rem]">
              <SecondaryButton
                text="Edit Product"
                onClick={() =>
                  router.push(`/seller/products/edit/${product?._id}`)
                }
              />
              <PrimaryButton
                disabled={updating}
                onClick={() =>
                  mutate({
                    state: productState == "published" ? "draft" : "published",
                  })
                }
                text={primaryBtnTitle}
              />
            </span>
          )}
          {!productState && id !== product?.userId && (
            <PrimaryButton
              disabled={
                isLoading ||
                (((color === "" && product?.color?.length > 0) ||
                  (size === "" && product?.size?.length > 0)) &&
                  product?.type === "physical") ||
                product?.quantity === 0
              }
              text={product?.quantity === 0 ? "Out of Stock" : "Add to Cart"}
              onClick={addToCartHandler}
            />
          )}
        </div>
      </div>
      {showAddedToCartModal && (
        <AddedToCart
          product={product}
          size={size}
          color={color}
          quantity={Quantity}
          close={() => setShowAddedToCartModalState(false)}
        />
      )}
      <Portal>
        {productMoved && (
          <ProductMoved
            name={product?.name}
            close={() => setProductMoved(false)}
          />
        )}
      </Portal>
    </>
  );
}

export default ProductDetail;
