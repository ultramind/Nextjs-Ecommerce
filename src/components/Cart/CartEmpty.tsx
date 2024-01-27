import ShoppingCart from "@assets/illustrations/Shopping Cart.svg";
import { userState } from "@atoms/userState";
import { PrimaryButton } from "@components/Common/Buttons";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { useRecoilValue } from "recoil";

function CartEmpty() {
  const router = useRouter();
  const { id } = useRecoilValue(userState);

  return (
    <div>
      <span className="block w-fit mx-auto lg:mx-0 relative max-w-full mb-[0.95rem]">
        <Image src={ShoppingCart} alt="empty cart" />
      </span>
      {id !== undefined ? (
        <p className="max-w-[17.19rem] mx-auto lg:max-w-full font-product_sans text-spanish_gray text-t14 lg:text-t16 mb-[1.90rem] lg:mb-[0.95rem]">
          You haven&apos;t added any items to your cart yet.
        </p>
      ) : (
        ""
      )}
      <span className="lg:max-w-[18.20rem] block">
        <PrimaryButton
          text={id !== undefined ? "Return to Shop" : "Login to view Cart"}
          onClick={() =>
            router.push(id !== undefined ? "/shop" : "/auth/login?next=/cart")
          }
        />
      </span>
    </div>
  );
}

export default CartEmpty;
