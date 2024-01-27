import Error from "@assets/illustrations/Error.svg";
import Success from "@assets/illustrations/Success.svg";
import { MobileNavigatorState } from "@atoms/mobileNavigator";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";
import { isMobile } from "react-device-detect";
import { useSetRecoilState } from "recoil";
import { PrimaryButton } from "./Buttons";

interface RequestStatusProps {
  status: string;
  message: string;
  detail: string;
  reset: any;
  resend: any;
}

function RequestStatus({
  status,
  message,
  detail,
  reset,
  resend,
}: Partial<RequestStatusProps>) {
  const setMobileNavigatorComponent = useSetRecoilState(MobileNavigatorState);
  const router = useRouter();
  const handleClick = () => {
    if (status === "error") {
      reset();
      resend();
      return;
    }

    if (isMobile) {
      setMobileNavigatorComponent("login");
      return;
    }
    router.push("/auth/login");
  };
  return (
    <>
      <span className="fixed top-0 left-0 z-30 block w-screen h-screen lg:hidden bg-cetacean_blue/40"></span>
      <div className="fixed bg-white lg:bg-transparent z-40 lg:static w-[18rem] rounded-xs lg:rounded-none lg:w-fit max-w-full top-[13.17rem] lg:top-0 lg:left-0 left-1/2 -translate-x-1/2 lg:-translate-x-0 lg:max-w-[30.56rem] mx-auto">
        <div className="p-[0.67rem] lg:p-0 lg:py-[2rem] lg:px-[3.11rem] w-full h-full">
          <span className="block mx-auto relative w-[6.67rem] lg:w-[13.44rem] h-[6rem] lg:h-[12.06rem] mb-[1.78rem]">
            <Image
              src={status === "error" ? Error : Success}
              alt="status"
              fill
            />
          </span>
          <span className="block w-fit mx-auto text-center mb-[1.33em] lg:mb-[1.78rem]">
            <h1 className="text-t24 lg:text-t40 font-medium lg:font-semibold text-black mb-[0.44rem] lg:mb-4 font-roboto">
              {status === "error" ? message : "Success!"}
            </h1>
            <p className="font-product_sans text-spanish_gray text-t14 lg:text-t16 max-w-[14.67rem] lg:max-w-[22.72rem]">
              {status === "error"
                ? detail
                : `You have Successfully created an account, proceed to your
              dashboard to view and purchase items.`}
            </p>
          </span>
          <PrimaryButton
            type="button"
            onClick={handleClick}
            text={status === "error" ? "Try again" : "Proceed to Dashboard"}
          />
        </div>
      </div>
    </>
  );
}

export default RequestStatus;
