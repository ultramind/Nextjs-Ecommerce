import { globalCurrency, globalExchangeRates } from "@atoms/globalState";
import { formatter } from "@utils/formatter";
import { useRecoilValue } from "recoil";

export const useCalculatePrice = (removeFractionDigits?: boolean) => {
  const rates = useRecoilValue(globalExchangeRates);
  const globalCurrencyValue = useRecoilValue(globalCurrency);

  const calculatePrice = (currency: string, amount: number) => {
    // Check if the provided currencies are in the exchange rates data
    if (!rates[currency] || !rates[globalCurrencyValue]) {
      // throw new Error('Currency not found in exchange rates data');
      // console.error('Currency not found in exchange rates data')
      return formatter(currency, removeFractionDigits || false).format(amount);
    }

    // Convert the amount
    const baseRate = rates[currency];
    const targetRate = rates[globalCurrencyValue];
    const convertedAmount = (amount / baseRate) * targetRate;
    return formatter(globalCurrencyValue, removeFractionDigits || false).format(
      convertedAmount,
    );
  };

  const calculatePriceWithoutFormatting = (
    currency: string,
    amount: number,
  ) => {
    // Check if the provided currencies are in the exchange rates data
    if (!rates[currency] || !rates[globalCurrencyValue]) {
      // throw new Error('Currency not found in exchange rates data');
      // console.error('Currency not found in exchange rates data')

      // if (currency !== "NGN") {
      //     return amount * 774.94
      // }
      return amount;
    }

    // Convert the amount
    const baseRate = rates[currency];
    const targetRate = rates[globalCurrencyValue];
    const convertedAmount = (amount / baseRate) * targetRate;
    return convertedAmount;
  };

  return {
    rates,
    calculatePrice,
    currency: globalCurrencyValue,
    calculatePriceWithoutFormatting,
  };
};
