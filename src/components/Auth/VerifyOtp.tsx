import {
  useForgotPassword,
  useResendOtp,
  useVerifyAccount,
} from "@api/authentication";
import { MobileNavigatorState } from "@atoms/mobileNavigator";
import { verifyOtpState } from "@atoms/verifyOtpState";
import { PrimaryButton } from "@components/Common/Buttons";
import RequestStatus from "@components/Common/RequestStatus";
import useCountdown from "@hooks/useCountdown";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import toast from "react-hot-toast";
import { IoIosArrowBack } from "react-icons/io";
import OTPInput from "react-otp-input";
import { useRecoilState, useSetRecoilState } from "recoil";

function VerifyOtp({ isFromModal }: { isFromModal?: boolean }) {
  const router = useRouter();
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [detail, setDetail] = useState("");
  const [otp, setOtp] = useState("");
  const { countdown, setCountdown } = useCountdown();
  const {
    isLoading,
    mutate,
    isSuccess: verifiedAccount,
    isError,
    error,
    reset,
  } = useVerifyAccount();
  const [{ type, email }, setState] = useRecoilState(verifyOtpState);
  const { isLoading: resendingPROtp, mutate: resendPasswordResetOtp } =
    useForgotPassword(email);
  const { isLoading: resending, mutate: resend, isSuccess } = useResendOtp();
  const [_type, setType] = useState("email");
  const setMobileNavigatorComponent = useSetRecoilState(MobileNavigatorState);

  useEffect(() => {
    if (router?.query?.code) {
      setOtp((router?.query?.code as string) || "");
    }

    if (router?.query?.email) {
      setState({
        email: router?.query?.email as string,
        type: (router?.query?.type as string) || "email",
      });
    }
  }, [router?.query]);

  useEffect(() => {
    if (type) {
      setType(type);
    }
  }, [type]);

  const verifyHandler = () => {
    if (!email) {
      toast.error("No email");
      router.push("/auth/login");
      return;
    }
    if (type === "email") {
      mutate({ otp, email });
      return;
    }
    setState({ type, otp, email });
    if (isMobile) {
      setMobileNavigatorComponent("resetPassword");
      return;
    }
    router.push("/auth/reset");
  };

  const resendHandler = () => {
    setStatus("");
    setMessage("");
    setDetail("");
    if (type === "email") {
      resend(email);
      return;
    }
    resendPasswordResetOtp({ email });
  };

  useEffect(() => {
    if (isSuccess) setCountdown(60);
  }, [isSuccess, setCountdown]);

  useEffect(() => {
    if (isError) {
      setStatus("error");
      setMessage(error?.message || error?.error);
      setDetail(error?.message || error?.error);
    }
  }, [isError, error]);

  // console.log(isError);
  const goBack = () => {
    router.back();
  };

  return (
    <>
      <div className={`${verifiedAccount || isError ? "lg:hidden" : ""}`}>
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
              Verify your account
            </h1>
          </span>
          <p className="font-product_sans text-spanish_gray text-t14 lg:text-t16 lg:max-w-[22.72rem]">
            An OTP has been sent to your e-mail address. Kindly input it below
            to verify your account.
          </p>
        </span>
        <div className="w-full max-w-full lg:max-w-[27rem] mx-auto grid place-items-center mt-[1.78rem]">
          <OTPInput
            value={otp}
            onChange={setOtp}
            numInputs={6}
            containerStyle={{
              display: "grid",
              gridTemplateColumns: "repeat(6,minmax(2.67rem,1fr))",
              gap: "0.89rem",
              placeItems: "center",
              width: "100%",
              marginBottom: "1.78rem",
            }}
            inputStyle={{
              width: "100%",
              height: "3.11rem",
              borderWidth: "0.5px",
              borderColor: "#E6E6E6",
              borderRadius: "0.5rem",
              outline: "none",
            }}
            // inputType="tel"
            renderInput={(props) => (
              <input {...props} inputMode="numeric" placeholder="0" />
            )}
          />

          <PrimaryButton
            disabled={
              isLoading || otp.length < 6 || resending || resendingPROtp
            }
            onClick={verifyHandler}
            text={"Verify Account"}
            type="button"
          />
          <span className="block mx-auto w-fit text-t12 lg:text-t14 font-normal font-product_sans text-dark_charcoal mt-[1.33rem] lg:mt-[1.78rem] ">
            Didn&apos;t get an OTP?{" "}
            <button
              onClick={resendHandler}
              className="text-tangerine"
              disabled={Number(countdown) > 0 || resending || resendingPROtp}
            >
              {Number(countdown) > 0 ? `Resend in ${countdown} Secs` : "Resend"}
            </button>
          </span>
          {_type === "password-reset" ? (
            <span className="mx-auto font-normal block w-fit text-t12 lg:text-t14 mt-[1.33rem] lg:mt-[4rem] font-product_sans text-dark_charcoal">
              Used a wrong e-mail address?{" "}
              <Link
                onClick={() => setMobileNavigatorComponent("forgotPassword")}
                href={isFromModal ? "#" : "/auth/forgot-password"}
                className="text-tangerine"
              >
                Change e-mail address here
              </Link>
            </span>
          ) : (
            <></>
          )}
        </div>
      </div>
      {(verifiedAccount || isError) && (
        <RequestStatus
          status={status}
          message={message}
          detail={detail}
          reset={reset}
          resend={resendHandler}
        />
      )}
    </>
  );
}

export default VerifyOtp;
