import { AuthState } from "@atoms/authenticationState";
import { paymentOptions } from "@atoms/summaryState";
import { useMutation, useQuery } from "@tanstack/react-query";
import { removeEmptyProperties } from "@utils/RemoveEmptyProps";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { configOptions, instance } from "./httpConfig";
import BACKEND_URLS from "./urls";

interface CheckoutProps {
    orderSummaryId: string
    type: string
}

//make payment
export const useCheckout = (type: string) => {
    const setPaymentOption = useSetRecoilState(paymentOptions);
    const router = useRouter()
    return useMutation((values: CheckoutProps) => instance
        .post(BACKEND_URLS.user.checkout, values, configOptions())
        .then((res) => res.data)
        .catch((err) => {
            throw err.response.data;
        }), {
        onSuccess: (data) => {
            // console.log(data)
            if (type === "paystack") {
                if (typeof window !== undefined) {
                    if (data?.data?.authorization_url) {
                        window.location.href = data?.data?.authorization_url
                        return
                    }
                }
                return;
            }

            if (type === "flutterwave") {
                if (typeof window !== undefined) {
                    if (data?.data?.link) {
                        window.location.href = data?.data?.link
                        return;
                    }
                }
                return
            }

            setPaymentOption(data)
            router.push("/checkout/stripe")
        },
        onError: (err: string) => {
            if (typeof err === "string") {
                toast.error(err);
                return
            }
            toast.error("Failed to create an order")
        },
    })
}

//get order summary
export const useGetOrderSummary = (enabled: boolean, orderSummaryId: string) => {
    const params = {
        orderSummaryId
    }

    const { isLoggedIn } = useRecoilValue(AuthState);

    return useQuery(["orderSummary", orderSummaryId], () => instance.get(BACKEND_URLS.user.summary, {
        ...configOptions(), params
    }).then((res) => res.data)
        .catch((err) => {
            throw err.response.data;
        }), {
        enabled: enabled && orderSummaryId !== undefined && orderSummaryId !== "" && isLoggedIn,
        retry: 1,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        retryOnMount: false,
        onError: (err: string) => {
            if (typeof err === "string") {
                toast.error(err);
                return
            }
            toast.error("Failed to get order summary")
        },
    })
}

//verify payment
export const useVerifyPayment = (status: string, type: string, paymentId: string, flutterId?: string) => {
    const params = {
        type, paymentId, flutterId
    }
    removeEmptyProperties(params);

    return useQuery(["verifyPayment", type, paymentId], () => instance.get(BACKEND_URLS.user.verify_payment, {
        ...configOptions(), params
    }).then((res) => res.data)
        .catch((err) => {
            throw err.response.data;
        }), {
        enabled: status !== "cancelled" && paymentId !== undefined && paymentId !== "" && type !== undefined && type !== "",
        retry: 1,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
        retryOnMount: false,
        onError: (err: string) => {
            if (typeof err === "string") {
                toast.error(err);
                return
            }
            toast.error("Failed to verify payment")
        },
    })
}

//verify coupon 
export const useVerifyCoupon = () => {
    return useMutation((code: string) => instance.get(BACKEND_URLS.user.verify_coupon, {
        ...configOptions(), params: {
            code
        }
    }).then((res) => res.data)
        .catch((err) => {
            throw err.response.data;
        }), {
        onError: (err: string) => {
            if (typeof err === "string") {
                toast.error(err);
                return
            }
            toast.error("Failed to validate coupon")
        },
    })
}

//make payment with paystack 
export const useMakePaymentWithPaystack = () => {
    return useMutation((summaryId: string) => instance.post(BACKEND_URLS.make_payment.with_paystack, { summaryId }).then((res) => res.data)
        .catch((err) => {
            throw err.response.data;
        }), {
        onError: (err: string) => {
            if (typeof err === "string") {
                toast.error(err);
                return
            }
            toast.error("Failed to initialize payment")
        },
    })
}

//get shipping classes
export const useGetShippingClasses = (country: string, state?: string) => {
    return useQuery(["shippingClass", country, state], () => instance.get(BACKEND_URLS.shipping, { ...configOptions(), params: { country, state } }).then(response => response?.data).catch(error => error?.response?.data), {
        enabled: country !== "" && country !== undefined
    })
}

//report weight range issue
export interface useReportWeightRangeIssueProps {
    username: string,
    email: string,
    phoneNumber: string,
    classId: string,
    weightRange: string,
    country: string,
    state: string
}

export const useReportWeightRangeIssue = () => {
    return useMutation((data: useReportWeightRangeIssueProps) => instance.post(BACKEND_URLS.report, data).then((res) => res.data)
        .catch((err) => {
            throw err.response.data;
        }), {
        onSuccess: (data) => {
            toast.success(data || "Report Successfully sent. You would be noticed as soon as it is resolved");
        },
        onError: (err: string) => {
            if (typeof err === "string") {
                toast.error(err);
                return
            }
            toast.error("Failed to make a report")
        },
    })
}