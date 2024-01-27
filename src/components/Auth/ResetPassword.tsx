import { useForgotPassword, useResetPassword } from "@api/authentication";
import { MobileNavigatorState } from "@atoms/mobileNavigator";
import { verifyOtpState } from "@atoms/verifyOtpState";
import { PrimaryButton } from "@components/Common/Buttons";
import { InputField } from "@components/Common/Input";
import RequestStatus from "@components/Common/RequestStatus";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { isMobile } from "react-device-detect";
import { IoIosArrowBack } from "react-icons/io";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { resetPasswordValidationSchema } from "src/schemas/authentication";
import { resetPassword } from "types/authentication";

function ResetPassword({ isFromModal }: { isFromModal?: boolean }) {
  const setMobileNavigatorComponent = useSetRecoilState(MobileNavigatorState);
  const router = useRouter();
  const { otp, email } = useRecoilValue(verifyOtpState);
  const {
    isLoading: resending,
    mutate: resend,
    isSuccess: otpResent,
  } = useForgotPassword(email);
  const { isLoading, mutate, isError, isSuccess, error, reset } =
    useResetPassword();
  const [status, setStatus] = useState("");
  const [message, setMessage] = useState("");
  const [detail, setDetail] = useState("");

  useEffect(() => {
    if (isError) {
      setStatus("error");
      setMessage(error?.message || error?.error);
      setDetail(error?.message || error?.error);
    }
  }, [isError, error]);

  useEffect(() => {
    if (otpResent) {
      if (isMobile) {
        setMobileNavigatorComponent("verify");
        return;
      }
      router.push("/auth/verify");
    }
  }, [otpResent, router]);

  const goBack = () => {
    if (isMobile) {
      setMobileNavigatorComponent("verify");
      return;
    }
    router.back();
  };

  const resendHandler = () => {
    resend({ email });
  };

  return (
    <>
      <div className={`${isSuccess || isError ? "lg:hidden" : ""}`}>
        <div className="p-[0.67rem] lg:p-0 lg:py-[3rem] lg:px-[3.11rem]">
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
                Reset Password
              </h1>
            </span>
            <p className="font-product_sans text-spanish_gray text-t14 lg:text-t16">
              Create a New Password
            </p>
          </span>
          <Formik
            initialValues={{
              newPassword: "",
              confirmPassword: "",
            }}
            validationSchema={resetPasswordValidationSchema}
            onSubmit={(values, { setSubmitting }) => {
              const data: resetPassword = {
                password: values.newPassword,
                confirmPassword: values.confirmPassword,
                otp: (otp as string) || "",
                email,
              };
              mutate(data);
              setSubmitting(false);
            }}
          >
            {() => (
              <Form>
                <InputField
                  name="newPassword"
                  type="password"
                  placeholder="New Password"
                  classNameContainer="block font-product_sans font-normal text-t14 mb-[1.78rem]"
                  className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                />
                <InputField
                  name="confirmPassword"
                  type="password"
                  placeholder="Confirm New Password"
                  classNameContainer="block font-product_sans font-normal text-t14 mb-[1.78rem]"
                  className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                />
                <PrimaryButton
                  disabled={isLoading || resending}
                  text={"Reset Password"}
                  type="submit"
                />
              </Form>
            )}
          </Formik>

          <span
            onClick={goBack}
            role="button"
            className="lg:block hidden mx-auto w-fit text-t12 lg:text-t14 font-medium font-product_sans text-tangerine mt-[1.33rem] lg:mt-[1.78rem] "
          >
            Back
          </span>
        </div>
      </div>
      {(isSuccess || isError) && (
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

export default ResetPassword;
