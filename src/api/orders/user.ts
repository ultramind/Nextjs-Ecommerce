import { configOptions, instance } from '@api/httpConfig';
import BACKEND_URLS from '@api/urls';
import { userCountry } from '@atoms/userCountry';
import { useCalculatePrice } from '@hooks/useCalculatePrice';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';
import { useRecoilValue } from 'recoil';

type CreateOrderProps = {
    cart: string;
    country: string;
    state: string;
    postalCode: string;
    address: string;
    hotline: string;
    email: string;
    coupon?: string;
    classId: string
}
//create a new order
export const useCreateOrder = () => {
    const { currency } = useCalculatePrice()
    const countryOfUser = useRecoilValue(userCountry);

    return useMutation((values: CreateOrderProps) => instance
        .post(BACKEND_URLS.order.create, { ...values, currency, vatCountry: countryOfUser }, configOptions())
        .then((res) => res.data)
        .catch((err) => {
            throw err.response.data;
        }), {

        onError: (err: string) => {
            if (typeof err === "string") {
                toast.error(err);
                return
            }
            toast.error("Failed to create an order")
        },
    })
}

export const useGetOrders = (state: string, search: string, sortBy: string) => {
    const { query: { page } } = useRouter();
    return useQuery(["getUserOrders", state, search, sortBy, Number(page) || 1], ({ signal }) => instance
        .get(BACKEND_URLS.order.get + `?limit=40&state=${state}${search ? `&search=${search}` : ""}${sortBy ? `&sortBy=${sortBy}` : ""}&page=${Number(page) || 1}`, {
            ...configOptions(),
            signal
        })
        .then((res) => res.data)
        .catch((err) => {
            throw err.response.data;
        }), {
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })
}

export const useGetOrder = (orderId: string) => {
    return useQuery(["getUserOrder", orderId], () => instance
        .get(BACKEND_URLS.order.get, {
            ...configOptions(), params: {
                orderId
            }
        })
        .then((res) => res.data)
        .catch((err) => {
            throw err.response.data;
        }), {
        retry: 1,
        refetchOnWindowFocus: false,
        refetchOnMount: false,
    })
}

//cancel order
export const useCancelOrder = (orderId: string) => {
    const queryClient = useQueryClient();
    const { query: { page } } = useRouter();

    return useMutation(() => instance
        .delete(`${BACKEND_URLS.order.get}${orderId}`, configOptions())
        .then((res) => res.data)
        .catch((err) => {
            throw err.response.data;
        }), {
        onSuccess: (data) => {
            toast.success(data?.message || "Successfully requested an order cancellation")
            queryClient.invalidateQueries(["getUserOrder", orderId])
            queryClient.invalidateQueries(["getUserOrders", "open", "", "", Number(page) || 1])
            queryClient.invalidateQueries(["getUserOrders", "closed", "", "", Number(page) || 1])
        },
        onError: (err: string) => {
            if (typeof err === "string") {
                toast.error(err);
                return
            }
            toast.error("Failed to cancel order")
        },
    })
}
