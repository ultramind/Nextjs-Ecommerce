import { configOptions, instance } from "@api/httpConfig";
import BACKEND_URLS from "@api/urls";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useRouter } from "next/router";
import toast from "react-hot-toast";

export const useGetTransactions = () => {
    const { query: { page } } = useRouter();
    return useQuery(
        ["getTransactions", Number(page) || 1,],
        () =>
            instance
                .get(BACKEND_URLS.seller.wallet.transaction, { ...configOptions(), params: { limit: 40, page: Number(page) || 1, } })
                .then((res) => {
                    return res.data;
                })
                .catch((err) => {
                    throw err.response.data;
                }),
        {
            retry: false,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
        },
    );
};

//make withdrawal
export const useMakeWithdrawal = () => {
    return useMutation(
        (values: { bankId: string, amount: number, currency: string }) =>
            instance
                .post(`${BACKEND_URLS.seller.wallet.withdraw}`, values, configOptions())
                .then((res) => {
                    return res?.data;
                })
                .catch((err) => {
                    throw err?.response?.data;
                }),
        {
            onSuccess: (data) => {
                toast.success(data?.message || "Successfully sent a request for withdrawal");
            },
            onError: (err: string) => {
                if (typeof err === "string") {
                    toast.error(err || "Failed post withdraw request.");
                }
            },
        },
    );
};
