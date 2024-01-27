import { useForgotPassword } from "@api/authentication";
import { MobileNavigatorState } from "@atoms/mobileNavigator";
import { PrimaryButton } from "@components/Common/Buttons";
import { InputField } from "@components/Common/Input";
import { Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useSetRecoilState } from "recoil";
import { forgotPasswordValidationSchema } from "src/schemas/authentication";

function ForgotPasswordComponent({ isFromModal }: { isFromModal?: boolean }) {
  const setMobileNavigatorComponent = useSetRecoilState(MobileNavigatorState);
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const { isLoading, mutate } = useForgotPassword(userEmail);

  const goBack = () => {
    router.back();
  };

  return (
    <div>
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
          Enter the e-mail address used in creating your account
        </p>
      </span>
      <Formik
        initialValues={{
          email: "",
        }}
        validationSchema={forgotPasswordValidationSchema}
        onSubmit={(values, { setSubmitting }) => {
          const data = {
            email: values.email,
          };
          setUserEmail(values.email);
          mutate(data);
          setSubmitting(false);
        }}
      >
        {() => (
          <Form>
            <InputField
              name="email"
              type="email"
              placeholder="Email Address"
              classNameContainer="block font-product_sans font-normal text-t14 mb-[1.78rem]"
              className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
            />

            <PrimaryButton
              disabled={isLoading}
              text={"Reset Password"}
              type="submit"
            />
          </Form>
        )}
      </Formik>

      <span className="block mx-auto font-normal w-fit text-t12 lg:text-t14 font-product_sans text-dark_charcoal mt-[1.33rem] lg:mt-[5.39rem]">
        Don&apos;t have an account yet?{" "}
        <Link
          onClick={() => setMobileNavigatorComponent("chooseAccount")}
          href={isFromModal ? "#" : "/auth/account"}
          className="text-tangerine"
        >
          Sign Up
        </Link>
      </span>
    </div>
  );
}

export default ForgotPasswordComponent;
