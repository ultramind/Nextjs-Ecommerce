import { configOptions, instance } from "@api/httpConfig";
import BACKEND_URLS from "@api/urls";
import { AuthState } from "@atoms/authenticationState";
import { WishlistState } from "@atoms/wishlistState";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import config from "@utils/config";
import Cookies from "js-cookie";
import { toast } from "react-hot-toast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { RootProps } from "types/order";

//get wishlist items
export const useGetWishlist = () => {
    const setWishlistState = useSetRecoilState(WishlistState)
    const { isLoggedIn } = useRecoilValue(AuthState);
    const accessToken = Cookies.get(config.key.token);

    return useQuery(
        ["getUserWishlist"],
        () =>
            instance
                .get(BACKEND_URLS.user.wishlist, configOptions())
                .then((res) => {
                    return res?.data;
                })
                .catch((err) => {
                    throw err?.response?.data;
                }),
        {
            retry: 1,
            onSuccess: (data) => {
                // console.log(data)
                setWishlistState(data?.items)
            },
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            retryOnMount: false,
            enabled: isLoggedIn && !accessToken?.includes("undefined") && accessToken !== undefined
        },
    );
};

// add to wishlist
export const useAddToWishlist = () => {
    const queryClient = useQueryClient();

    return useMutation((values: Partial<RootProps>) => instance
        .post(BACKEND_URLS.user.wishlist, values, configOptions())
        .then((res) => res.data)
        .catch((err) => {
            throw err.response.data;
        }), {
        onSuccess: (data) => {
            // console.log(data);
            toast.success(data?.message || "Product added to wishlist successfully")
            queryClient.invalidateQueries(["getUserWishlist"])
        },
        onError: (err: string | { [x: string]: any }[]) => {
            // if (err.error) {
            //     toast.error(err.error);
            //     return;
            // }
            // if (err.errors) {
            //     Object.entries(err.errors).map(([, value]) => {
            //         toast.error(value[0]);
            //     })
            //     return
            // }
            if (typeof err === "string") {
                toast.error(err || "Failed to add to wishlist");
                return
            }

            if (typeof err === 'object') {
                toast.error(err[0]?.msg || "Failed to add to wishlist");
            }
        },
    })
}

//remove item from wishlist or wishlist
export const useRemoveProductFromWishlist = (productId: string) => {
    const queryClient = useQueryClient();

    return useMutation(() => instance
        .delete(BACKEND_URLS.user.wishlist + `?productId=${productId}`, configOptions())
        .then((res) => res.data)
        .catch((err) => {
            throw err.response.data;
        }), {
        onSuccess: (data) => {
            // console.log(data);
            toast.success(data?.message || "Product removed to wishlist successfully")
            queryClient.invalidateQueries(["getUserWishlist"])
        },
        onError: (err: string | { [x: string]: any }[]) => {
            if (typeof err === "string") {
                toast.error(err || "Failed to add to wishlist");
                return
            }

            if (typeof err === 'object') {
                toast.error(err[0]?.msg || "Failed to add to wishlist");
            }
            // if (err.error) {
            //     toast.error(err.error);
            //     return;
            // }
            // if (err.errors) {
            //     Object.entries(err.errors).map(([, value]) => {
            //         toast.error(value[0]);
            //     })
            //     return
            // }
            // toast.error(err.message);
        },
    })
}