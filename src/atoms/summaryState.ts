import { atom } from "recoil";
import { Root } from "types/orderReceipt";
import { recoilPersist } from 'recoil-persist'

const { persistAtom } = recoilPersist({
    key: "PaymentMethodState"
})

export const paymentMethodState = atom({
    key: "PaymentMethodState",
    default: "paystack",
    effects_UNSTABLE: [persistAtom]
})

export const paymentOptions = atom({
    key: "PaymentOptionsState",
    default: {} as { client_secret: string, id: string }
})

export const SummaryState = atom({
    key: "SummaryState",
    default: {} as Root,
})