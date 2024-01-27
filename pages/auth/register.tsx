import RegisterComponent from "@components/Auth/Register";
import AuthLayout from "@layouts/AuthLayout";
import { useRouter } from "next/router";
import React from "react";
import { IoIosArrowBack } from "react-icons/io";

function Register() {
  const router = useRouter();
  const goBack = () => {
    router.back();
  };
  return (
    <AuthLayout>
      <section className="pt-[1.33rem] lg:pt-[8.06rem]">
        <span className="block lg:w-fit lg:mx-auto lg:text-center mb-[1.33em] lg:mb-[1.78rem]">
          <span className="flex items-center space-x-[0.47rem] mb-[1.54rem] lg:mb-4">
            <IoIosArrowBack
              className="lg:hidden w-[1.42rem] h-[1.42rem]"
              role="button"
              onClick={goBack}
            />
            <h1 className="text-t24 lg:text-t40 font-medium lg:font-semibold text-black font-roboto">
              Create an account
            </h1>
          </span>
          <p className="font-product_sans text-spanish_gray text-t14 lg:text-t16">
            Fill in your personal details in the fields below
          </p>
        </span>
        <RegisterComponent user_type="buyer" />
      </section>
    </AuthLayout>
  );
}

export default Register;
