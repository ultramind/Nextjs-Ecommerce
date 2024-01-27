import { useVerifyPayment } from "@api/checkout";
import Error from "@assets/illustrations/Error.svg";
import { AuthState } from "@atoms/authenticationState";
import { paymentMethodState } from "@atoms/summaryState";
import { userState } from "@atoms/userState";
import { PrimaryButton } from "@components/Common/Buttons";
import OrderReceipt from "@components/Modals/OrderReceipt";
import { useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { useRecoilValue } from "recoil";

function Receipt() {
  const router = useRouter();
  const { isLoggedIn } = useRecoilValue(AuthState);
  const user = useRecoilValue(userState);
  const [triedAgain, setTriedAgain] = useState(false);
  const paymentMethod = useRecoilValue(paymentMethodState);
  const queryClient = useQueryClient();
  const { isFetching, isError, refetch, data, isSuccess } = useVerifyPayment(
    (router?.query?.status as string) || "",
    paymentMethod || "paystack",
    (router?.query?.reference as string) ||
      (router?.query?.payment_id as string) ||
      (router?.query?.tx_ref as string),
    router?.query?.transaction_id as string,
  );

  useEffect(() => {
    if (isSuccess) {
      queryClient.invalidateQueries(["getUserCart"]);
    }
  }, [isSuccess]);

  if (!isLoggedIn && !user?.id) {
    return (
      <div className="grid w-full h-screen place-items-center">
        <BiLoaderAlt className="w-[2.5rem] lg:w-[3rem] h-[2.5rem] lg:h-[3rem] animate-spin text-tangerine" />
      </div>
    );
  }

  const handleClick = () => {
    if (!triedAgain) {
      setTriedAgain(true);
      refetch();
      return;
    }

    router.push("/dashboard");
  };

  const handleClose = () => {
    router.push("/orders");
  };

  return (
    <div className="relative min-h-screen h-fit max-w-full w-screen p-[1rem]">
      <Link href="/" className="block w-fit">
        <Image
          src="/niteon.svg"
          width={100}
          height={100}
          alt="niteon"
          priority
        />
      </Link>

      <div className="relative grid w-full h-screen place-items-center">
        {isFetching ? (
          <BiLoaderAlt className="w-[2.5rem] lg:w-[3rem] h-[2.5rem] lg:h-[3rem] animate-spin text-tangerine" />
        ) : data && !isError ? (
          <OrderReceipt data={data || {}} close={handleClose} />
        ) : (
          <div className="p-[0.67rem] lg:p-0 lg:py-[2rem] lg:px-[3.11rem] lg:w-fit max-w-full lg:max-w-[30.56rem] mx-auto mt-[13.17rem] w-full h-full">
            <span className="block mx-auto relative w-[6.67rem] lg:w-[13.44rem] h-[6rem] lg:h-[12.06rem] mb-[1.78rem]">
              <Image src={Error} alt="status" fill />
            </span>
            <span className="block w-fit mx-auto text-center mb-[1.33em] lg:mb-[1.78rem]">
              <h1 className="text-t24 lg:text-t40 font-medium lg:font-semibold text-black mb-[0.44rem] lg:mb-4 font-roboto">
                Failed to Verify Payment
              </h1>
            </span>
            <PrimaryButton
              type="button"
              onClick={handleClick}
              text={triedAgain ? "Go to Dashboard" : "Verify Again"}
            />
          </div>
        )}
      </div>
    </div>
  );
}

Receipt.requireAuth = true;
export default Receipt;
