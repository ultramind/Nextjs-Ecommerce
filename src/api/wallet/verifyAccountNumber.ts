import { configOptions, instance } from "@api/httpConfig";
import BACKEND_URLS from "@api/urls";
import { useQuery } from "@tanstack/react-query";

//verify account number
export const useGetVerifyAccountNumber = (account_number: string, bank_code: string, userCountry: string) => {

    return useQuery(
        ["verifyAccountNumber", account_number, bank_code],
        () =>
            instance
                .post(`${BACKEND_URLS.seller.wallet.verify}`, {
                    accountNumber: account_number,
                    bankCode: bank_code
                }, configOptions())
                .then((res) => {
                    return res?.data;
                })
                .catch((err) => {
                    throw err?.response?.data;
                }),
        {
            enabled: account_number !== "" && bank_code !== "" && userCountry === "Nigeria",
            refetchOnWindowFocus: false,
            refetchOnMount: false,
        },
    );
};