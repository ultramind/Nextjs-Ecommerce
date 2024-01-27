import { useQuery } from '@tanstack/react-query';
import { configOptions, instance } from './httpConfig';
import BACKEND_URLS from './urls';


//get sales
export const useGetSales = () => {
    return useQuery(
        ["getSales"],
        () =>
            instance
                .get(`${BACKEND_URLS.seller.sales}`, configOptions())
                .then((res) => {
                    return res?.data;
                })
                .catch((err) => {
                    throw err?.response?.data;
                }),
        {
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
        },
    );
};

//get best sellers
export const useGetBestSeller = () => {
    return useQuery(
        ["getBestSeller"],
        () =>
            instance
                .get(`${BACKEND_URLS.seller.best_seller}`, configOptions())
                .then((res) => {
                    return res?.data;
                })
                .catch((err) => {
                    throw err?.response?.data;
                }),
        {
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
        },
    );
};