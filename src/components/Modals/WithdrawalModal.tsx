import { useMakeWithdrawal } from "@api/wallet/transaction";
import { PrimaryButton } from "@components/Common/Buttons";
import { NumberInput } from "@components/Common/Input";
import Select from "@components/Common/Select";
import { Form, Formik } from "formik";
import React, { useEffect, useMemo, useState } from "react";
import { WithdrawBalanceSchema } from "src/schemas/sellerDashboard";
import { BankCardProps } from "types/seller";

interface WithdrawalModalProps {
  closeModal: () => void;
  banks: BankCardProps[];
  gettingBanks: boolean;
}

function WithdrawalModal({
  closeModal,
  gettingBanks,
  banks,
}: WithdrawalModalProps) {
  const [amount, setAmount] = useState("");
  const [bankId, setBankId] = useState("");

  const { isLoading, mutate, isSuccess } = useMakeWithdrawal();

  useEffect(() => {
    if (isSuccess) {
      closeModal();
      setAmount("");
    }
  }, [isSuccess]);

  const getBank = useMemo(() => {
    if (bankId) {
      const res = banks?.find((bank: BankCardProps) => bank?._id === bankId);

      if (res) return res;
      return { accountName: "", accountNumber: "" };
    }
    return { accountName: "", accountNumber: "" };
  }, [bankId]);

  return (
    <Formik
      initialValues={{
        account_type: "",
        amount: "",
        bankId: "",
      }}
      validationSchema={WithdrawBalanceSchema}
      onSubmit={(values, { setSubmitting }) => {
        const data = {
          bankId: bankId,
          currency: values.account_type,
          amount: Number(values.amount) || 0,
        };

        mutate(data);
        setSubmitting(false);
      }}
    >
      {({ setFieldValue, isValid, values }) => (
        <Form>
          <Select
            name="account_type"
            value={values.account_type}
            productPlaceholder="Select the account to withdraw from"
            classNameContainer="block font-product_sans font-normal text-t14 mb-4"
            className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
            options={[
              { label: "Dollar Account", value: "USD" },
              { label: "Naira Account", value: "NGN" },
            ]}
            onChange={(value) => setFieldValue("account_type", value)}
          />

          <NumberInput
            name="amount"
            productPlaceholder="Enter Amount to withdraw"
            value={amount == "0" ? " " : amount}
            max={9}
            classNameContainer="block font-product_sans font-normal text-t14 mb-4"
            className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
            handleFormatting={(e: React.ChangeEvent<HTMLInputElement>) =>
              setAmount(
                BigInt(e.target.value.replaceAll(/\D/g, "")).toLocaleString(),
              )
            }
          />

          <Select
            name="bankId"
            productPlaceholder="Select Bank"
            value={values.bankId}
            classNameContainer="block font-product_sans font-normal text-t14"
            className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
            options={
              banks.map((bank: BankCardProps) => ({
                label: bank?.name,
                value: bank?.name,
                code: bank?._id,
              })) || []
            }
            onChange={(value, code) => {
              setFieldValue("bankId", value);
              if (code) {
                setBankId(code);
              }
            }}
          />
          {banks?.length === 0 && !gettingBanks && (
            <p className="mt-[0.3rem] mb-4 text-sm text-red-500 opacity-70">
              No bank info to select from, please add one.
            </p>
          )}
          <p className="mt-1 mb-4 text-sm opacity-70">
            {getBank?.accountName} {getBank?.accountNumber}
          </p>

          <div className="mt-[2rem]">
            <PrimaryButton
              disabled={isLoading || !isValid || banks?.length === 0}
              text={"Withdraw"}
              type="submit"
            />
          </div>
        </Form>
      )}
    </Formik>
  );
}

export default WithdrawalModal;
