import { UpdateProfile, useUpdateUser } from "@api/authentication";
import { userState } from "@atoms/userState";
import CustomSelect from "@components/Common/CustomSelect";
import { InputField } from "@components/Common/Input";
import PhoneNumberSelect from "@components/Common/PhoneNumberSelect";
import PhotoUploader from "@components/Common/PhotoUploader";
import DashboardLayout from "@layouts/DashboardLayout";
import { Country, State } from "country-state-city";
import { Form, Formik } from "formik";
import React, { useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { IoIosArrowForward } from "react-icons/io";
import { useRecoilValue } from "recoil";
import {
  AddressValidationSchema,
  PersonalDetailsValidationSchema,
} from "src/schemas/profile";

function Profile() {
  const user = useRecoilValue(userState);
  const [changePersonalDetails, setCPDState] = useState(false);
  const [changeAddress, setAddressState] = useState(false);
  const [countryCode, setCountryCode] = useState("");

  const { mutate, isLoading, isSuccess } = useUpdateUser();

  useEffect(() => {
    if (isSuccess) {
      if (changePersonalDetails) {
        setCPDState(false);
        return;
      }
      if (changeAddress) {
        setAddressState(false);
      }
    }
  }, [isSuccess]);

  return (
    <DashboardLayout>
      <section className="pt-[1.90rem] lg:pt-0 pl-[1.30rem] pr-[0.95rem] lg:px-0 max-w-[48.97rem]">
        <h1 className="text-black font-roboto text-t24 font-medium mb-[1.9rem] lg:mb-[3rem]">
          Account Details
        </h1>
        <div className="mb-[3.56rem]">
          <Formik
            enableReinitialize
            initialValues={{
              firstName: user?.firstName || "",
              lastName: user?.lastName || "",
              phoneNumber: user?.phoneNumber || "",
              email: user?.email || "",
            }}
            validationSchema={PersonalDetailsValidationSchema}
            onSubmit={(values, { setSubmitting }) => {
              // console.log(values);
              const data = {
                firstName: values.firstName,
                lastName: values.lastName,
                phoneNumber: values.phoneNumber,
              };

              mutate(data);

              setSubmitting(false);
            }}
          >
            {({ setFieldValue, values }) => (
              <>
                <Form>
                  <span className="flex justify-between items-center mb-[0.95rem] lg:mb-[2.37rem]">
                    <h2 className="font-medium text-black text-t18 lg:text-t20 font-roboto">
                      Personal Details
                    </h2>

                    {!changePersonalDetails ? (
                      <span
                        onClick={() => setCPDState(true)}
                        className="flex items-center cursor-pointer text-t14 lg:text-t16 font-product_sans disabled:text-spanish_gray text-tangerine"
                      >
                        <span>Change</span>
                        <IoIosArrowForward className="w-[1rem] h-[1rem]" />
                      </span>
                    ) : (
                      <span className="flex items-center space-x-3 lg:space-x-5">
                        {!isLoading && (
                          <span
                            onClick={() => setCPDState(false)}
                            className="flex items-center cursor-pointer text-t14 lg:text-t16 font-product_sans disabled:opacity-50 text-tangerine"
                          >
                            <span>Cancel</span>
                          </span>
                        )}
                        <button
                          disabled={isLoading}
                          type="submit"
                          className="flex items-center text-t14 lg:text-t16 font-product_sans disabled:opacity-50 text-tangerine"
                        >
                          {isLoading && changePersonalDetails && (
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
                  {!changePersonalDetails ? (
                    <div className="flex pl-[0.95rem] space-y-3 md:space-x-3 flex-col md:flex-row items-start">
                      <PhotoUploader imageURL={user?.profilePicture} />
                      <div>
                        <h3 className="text-t18 lg:text-t20 font-roboto text-black lg:font-medium mb-[0.47rem] lg:mb-[0.95rem]">
                          {user?.firstName} {user?.lastName}
                        </h3>
                        <div className="flex flex-row lg:items-center text-t14 lg:text-t16 font-product_sans text-spanish_gray">
                          <span className="inline-block pr-[1.07rem] border-r-xs py-[0.4rem] border-platinum">
                            {user?.phoneNumber}
                          </span>
                          <span className="inline-block pl-[1.07rem] py-[0.4rem]">
                            {user?.email}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full grid lg:grid-cols-2 gap-[0.95rem] lg:gap-[1.90rem]">
                      <InputField
                        name="firstName"
                        type="text"
                        placeholder="First Name"
                        classNameContainer="block font-product_sans font-normal text-t14"
                        className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                      />
                      <InputField
                        name="lastName"
                        type="text"
                        placeholder="Last Name"
                        classNameContainer="block font-product_sans font-normal text-t14"
                        className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                      />

                      <div>
                        <PhoneNumberSelect
                          value={values?.phoneNumber || ""}
                          defaultCountry={countryCode}
                          inputProps={{
                            name: "phoneNumber",
                            placeholder: "Phone Number",
                            required: true,
                            className:
                              "w-full border-platinum border-xs py-[0.9rem] outline-none placeholder:text-light_silver pl-[3rem] rounded-xs",
                          }}
                          onChange={(value) => {
                            setFieldValue("phoneNumber", value);
                          }}
                        />
                      </div>

                      <InputField
                        name="email"
                        type="email"
                        disabled
                        placeholder="E-mail Address"
                        classNameContainer="block font-product_sans font-normal text-t14"
                        className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                      />
                    </div>
                  )}
                </Form>
              </>
            )}
          </Formik>
        </div>
        {/**address */}
        <div className="mb-[5.93rem]">
          <Formik
            enableReinitialize
            initialValues={{
              country: user?.address?.country || "",
              state: user?.address?.state || "",
              postalCode: user?.address?.postalCode || "",
              address: user?.address?.address || "",
            }}
            validationSchema={AddressValidationSchema}
            onSubmit={(values, { setSubmitting }) => {
              const data: UpdateProfile = {
                address: {
                  country: values.country,
                  state: values.state,
                  postalCode: values.postalCode,
                  address: values.address,
                },
              };

              mutate(data);
              setSubmitting(false);
            }}
          >
            {({ setFieldValue, setFieldError, values }) => (
              <>
                <Form>
                  <span className="flex justify-between items-center mb-[0.95rem] lg:mb-[2.37rem]">
                    <h2 className="font-medium text-black text-t18 lg:text-t20 font-roboto">
                      Address
                    </h2>

                    {!changeAddress ? (
                      <span
                        onClick={() => setAddressState(true)}
                        className="flex items-center cursor-pointer text-t14 lg:text-t16 font-product_sans disabled:text-spanish_gray text-tangerine"
                      >
                        <span>Change</span>
                        <IoIosArrowForward className="w-[1rem] h-[1rem]" />
                      </span>
                    ) : (
                      <span className="flex items-center space-x-3 lg:space-x-5">
                        {!isLoading && changeAddress && (
                          <span
                            onClick={() => setAddressState(false)}
                            className="flex items-center cursor-pointer text-t14 lg:text-t16 font-product_sans disabled:opacity-50 text-tangerine"
                          >
                            <span>Cancel</span>
                          </span>
                        )}
                        <button
                          disabled={isLoading}
                          type="submit"
                          className="flex items-center text-t14 lg:text-t16 font-product_sans disabled:opacity-50 text-tangerine"
                        >
                          {isLoading && changeAddress && (
                            <BiLoaderAlt className="w-[1rem] h-[1rem] animate-spin" />
                          )}
                          <span>Save</span>
                          {!isLoading && (
                            <IoIosArrowForward className="w-[1rem] h-[1rem]" />
                          )}
                        </button>
                      </span>
                    )}
                    {/* <button
                      onClick={() => setAddressState(!changeAddress)}
                      type={changeAddress ? "submit" : "button"}
                      className="flex items-center text-t14 lg:text-t16 font-product_sans text-tangerine"
                    >
                      <span>{changeAddress ? "Save" : "Change"}</span>
                      <IoIosArrowForward className="w-[1rem] h-[1rem]" />
                    </button> */}
                  </span>
                  {!changeAddress ? (
                    user?.address?.address ? (
                      <div className="pl-[0.95rem]">
                        <h3 className="text-t18 lg:text-t20 font-roboto text-black lg:font-medium mb-[0.47rem] lg:mb-[0.95rem]">
                          {user?.address?.address}
                        </h3>
                        <div className="flex flex-row lg:items-center text-t14 lg:text-t16 font-product_sans text-spanish_gray">
                          <span className="flex items-center">
                            <span className="inline-block pr-[1.07rem] border-r-xs py-[0.47rem] border-platinum">
                              {user?.address?.state}
                            </span>
                          </span>
                          <span className="flex items-center">
                            <span className="inline-block px-[1.07rem] py-[0.47rem] border-r-xs border-platinum">
                              {user?.address?.country}
                            </span>
                            <span className="inline-block pl-[1.07rem] py-[0.47rem]">
                              {user?.address?.postalCode}
                            </span>
                          </span>
                        </div>
                      </div>
                    ) : (
                      <p className="text-t14 lg:text-t16 font-product_sans text-spanish_gray">
                        None
                      </p>
                    )
                  ) : (
                    <div className="w-full grid lg:grid-cols-2 gap-[0.95rem] lg:gap-[1.90rem]">
                      <CustomSelect
                        name="country"
                        placeholder="Country"
                        value={values?.country || ""}
                        classNameContainer="block font-product_sans font-normal text-t14"
                        className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                        options={Country.getAllCountries().map((country) => ({
                          value: country.name,
                          label: country.name,
                          code: country.isoCode,
                        }))}
                        onChange={(value, code) => {
                          setFieldValue("country", value);
                          setFieldValue("state", "");
                          if (code) {
                            setCountryCode(code);
                          }
                        }}
                      />
                      <CustomSelect
                        name="state"
                        placeholder="State"
                        value={values?.state || ""}
                        classNameContainer="block font-product_sans font-normal text-t14"
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
                        onChange={(value) => setFieldValue("state", value)}
                        handleOnClick={(toggleFunc) => {
                          if (!countryCode) {
                            setFieldError(
                              "state",
                              "A country must be selected first",
                            );
                            return;
                          }
                          toggleFunc();
                        }}
                      />

                      <InputField
                        name="postalCode"
                        type="text"
                        placeholder="Postal Code"
                        classNameContainer="block font-product_sans font-normal text-t14"
                        className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                      />
                      <InputField
                        name="address"
                        type="text"
                        placeholder="Address"
                        classNameContainer="block font-product_sans font-normal text-t14"
                        className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                      />
                    </div>
                  )}
                </Form>
              </>
            )}
          </Formik>
        </div>
      </section>
    </DashboardLayout>
  );
}

Profile.requireAuth = true;
export default Profile;
