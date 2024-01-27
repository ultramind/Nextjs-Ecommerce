import { configOptions, instance } from "@api/httpConfig";
import BACKEND_URLS from "@api/urls";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

export const useGetBanks = () => {

    return useQuery(
        ["getBanks"],
        () =>
            instance
                .get(BACKEND_URLS.seller.wallet.bank, configOptions())
                .then((res) => {
                    return res.data;
                })
                .catch((err) => {
                    throw err.response.data;
                }),
        {
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnMount: false,

        },
    );
};

export type AddBank = {
    name: string,
    accountName: string,
    accountNumber: string
    bankCode: string
}

//create new bank
export const useAddBank = () => {
    const queryClient = useQueryClient();

    return useMutation(
        (values: AddBank) =>
            instance
                .post(`${BACKEND_URLS.seller.wallet.bank}`, values, configOptions())
                .then((res) => {
                    return res?.data;
                })
                .catch((err) => {
                    throw err?.response?.data;
                }),
        {
            onSuccess: (data) => {
                toast.success(data?.message || "Successfully added bank info.");
                queryClient.invalidateQueries(["getBanks"]);
            },
            onError: (err: string) => {
                if (typeof err === "string") {
                    toast.error(err || "Failed add bank info.");
                }
            },
        },
    );
};


interface updateBankProp extends AddBank {
    bankId: string;
}

//update bank
export const useUpdateBankInfo = () => {
    const queryClient = useQueryClient();

    return useMutation(
        (values: updateBankProp) =>
            instance
                .put(`${BACKEND_URLS.seller.wallet.bank}`, values, configOptions())
                .then((res) => {
                    return res?.data;
                })
                .catch((err) => {
                    throw err?.response?.data;
                }),
        {
            onSuccess: (data) => {
                toast.success(data?.message || "Successfully updated bank info.");
                queryClient.invalidateQueries(["getBanks"]);
            },
            onError: (err: string) => {
                if (typeof err === "string") {
                    toast.error(err || "Failed update bank info.");
                }
            },
        },
    );
};

//delete bank
export const useDeleteBank = (bank_id: string) => {
    const queryClient = useQueryClient();

    return useMutation(
        () =>
            instance
                .delete(`${BACKEND_URLS.seller.wallet.bank}?bankId=${bank_id}`, configOptions())
                .then((res) => {
                    return res?.data;
                })
                .catch((err) => {
                    throw err?.response?.data;
                }),
        {
            onSuccess: (data) => {
                toast.success(data?.message || "Successfully delete bank info.");
                queryClient.invalidateQueries(["getBanks"]);
            },
            onError: (err: string) => {
                if (typeof err === "string") {
                    toast.error(err || "Failed delete bank info.");
                }
            },
        },
    );
};
