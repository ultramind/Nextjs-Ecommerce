import { useAddBank, useUpdateBankInfo } from "@api/wallet/bank";
import { useGetVerifyAccountNumber } from "@api/wallet/verifyAccountNumber";
import { PrimaryButton } from "@components/Common/Buttons";
import CustomSelect from "@components/Common/CustomSelect";
import { AccountVerifyInputField, TextArea } from "@components/Common/Input";
import { removeEmptyProperties } from "@utils/RemoveEmptyProps";
import { Country } from "country-state-city";
import { Form, Formik } from "formik";
import Banks from "ng-banks";
import React, { useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { IoIosClose } from "react-icons/io";
import { addBankInfoValidationSchema } from "src/schemas/addBankInfo";
import { BankCardProps } from "types/seller";
import ModalContainer from "./ModalContainer";

const banks = Banks.getBanks() || [];

function AddBankInfo({
  close,
  edit,
  bankInfo,
}: {
  close: () => void;
  edit?: boolean;
  bankInfo?: BankCardProps;
}) {
  const { isSuccess, mutate, isLoading } = useAddBank();

  const [bankName, setBankName] = useState("");
  const [bankCode, setBankCode] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountName, setAccountName] = useState("");
  const [comment, setComment] = useState("");
  // user's country
  const [userCountry, setUserCountry] = useState("Nigeria");

  useEffect(() => {
    if (bankInfo && edit) {
      setAccountName(bankInfo?.accountName);
      setBankName(bankInfo?.name);
      setAccountNumber(bankInfo?.accountNumber);
      setUserCountry(bankInfo?.country || "Nigeria");
      setComment(bankInfo?.comment || "");
    }
  }, [bankInfo, edit]);

  const {
    data,
    isFetching,
    isSuccess: verified,
  } = useGetVerifyAccountNumber(accountNumber, bankCode, userCountry);

  useEffect(() => {
    if (userCountry === "Nigeria") {
      if (verified) {
        setAccountName(data?.account_name || "");
      } else if (!bankInfo?.accountName && !edit) {
        setAccountName("");
      }
    }
  }, [data, verified, bankInfo, edit]);

  const {
    isSuccess: updated,
    mutate: update,
    isLoading: updating,
  } = useUpdateBankInfo();

  useEffect(() => {
    if (isSuccess || updated) {
      close();
    }
  }, [isSuccess, updated]);

  return (
    <ModalContainer>
      <span
        onClick={close}
        className="absolute top-0 left-0 z-30 block w-screen h-screen cursor-pointer"
      ></span>
      <div className="bg-white w-[19.21rem] lg:w-[28.7rem] max-w-full min-h-[25.02rem] z-50 relative left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2 lg:translate-y-0 lg:top-[8rem] pt-[1.5rem] pb-4 px-4 lg:py-[3.20rem] lg:px-[3.32rem]">
        <IoIosClose
          size={32}
          role="button"
          onClick={close}
          className="absolute top-2 right-3 lg:right-[1.5rem] lg:top-[1.42rem]"
        />
        <h2 className="text-t20 text-center lg:text-t24 font-roboto text-black font-medium mb-[1.90rem]">
          {edit ? "Edit Bank Info" : "Add Bank Info"}
        </h2>
        <Formik
          enableReinitialize
          initialValues={{
            name: bankName,
            accountName,
            accountNumber,
            country: userCountry,
            comment,
          }}
          validationSchema={addBankInfoValidationSchema}
          onSubmit={(values, { setSubmitting }) => {
            const data = { ...values };

            removeEmptyProperties(data);
            if (edit) {
              update({ ...data, bankCode, bankId: bankInfo?._id as string });
            } else {
              mutate({ ...data, bankCode });
            }
            setSubmitting(false);
          }}
        >
          {({ isValid, setFieldValue, values }) => (
            <Form>
              <CustomSelect
                name="country"
                placeholder="Country"
                value={values.country}
                classNameContainer="block font-product_sans font-normal text-t14 mb-4"
                className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                options={Country.getAllCountries().map((country) => ({
                  value: country.name,
                  label: country.name,
                }))}
                onChange={(value) => {
                  setFieldValue("country", value);
                  setUserCountry(value);
                }}
              />
              {userCountry === "Nigeria" ? (
                <CustomSelect
                  name="name"
                  placeholder="Bank Name"
                  value={values.name}
                  classNameContainer="block font-product_sans font-normal text-t14 mb-[0.95rem]"
                  className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                  options={
                    banks.map((bank) => ({
                      label: bank?.name,
                      value: bank?.name,
                      code: bank?.code as string,
                    })) || []
                  }
                  onChange={(value, code) => {
                    setFieldValue("name", value);
                    setBankName(value);
                    if (code) {
                      setBankCode(code);
                    }
                  }}
                />
              ) : (
                <>
                  <AccountVerifyInputField
                    name="name"
                    placeholder="Bank Name"
                    type="text"
                    value={values.name}
                    onChange={(value) => {
                      setFieldValue("name", value);
                      setBankName(value);
                    }}
                    classNameContainer="block font-product_sans font-normal text-t14 mb-[0.95rem]"
                    className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                  />
                </>
              )}

              <AccountVerifyInputField
                name="accountNumber"
                type="tel"
                placeholder="Account Number"
                value={accountNumber}
                onChange={(value) => {
                  setFieldValue("accountNumber", value);
                  setAccountNumber(value);
                }}
                classNameContainer="block font-product_sans font-normal text-t14 mb-[0.95rem]"
                className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
              />
              <div className="mb-[0.95rem] flex items-center space-x-5">
                <AccountVerifyInputField
                  name="accountName"
                  type="text"
                  placeholder="Account Name"
                  disabled={userCountry === "Nigeria"}
                  value={accountName}
                  onChange={(value) => {
                    setFieldValue("accountName", value);
                    setAccountName(value);
                  }}
                  classNameContainer="block font-product_sans font-normal text-t14 w-full flex-1"
                  className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                />
                {isFetching && (
                  <BiLoaderAlt className="text-tangerine w-[1rem] h-[1rem] animate-spin" />
                )}
              </div>

              {userCountry !== "Nigeria" && (
                <TextArea
                  name="comment"
                  placeholder="More Information (optional)"
                  classNameContainer="block font-product_sans font-normal text-t14 mb-[0.95rem]"
                  className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                />
              )}
              <PrimaryButton
                disabled={isLoading || !isValid || updating || isFetching}
                text={edit ? "Update Bank Info" : "Add Bank Info"}
                type="submit"
              />
            </Form>
          )}
        </Formik>
      </div>
    </ModalContainer>
  );
}

export default AddBankInfo;
