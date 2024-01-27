import { configOptions, instance } from "@api/httpConfig";
import BACKEND_URLS from "@api/urls";
import { AuthState } from "@atoms/authenticationState";
import { CartState } from "@atoms/cartState";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import config from "@utils/config";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { IError } from "types/index";
import { RootProps } from "types/order";

//get cart items
export const useGetCart = () => {
    const setCartState = useSetRecoilState(CartState)
    const { isLoggedIn } = useRecoilValue(AuthState);
    const accessToken = Cookies.get(config.key.token);

    return useQuery(
        ["getUserCart"],
        () =>
            instance
                .get(BACKEND_URLS.user.cart, configOptions())
                .then((res) => {
                    return res?.data;
                })
                .catch((err) => {
                    throw err?.response?.data;
                }),
        {
            enabled: isLoggedIn && !accessToken?.includes("undefined") && accessToken !== undefined,
            retry: 1,
            onSuccess: (data) => {
                // console.log(data)
                setCartState(data?.items)
            },
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            // staleTime: Infinity
            retryOnMount: false
        },
    );
};

// add to cart
export const useAddToCart = () => {
    const queryClient = useQueryClient();

    return useMutation((values: Partial<RootProps>) => instance
        .post(BACKEND_URLS.user.cart, values, configOptions())
        .then((res) => res.data)
        .catch((err) => {
            throw err.response.data;
        }), {
        onSuccess: (data) => {
            // console.log(data);
            toast.success(data?.message || "Product added to cart successfully")
            queryClient.invalidateQueries(["getUserCart"])
        },
        onError: (err: string | { [x: string]: any }[]) => {
            // if (err.error) {
            //     toast.error(err.error);
            //     return;
            // }
            // if (err.errors) {
            //     err?.errors?.forEach((value) => {
            //         toast.error(value?.msg);
            //     })
            //     return
            // }
            if (typeof err === "string") {
                toast.error(err || "Failed to add to cart");
                return
            }

            if (typeof err === 'object') {
                toast.error(err[0]?.msg || "Failed to add to cart");
            }
        },
    })
}

// add to cart
export const useUpdateCartItem = () => {
    const queryClient = useQueryClient();

    return useMutation((values: Partial<RootProps>) => instance
        .put(BACKEND_URLS.user.cart, values, configOptions())
        .then((res) => res.data)
        .catch((err) => {
            throw err.response.data;
        }), {
        onSuccess: () => {
            // console.log(data);
            // toast.success(data?.message)
            queryClient.invalidateQueries(["getUserCart"])
        },
        onError: (err: IError) => {
            if (err.error) {
                toast.error(err.error);
                return;
            }
            if (err.errors) {
                err?.errors?.forEach((value) => {
                    toast.error(value?.msg);
                })
                return
            }
            toast.error(err.message);
        },
    })
}

//remove item from cart or wishlist
export const useRemoveProductFromCart = (itemId: string) => {
    const queryClient = useQueryClient();

    return useMutation(() => instance
        .delete(BACKEND_URLS.user.cart + `?itemId=${itemId}`, configOptions())
        .then((res) => res.data)
        .catch((err) => {
            throw err.response.data;
        }), {
        onSuccess: (data) => {
            // console.log(data);
            toast.success(data?.message || "Successfully removed from cart")
            queryClient.invalidateQueries(["getUserCart"])
        },
        onError: (err: string) => {
            // if (err.error) {
            //     toast.error(err.error);
            //     return;
            // }
            // if (err.errors) {
            //     err?.errors?.forEach((value) => {
            //         toast.error(value?.msg);
            //     })
            //     return
            // }
            if (typeof err === "string") {
                toast.error(err || "Failed to remove");
            }
        },
    })
}