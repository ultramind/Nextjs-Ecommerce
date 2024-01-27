import { MobileNavigatorState } from "@atoms/mobileNavigator";
import { PrimaryButton, SecondaryButton } from "@components/Common/Buttons";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useSetRecoilState } from "recoil";

function ChooseAccountType({ isFromModal }: { isFromModal?: boolean }) {
  const setMobileNavigatorComponent = useSetRecoilState(MobileNavigatorState);
  const router = useRouter();
  const goBack = () => {
    router.back();
  };

  return (
    <div>
      <div className="mb-[3.00rem] lg:mb-[3.72rem] 2xl:mb-[11.72rem] lg:p-0 lg:py-[3rem] lg:px-[3.11rem]">
        <span className="block lg:w-fit px-[0.44rem] lg:px-0 lg:mx-auto lg:text-center mb-[1.33em] lg:mb-[1.78rem]">
          <span
            className={`flex items-center space-x-[0.47rem] lg:space-x-0 lg:justify-center ${
              isFromModal ? "mb-[0.44rem] lg:mb-[1.54rem]" : "mb-[1.54rem]"
            } lg:mb-4`}
          >
            {!isFromModal && (
              <IoIosArrowBack
                className="lg:hidden w-[1.42rem] h-[1.42rem]"
                role="button"
                onClick={goBack}
              />
            )}
            <h1 className="text-t24 lg:text-t40 font-medium lg:font-semibold text-black font-roboto">
              Create an account
            </h1>
          </span>
          <p className="font-product_sans text-spanish_gray text-t14 lg:text-t16">
            What type of account do you want to create?
          </p>
        </span>
        <span className="block space-y-[1.78rem]">
          <PrimaryButton
            text={"Create a Buyer Account"}
            type="button"
            onClick={() => {
              router.push("/auth/register");
              setMobileNavigatorComponent("");
            }}
          />
          <SecondaryButton
            type="button"
            text="Create a Seller Account"
            onClick={() => {
              router.push("/auth/seller");
              setMobileNavigatorComponent("");
            }}
          />
        </span>
      </div>
      <span className="hidden mx-auto font-normal lg:block w-fit text-t12 lg:text-t14 font-product_sans text-dark_charcoal">
        Already have an account?{" "}
        <Link
          onClick={() => setMobileNavigatorComponent("login")}
          href={isFromModal ? "#" : "/auth/login"}
          className="text-tangerine"
        >
          Log In
        </Link>
      </span>
    </div>
  );
}

export default ChooseAccountType;
