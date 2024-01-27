import { configOptions, instance } from '@api/httpConfig';
import BACKEND_URLS from '@api/urls';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/router';
import toast from 'react-hot-toast';

export const useGetOrders = (state: string, search: string, sortBy: string) => {
    const { query: { page } } = useRouter();

    return useQuery(["getSellerOrders", state, search, sortBy, Number(page) || 1], ({ signal }) => instance
        .get(BACKEND_URLS.order.store + `?limit=40&state=${state}${search ? `&search=${search}` : ""}${sortBy ? `&sortBy=${sortBy}` : ""}&page=${Number(page) || 1}`, {
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
    return useQuery(["getSellerOrder", orderId], () => instance
        .get(BACKEND_URLS.order.store, {
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

export const useGetRelatedOrders = (orderId: string, relatedOrder: string) => {
    return useQuery(["getRelatedOrder", orderId, relatedOrder], () => instance
        .get(BACKEND_URLS.order.store, {
            ...configOptions(), params: {
                orderId,
                relatedOrder
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

//update order status
export const useUpdateOrder = (orderId: string) => {
    const queryClient = useQueryClient();
    const { query: { page } } = useRouter();

    return useMutation((values: { status: string, state: string }) => instance
        .put(`${BACKEND_URLS.order.store}`, { ...values, orderId }, configOptions())
        .then((res) => res.data)
        .catch((err) => {
            throw err.response.data;
        }), {
        onSuccess: (data) => {
            toast.success(data?.message || "Successfully updated order status")
            queryClient.invalidateQueries(["getSellerOrder", orderId])
            queryClient.invalidateQueries(["getSellerOrders", "open", "", "", Number(page) || 1])
            queryClient.invalidateQueries(["getSellerOrders", "closed", "", "", Number(page) || 1])
        },
        onError: (err: string) => {
            if (typeof err === "string") {
                toast.error(err || "Failed to update order status");
                return
            }
            toast.error("Failed to update order status")
        },
    })
}

//cancel order
export const useSellerCancelOrder = (orderId: string) => {
    const queryClient = useQueryClient();
    const { query: { page } } = useRouter();

    return useMutation(() => instance
        .delete(`${BACKEND_URLS.order.get}seller/${orderId}`, configOptions())
        .then((res) => res.data)
        .catch((err) => {
            throw err.response.data;
        }), {
        onSuccess: (data) => {
            toast.success(data?.message || "Successfully requested an order cancellation")
            queryClient.invalidateQueries(["getSellerOrder", orderId])
            queryClient.invalidateQueries(["getSellerOrders", "open", "", "", Number(page) || 1])
            queryClient.invalidateQueries(["getSellerOrders", "closed", "", "", Number(page) || 1])
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