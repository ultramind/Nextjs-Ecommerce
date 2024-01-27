import { atom } from "recoil";

export const globalCurrency = atom({
    key: "globalCurrency",
    default: "",

})

export const globalExchangeRates = atom({
    key: "globalExchangeRates",
    default: {} as { [x: string]: any },

})