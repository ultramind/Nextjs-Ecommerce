import { configOptions, instance } from "@api/httpConfig";
import BACKEND_URLS from "@api/urls";
import { useQuery } from "@tanstack/react-query";

export const useGetWallet = () => {
    return useQuery(
        ["getWallet"],
        () =>
            instance
                .get(BACKEND_URLS.seller.wallet.index, configOptions())
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