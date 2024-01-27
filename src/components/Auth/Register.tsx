import { useRegister } from "@api/authentication";
import { PrimaryButton } from "@components/Common/Buttons";
import { CheckBox, InputField } from "@components/Common/Input";
import OtherAuthOptions from "@components/Common/OtherAuthOptions";
import PhoneNumberSelect from "@components/Common/PhoneNumberSelect";
import { ConnectedFocusError } from "focus-formik-error";
import { Form, Formik } from "formik";
import Link from "next/link";
import React, { useState } from "react";
import { registerValidationSchema } from "src/schemas/authentication";
import { RegisterDetails } from "types/authentication";

interface RegisterProps {
  user_type: string;
  next_route: string;
}

function Register({ user_type = "buyer", next_route }: Partial<RegisterProps>) {
  const [checked, setChecked] = useState(false);
  const { isLoading, mutate } = useRegister(next_route);

  const checkBoxHandler = () => {
    setChecked(!checked);
  };
  return (
    <div className="w-full lg:max-w-[27rem] mx-auto">
      <Formik
        initialValues={{
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          password: "",
          confirmPassword: "",
        }}
        validationSchema={registerValidationSchema}
        onSubmit={(values, { setSubmitting }) => {
          const data: RegisterDetails = {
            firstName: values.first_name,
            lastName: values.last_name,
            email: values.email,
            role: user_type,
            phoneNumber: values.phone,
            password: values.password,
            confirmPassword: values.confirmPassword,
          };
          mutate(data);
          setSubmitting(false);
        }}
      >
        {({ values, setFieldValue }) => (
          <Form>
            <ConnectedFocusError />
            <InputField
              name="first_name"
              type="text"
              placeholder="First Name"
              classNameContainer="block font-product_sans font-normal text-t14 mb-4"
              className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
            />

            <InputField
              name="last_name"
              type="text"
              placeholder="Last Name"
              classNameContainer="block font-product_sans font-normal text-t14 mb-4"
              className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
            />

            <InputField
              name="email"
              type="email"
              placeholder="Email Address"
              classNameContainer="block font-product_sans font-normal text-t14 mb-4"
              className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
            />

            <div className="mb-4">
              <PhoneNumberSelect
                value={values?.phone || ""}
                inputProps={{
                  name: "phone",
                  placeholder: "Phone Number",
                  required: true,
                  className:
                    "w-full border-platinum border-xs py-[0.9rem] outline-none placeholder:text-light_silver pl-[2.5rem] rounded-xs",
                }}
                onChange={(value) => {
                  setFieldValue("phone", value);
                }}
              />
            </div>

            <InputField
              name="password"
              type="password"
              placeholder="Password"
              classNameContainer="block font-product_sans font-normal text-t14 mb-4"
              className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
            />

            <InputField
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              classNameContainer="block font-product_sans font-normal text-t14 mb-4"
              className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
            />
            <span className="flex items-center text-t12 lg:text-t14 font-product_sans font-normal mb-[1.33rem] lg:mb-[1.78rem] space-x-[0.61rem] lg:space-x-[1.11rem]">
              <CheckBox
                name="agree to terms"
                checked={checked}
                handleCheck={checkBoxHandler}
              />
              <span className="text-black_coral">
                I agree to the Terms and Conditions
              </span>
            </span>
            <PrimaryButton
              text={user_type === "seller" ? "Next" : "Sign up"}
              disabled={!checked || isLoading}
              type="submit"
            />
          </Form>
        )}
      </Formik>
      <OtherAuthOptions className="mb-4 lg:mb-[3.22rem] mt-[1.33rem] lg:mt-[1.78rem]" />
      <span className="block mx-auto w-fit text-t12 lg:text-t14 font-normal font-product_sans text-dark_charcoal mb-[1.33rem] lg:mb-[3.94rem]">
        Already have an account?{" "}
        <Link href="/auth/login" className="text-tangerine">
          Login
        </Link>
      </span>
    </div>
  );
}

export default Register;
