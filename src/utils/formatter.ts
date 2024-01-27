export const formatter = (currency?: string, removeFractionDigits?: boolean) => new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency || "NGN",
    currencyDisplay: "narrowSymbol",
    maximumFractionDigits: removeFractionDigits ? 0 : 2,
});