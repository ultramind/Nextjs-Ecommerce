import { useRegisterBusiness } from "@api/seller";
import PictureIcon from "@assets/icons/Picture";
import { AuthState } from "@atoms/authenticationState";
import { registrationState } from "@atoms/registrationState";
import { userState } from "@atoms/userState";
import { PrimaryButton } from "@components/Common/Buttons";
import CustomSelect from "@components/Common/CustomSelect";
import { InputField } from "@components/Common/Input";
import PhoneNumberSelect from "@components/Common/PhoneNumberSelect";
import Select from "@components/Common/Select";
import Uploader from "@components/Common/Uploader";
import AuthLayout from "@layouts/AuthLayout";
import { useIsFetching } from "@tanstack/react-query";
import { getLabel, identity_docs } from "@utils/identification";
import { Country, State } from "country-state-city";
import { ConnectedFocusError } from "focus-formik-error";
import { Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useRecoilValue } from "recoil";
import { businessProfileInfoValidationSchema } from "src/schemas/authentication";
import { BusinessProfile } from "types/authentication";

function Profile() {
  const router = useRouter();
  const { id: user_id } = useRecoilValue(userState);
  const { id } = useRecoilValue(registrationState);
  const { isLoggedIn } = useRecoilValue(AuthState);
  const { isLoading, mutate } = useRegisterBusiness();
  const [fileUrl, setFileUrl] = useState("");
  const isGettingUser = useIsFetching({
    queryKey: ["getUser"],
  });

  //country code
  const [countryCode, setCountryCode] = useState("");

  useEffect(() => {
    if (!id && !user_id && !isGettingUser) router.push("/auth/seller");
  }, [id, user_id, isGettingUser]);

  const goBack = () => {
    router.back();
  };

  return (
    <AuthLayout>
      <section className="pt-[1.33rem] lg:pt-[8.06rem]">
        <span className="block lg:w-fit lg:mx-auto lg:text-center mb-[1.33em] lg:mb-[1.78rem]">
          <span className="flex items-center space-x-[0.47rem] lg:space-x-0 lg:justify-center mb-[0.44rem] lg:mb-4">
            <IoIosArrowBack
              className="lg:hidden w-[1.42rem] h-[1.42rem]"
              role="button"
              onClick={goBack}
            />
            <h1 className="font-medium text-black text-t24 lg:text-t40 lg:font-semibold font-roboto">
              Become a seller
            </h1>
          </span>
          <p className="font-product_sans text-spanish_gray text-t14 lg:text-t16">
            Fill in your business details in the fields below
          </p>
        </span>
        <div className="w-full lg:max-w-[27rem] mx-auto">
          <Formik
            enableReinitialize
            initialValues={{
              business_name: "",
              business_address: "",
              business_state: "",
              business_country: "",
              business_postal_code: "",
              business_phone_number: "",
              cac_number: "",
              identity_doc: "",
              identity_number: "",
              // file: "",
            }}
            validationSchema={businessProfileInfoValidationSchema}
            onSubmit={(values, { setSubmitting }) => {
              const data: BusinessProfile = {
                name: values.business_name,
                address: values.business_address,
                phone: values.business_phone_number,
                cac: values.cac_number || "",
                identityType: getLabel(values.identity_doc, "label", "value"),
                identityNumber: values.identity_number,
                state: values.business_state,
                country: values.business_country,
                postalCode: Number(values.business_postal_code),
                terms: true,
                id: user_id || id,
              };
              if (fileUrl) {
                mutate({ ...data, file: fileUrl });
                setSubmitting(false);
                return;
              }
              mutate(data);
              setSubmitting(false);
            }}
          >
            {({ setFieldValue, setFieldError, values }) => (
              <Form>
                <ConnectedFocusError />
                <InputField
                  name="business_name"
                  type="text"
                  placeholder="Business Name"
                  classNameContainer="block font-product_sans font-normal text-t14 mb-4"
                  className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                />

                <InputField
                  name="business_address"
                  type="text"
                  placeholder="Business Address"
                  classNameContainer="block font-product_sans font-normal text-t14 mb-4"
                  className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                />
                <CustomSelect
                  name="business_country"
                  placeholder="Business Country"
                  value={values.business_country}
                  classNameContainer="block font-product_sans font-normal text-t14 mb-4"
                  className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                  options={Country.getAllCountries().map((country) => ({
                    value: country.name,
                    label: country.name,
                    code: country.isoCode,
                  }))}
                  onChange={(value, code) => {
                    setFieldValue("business_country", value);
                    setFieldValue("business_state", "");
                    if (code) {
                      setCountryCode(code);
                    }
                  }}
                />

                <CustomSelect
                  name="business_state"
                  placeholder="Business State"
                  value={values.business_state}
                  classNameContainer="block font-product_sans font-normal text-t14 mb-4"
                  className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                  options={
                    State.getStatesOfCountry(countryCode).map((state) => ({
                      value: state.name,
                      label: state.name,
                      code: state.isoCode,
                    })) || []
                  }
                  handleOnClick={(toggleFunc) => {
                    if (!countryCode) {
                      setFieldError(
                        "business_state",
                        "A country must be selected first",
                      );
                      return;
                    }
                    toggleFunc();
                  }}
                  onChange={(value) => setFieldValue("business_state", value)}
                />

                <div className="mb-4">
                  <PhoneNumberSelect
                    value={values?.business_phone_number || ""}
                    defaultCountry={countryCode}
                    inputProps={{
                      name: "business_phone_number",
                      placeholder: "Business Phone",
                      required: true,
                      className:
                        "w-full border-platinum border-xs py-[0.9rem] outline-none placeholder:text-light_silver pl-[3rem] rounded-xs",
                    }}
                    onChange={(value) => {
                      setFieldValue("business_phone_number", value);
                    }}
                  />
                </div>

                <InputField
                  name="business_postal_code"
                  type="text"
                  placeholder="Business Postal Code"
                  classNameContainer="block font-product_sans font-normal text-t14 mb-4"
                  className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                />

                <InputField
                  name="cac_number"
                  type="text"
                  placeholder="CAC Number"
                  classNameContainer="block font-product_sans font-normal text-t14 mb-4"
                  className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                />
                <Select
                  name="identity_doc"
                  placeholder="Select Identity Document"
                  value={values.identity_doc}
                  classNameContainer="block font-product_sans font-normal text-t14 mb-4"
                  className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                  options={identity_docs}
                  onChange={(value) =>
                    setFieldValue(
                      "identity_doc",
                      getLabel(value, "value", "label"),
                    )
                  }
                />

                <InputField
                  name="identity_number"
                  type="text"
                  placeholder={
                    values.identity_doc
                      ? `Enter the '${values.identity_doc}' ${
                          getLabel(values.identity_doc, "label", "value") !==
                          "NIN"
                            ? "number"
                            : ""
                        }`
                      : "Identity Number"
                  }
                  classNameContainer="block font-product_sans font-normal text-t14 mb-[1.5rem] lg:mb-[2rem]"
                  className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                />
                <Uploader
                  name="file"
                  label={
                    `Upload an image of your '${values.identity_doc}'` ||
                    "Click to upload Identity document as Image"
                  }
                  accept="image/*"
                  customImage={<PictureIcon />}
                  callBack={(url) => setFileUrl(url)}
                  className="w-full max-w-full rounded-xs mb-[1.5rem] lg:mb-[2rem] flex cursor-pointer justify-center items-center flex-col gap-[0.56rem] h-[10rem] border-platinum border-xs"
                />
                <PrimaryButton
                  disabled={isLoading}
                  text={isLoggedIn ? "Create Business" : "Create Account"}
                  type="submit"
                />
              </Form>
            )}
          </Formik>

          <span className="block mx-auto w-fit text-t12 lg:text-t14 font-normal font-product_sans text-dark_charcoal mt-[1.5rem] lg:mt-[5.44rem] mb-[1.33rem] lg:mb-[3.94rem]">
            Already have an account?{" "}
            <Link href="/auth/login" className="text-tangerine">
              Login
            </Link>
          </span>
        </div>
      </section>
    </AuthLayout>
  );
}

export default Profile;
