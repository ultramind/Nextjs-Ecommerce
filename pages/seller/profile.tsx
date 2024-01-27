import { useUpdateBusiness } from "@api/seller";
import { sellerBusinessState } from "@atoms/seller/business";
import { InputField } from "@components/Common/Input";
import Select from "@components/Common/Select";
import SellerLayout from "@layouts/SellerLayout";
import { Form, Formik } from "formik";
import React, { useMemo, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { IoIosArrowForward } from "react-icons/io";
import { useRecoilValue } from "recoil";
import { businessProfileInfoValidationSchema } from "src/schemas/authentication";
import { BusinessProfile } from "types/authentication";

import CustomSelect from "@components/Common/CustomSelect";
import PhoneNumberSelect from "@components/Common/PhoneNumberSelect";
import PhotoUploader from "@components/Common/PhotoUploader";
import DocumentCard from "@components/seller/DocumentCard";
import { getLabel, identity_docs } from "@utils/identification";
import { Country, State } from "country-state-city";
import { NextSeo } from "next-seo";

function Profile() {
  const business = useRecoilValue(sellerBusinessState);
  const [changeBusinessDetails, setCBDState] = useState(false);

  //country code
  const [countryCode, setCountryCode] = useState("");

  const { isLoading, mutate, isSuccess } = useUpdateBusiness();

  useMemo(() => {
    if (isSuccess) setCBDState(false);
  }, [isSuccess]);

  return (
    <>
      <NextSeo title={`${business?.name} - Niteon Market`} />
      <SellerLayout>
        <section className="pt-[1.90rem] lg:pt-0 pl-[1.30rem] pr-[0.95rem] lg:px-0 max-w-[48.97rem]">
          <Formik
            initialValues={{
              business_name: business?.name || "",
              business_email: business?.email || "",
              business_address: business?.businessAddress?.address || "",
              business_state: business?.businessAddress?.state || "",
              business_country: business?.businessAddress?.country || "",
              business_postal_code: business?.businessAddress?.postalCode || "",
              business_phone_number: business?.phone || "",
              cac_number: business?.cac || "",
              identity_doc:
                getLabel(
                  business?.identity?.iType as string,
                  "value",
                  "label",
                ) || "",
              identity_number: business?.identity?.iNumber || "",
              // file: "",
            }}
            validationSchema={businessProfileInfoValidationSchema}
            onSubmit={(values, { setSubmitting }) => {
              const data: BusinessProfile = {
                name: values.business_name,
                email: values.business_email,
                address: values.business_address,
                phone: values.business_phone_number,
                cac: values.cac_number || "",
                // identityType: getLabel(values.identity_doc, "label", "value"),
                // identityNumber: values.identity_number,
                state: values.business_state,
                country: values.business_country,
                postalCode: Number(values.business_postal_code),
              };

              mutate(data);
              setSubmitting(false);
            }}
          >
            {({ setFieldValue, setFieldError, values }) => (
              <>
                <Form>
                  <span className="flex justify-between items-center mb-[0.95rem] lg:mb-[2.37rem]">
                    <h1 className="font-medium text-black text-t18 lg:text-t20 font-roboto">
                      Business Profile
                    </h1>

                    {!changeBusinessDetails ? (
                      <span
                        onClick={() => setCBDState(true)}
                        className="flex items-center cursor-pointer text-t14 lg:text-t16 font-product_sans disabled:text-spanish_gray text-tangerine"
                      >
                        <span>Edit Profile</span>
                        <IoIosArrowForward className="w-[1rem] h-[1rem]" />
                      </span>
                    ) : (
                      <span className="flex items-center space-x-3 lg:space-x-5">
                        {!isLoading && (
                          <span
                            onClick={() => setCBDState(false)}
                            className="flex items-center cursor-pointer text-t14 lg:text-t16 font-product_sans disabled:opacity-50 text-tangerine"
                          >
                            <span>Cancel</span>
                          </span>
                        )}
                        <button
                          type="submit"
                          disabled={isLoading}
                          className="flex items-center text-t14 lg:text-t16 font-product_sans disabled:opacity-50 text-tangerine"
                        >
                          {isLoading && (
                            <BiLoaderAlt className="w-[1rem] h-[1rem] animate-spin" />
                          )}
                          <span>Save</span>
                          {!isLoading && (
                            <IoIosArrowForward className="w-[1rem] h-[1rem]" />
                          )}
                        </button>
                      </span>
                    )}
                  </span>
                  {!changeBusinessDetails ? (
                    <div className="flex pl-[0.95rem] space-y-3 md:space-x-3 flex-col md:flex-row items-start">
                      <PhotoUploader
                        imageURL={business?.logo}
                        isFromBusinessProfile
                      />
                      <div>
                        <h3 className="text-t18 lg:text-t20 font-roboto text-black lg:font-medium mb-[0.47rem] lg:mb-[0.95rem] capitalize">
                          Name: {business?.name}
                        </h3>
                        <span className="block mb-[1rem] text-t14 lg:text-t16 font-product_sans text-spanish_gray">
                          Address: {business?.businessAddress?.address}
                          {", "}
                          {business?.businessAddress?.state}
                          {", "}
                          {business?.businessAddress?.country}.{" "}
                          {business?.businessAddress?.postalCode}
                        </span>
                        <div className="grid gap-4 text-t14 lg:text-t16 font-product_sans text-spanish_gray md:grid-cols-2 lg:grid-cols-3">
                          <span className="inline-block">
                            Phone: {business?.phone}
                          </span>
                          <span className="inline-block">
                            Email: {business?.email || "-"}
                          </span>
                          <span className="inline-block">
                            Verified: {business?.isVerified?.toString()}
                          </span>
                          <span className="inline-block">
                            Identity:{" "}
                            {getLabel(
                              (business?.identity?.iType as string) || "",
                              "value",
                              "label",
                            )}
                            , {business?.identity?.iNumber}
                          </span>
                          <span className="inline-block">
                            CAC: {business?.cac}
                          </span>
                          <span className="inline-block">
                            Admin Action: {business?.adminAction}
                          </span>
                        </div>

                        {/* Document */}
                        {business?.identity?.file && (
                          <div className="mt-[5rem]">
                            <h3 className="text-t16 lg:text-t18 font-roboto text-black lg:font-medium mb-[0.95rem] lg:mb-[1.5rem] capitalize">
                              Documents
                            </h3>
                            <DocumentCard
                              data={{
                                title: business?.identity?.iType || "",
                                url: business?.identity?.file || "",
                              }}
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="w-full grid lg:grid-cols-2 gap-[0.95rem] lg:gap-[1.90rem]">
                      <InputField
                        name="business_name"
                        type="text"
                        placeholder="Business Name"
                        classNameContainer="block font-product_sans font-normal text-t14 mb-4"
                        className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                      />

                      <InputField
                        name="business_email"
                        type="email"
                        placeholder="Business Email"
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
                          State.getStatesOfCountry(countryCode).map(
                            (state) => ({
                              value: state.name,
                              label: state.name,
                              code: state.isoCode,
                            }),
                          ) || []
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
                        onChange={(value) =>
                          setFieldValue("business_state", value)
                        }
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
                        value={values.identity_doc}
                        placeholder="Select Identity Document"
                        classNameContainer="block font-product_sans font-normal text-t14 mb-4"
                        className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                        options={identity_docs}
                        onChange={(value) =>
                          setFieldValue(
                            "identity_doc",
                            getLabel(value, "value", "label"),
                          )
                        }
                        disabled
                      />

                      <InputField
                        name="identity_number"
                        type="text"
                        placeholder="Identity Number"
                        disabled
                        classNameContainer="block font-product_sans font-normal text-t14 mb-[1.5rem] lg:mb-[2rem]"
                        className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                      />
                    </div>
                  )}
                </Form>
              </>
            )}
          </Formik>
        </section>
      </SellerLayout>
    </>
  );
}

Profile.requireAuth = true;
export default Profile;
