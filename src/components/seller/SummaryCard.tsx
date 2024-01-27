import { useCalculatePrice } from "@hooks/useCalculatePrice";
import useDisclosure from "@hooks/useDisclosure";
import { formatter } from "@utils/formatter";
import React, { useMemo, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";

interface SummaryCardProps {
  title: string;
  amount: number;
  subtitle?: string;
}

export function SummaryCard({ title, amount, subtitle }: SummaryCardProps) {
  const {
    toggleModal,
    isOpen: optionsShown,
    closeModal,
    modalRef,
  } = useDisclosure();
  const [currency, setCurrency] = useState("NGN");
  const { rates } = useCalculatePrice(true);

  const dollarToNairaRate = useMemo(() => {
    if (rates) {
      const rate = rates["NGN"];
      if (rate) return rate;
      return 1;
    }
  }, [rates]);

  return (
    <div className="relative flex flex-col gap-y-[24px] items-center p-4 rounded-2xl border">
      <p className="text-sm font-semibold font-roboto text-tangerine">
        {title}
      </p>
      <h2 className="md:text-[40px] text-[1.5rem] sm:text-[2rem] font-roboto font-semibold max-w-full overflow-x-auto">
        {subtitle
          ? amount.toLocaleString()
          : formatter(currency).format(
              currency === "NGN"
                ? amount
                : dollarToNairaRate
                ? amount / dollarToNairaRate
                : amount,
            )}
      </h2>
      {subtitle && (
        <p className="text-sm uppercase font-product_sans">{subtitle}</p>
      )}
      {!subtitle && (
        <div
          ref={modalRef}
          onClick={toggleModal}
          className="relative text-left"
        >
          <button
            type="button"
            className="flex items-center text-sm font-medium bg-white rounded-md"
            id="menu-button"
            aria-expanded="true"
            aria-haspopup="true"
          >
            {currency}
            <IoIosArrowDown className="ml-2 " />
          </button>
          {optionsShown && (
            <div className="absolute left-0 z-50 font-medium text-sm bg-white border rounded-md top-5">
              <div className="flex flex-col">
                <button
                  onClick={() => {
                    setCurrency("NGN");
                    closeModal();
                  }}
                  className="hover:bg-tangerine/20 py-0.5 px-2"
                >
                  NGN
                </button>
                <button
                  onClick={() => {
                    setCurrency("USD");
                    closeModal();
                  }}
                  className="hover:bg-tangerine/20 py-0.5 px-1"
                >
                  USD
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

interface BalanceCardProps {
  title: string;
  subtitle?: string;
  amount: number;
  dropDown?: boolean;
  rate?: number;
  currencyX?: string;
}

export function BalanceCard({
  title,
  subtitle,
  amount,
  dropDown,
  rate,
  currencyX,
}: BalanceCardProps) {
  const {
    toggleModal,
    isOpen: optionsShown,
    closeModal,
    modalRef,
  } = useDisclosure();

  const [currency, setCurrency] = useState(currencyX || "NGN");

  return (
    <div className="flex flex-col items-center justify-center w-full h-full px-3 py-5 space-y-4 text-center rounded-lg bg-tangerine/10 text-tangerine md:space-y-6">
      <p className="text-sm">{title}</p>
      <h3 className="text-[32px] md:text-[40px] font-roboto overflow-x-auto">
        {formatter(currency).format(
          currency === "NGN" ? amount : rate ? amount / rate : amount,
        )}
      </h3>
      {subtitle && (
        <p className="text-sm uppercase font-product_sans">{subtitle}</p>
      )}
      {dropDown && (
        <div
          ref={modalRef}
          onClick={toggleModal}
          className="relative text-left"
        >
          <button
            type="button"
            className="flex items-center font-medium text-sm bg-transparent rounded-md"
            id="menu-button"
            aria-expanded="true"
            aria-haspopup="true"
          >
            {currency}
            <IoIosArrowDown className="ml-2 " />
          </button>
          {optionsShown && (
            <div className="absolute left-0 z-50 text-sm font-medium bg-white border rounded-md top-5">
              <div className="flex flex-col">
                <button
                  onClick={() => {
                    setCurrency("NGN");
                    closeModal();
                  }}
                  className="hover:bg-tangerine/20 py-0.5 px-2"
                >
                  NGN
                </button>
                <button
                  onClick={() => {
                    setCurrency("USD");
                    closeModal();
                  }}
                  className="hover:bg-tangerine/20 py-0.5 px-1"
                >
                  USD
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
