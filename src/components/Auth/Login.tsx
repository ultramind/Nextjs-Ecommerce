import { useLogin } from "@api/authentication";
import { MobileNavigatorState } from "@atoms/mobileNavigator";
import { PrimaryButton } from "@components/Common/Buttons";
import { InputField } from "@components/Common/Input";
import OtherAuthOptions from "@components/Common/OtherAuthOptions";
import { Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useSetRecoilState } from "recoil";
import { loginValidationSchema } from "src/schemas/authentication";
import { LoginDetails } from "types/authentication";

function LoginComponent({ isFromModal }: { isFromModal?: boolean }) {
  const setMobileNavigatorComponent = useSetRecoilState(MobileNavigatorState);
  const router = useRouter();
  const [userEmail, setUserEmail] = useState("");
  const { isLoading, mutate } = useLogin(userEmail);

  const goBack = () => {
    router.back();
  };
  return (
    <div>
      <span className="block lg:w-fit px-[0.44rem] lg:px-0 lg:mx-auto !lg:text-center mb-[1.33em] lg:mb-[1.78rem]">
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
            Sign in
          </h1>
        </span>

        <p className="font-product_sans text-spanish_gray text-t14 lg:text-t16">
          Provide your account details to sign in to your account
        </p>
      </span>
      <Formik
        initialValues={{
          email: "",
          password: "",
        }}
        validationSchema={loginValidationSchema}
        onSubmit={(values, { setSubmitting }) => {
          const data: LoginDetails = {
            email: values.email,
            password: values.password,
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
              classNameContainer="block font-product_sans font-normal text-t14 mb-4"
              className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
            />

            <InputField
              name="password"
              type="password"
              placeholder="Password"
              classNameContainer="block font-product_sans font-normal text-t14 mb-4"
              className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
            />
            <Link
              onClick={() => setMobileNavigatorComponent("forgotPassword")}
              href={isFromModal ? "#" : "/auth/forgot-password"}
              className="text-t14 font-product_sans font-normal text-black block mr-0 ml-auto w-fit mb-[1.78rem]"
            >
              Forgot password?
            </Link>
            <PrimaryButton
              disabled={isLoading}
              text={"Sign In"}
              type="submit"
            />
          </Form>
        )}
      </Formik>
      <OtherAuthOptions className="mb-4 lg:mb-[5rem] mt-[1.33rem] lg:mt-[1.78rem]" />
      <span className="block mx-auto w-fit text-t12 lg:text-t14 font-normal mb-[1.96rem] lg:mb-[5.87rem] font-product_sans text-dark_charcoal">
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

export default LoginComponent;
