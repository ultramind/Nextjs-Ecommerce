import Bag from "@assets/illustrations/Artboard.svg";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { PrimaryButton } from "./Buttons";

function ProductEmptyState({
  text,
  className,
  fromSeller,
  fromTopPick,
  shop,
}: {
  text: string;
  className?: string;
  fromSeller?: boolean;
  fromTopPick?: boolean;
  shop?: boolean;
}) {
  const router = useRouter();
  return (
    <div className={className}>
      <span className="block w-fit mx-auto relative max-w-full mb-[0.95rem]">
        <Image src={Bag} alt="empty cart" />
      </span>
      <p className="max-w-[17.19rem] text-center mx-auto lg:max-w-full font-product_sans text-spanish_gray text-t14 lg:text-t16 mb-[1.90rem] lg:mb-[0.95rem]">
        {text}
      </p>
      {!fromTopPick && !shop && (
        <span className="lg:max-w-[18.20rem] mx-auto block">
          <PrimaryButton
            text={
              fromSeller
                ? "Create a Product"
                : shop
                ? router?.query?.category
                  ? "Explore other Categories"
                  : "Return to Shop"
                : "Return to Shop"
            }
            onClick={() => {
              if (fromSeller) {
                return router.push("/seller/products/create-product");
              }
              router.push("/shop");
            }}
          />
        </span>
      )}

      {shop && router?.query?.category && (
        <span className="lg:max-w-[18.20rem] mx-auto block">
          <PrimaryButton
            text={fromSeller ? "Create a Product" : "Explore other Categories"}
            onClick={() => {
              if (fromSeller) {
                return router.push("/seller/products/create-product");
              }
              router.push("/shop");
            }}
          />
        </span>
      )}
    </div>
  );
}

export default ProductEmptyState;
