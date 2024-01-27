import { AuthState } from "@atoms/authenticationState";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { useRecoilValue } from "recoil";
import { BusinessProfile } from "types/authentication";
import { configOptions, instance } from "./httpConfig";
import BACKEND_URLS from "./urls";

export const useRegisterBusiness = () => {
    const queryClient = useQueryClient();
    const { isLoggedIn, emailVerified } = useRecoilValue(AuthState);
    const router = useRouter()

    return useMutation((values: BusinessProfile) => {
        return instance
            .post(BACKEND_URLS.register_business, values)
            .then((res) => res.data)
            .catch((err) => {
                throw err.response.data;
            });
    }, {
        onSuccess: () => {
            // console.log(data)
            // toast.success(data);
            toast.success("Successfully created")
            if (isLoggedIn && emailVerified) {
                queryClient.invalidateQueries(["getUser"]);
                router.push("/")
                return
            }
            router.push("/auth/verify")
            // reset()
        },
        onError: (err: string) => {
            // console.log(err)
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
                toast.error(err);
                return
            }
            toast.error("Failed to create a business")
        },
    });
};

//update business
export const useUpdateBusiness = () => {
    const queryClient = useQueryClient();

    return useMutation((values: BusinessProfile) => {
        return instance
            .put(BACKEND_URLS.seller.business, values, configOptions())
            .then((res) => res.data)
            .catch((err) => {
                throw err.response.data;
            });
    }, {
        onSuccess: () => {
            // console.log(data)
            // toast.success(data);
            toast.success("Successfully updated")
            queryClient.invalidateQueries(["getUserBusiness"]);
        },
        onError: (err: string) => {

            if (typeof err === "string") {
                toast.error(err);
                return
            }
            toast.error("Failed to update a business")
        },
    });
};

export const useGetUserBusiness = () => {
    const router = useRouter()
    const { isLoggedIn } = useRecoilValue(AuthState);

    return useQuery(
        ["getUserBusiness"],
        () =>
            instance
                .get(BACKEND_URLS.seller.business, configOptions())
                .then((res) => {
                    return res.data;
                })
                .catch((err) => {
                    throw err.response.data;
                }),
        {
            retry: 1,
            enabled: isLoggedIn,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            onError: (err: string) => {
                // console.log(err)
                if (typeof err === "string" && err === "No store found for this user") {
                    router.push("/auth/seller/profile")
                    toast.error("You don't have any registered business")
                    return
                }

                if (typeof err === "string") {
                    toast.error(err);
                    return
                }
                toast.error("Failed to get your business")
            },
        },
    );
};

//get statistics
export const useGetStatistics = (product_id: string, productState?: string | undefined) => {
    return useQuery(
        ["getProductStatistics", product_id],
        () =>
            instance
                .get(`/product/statistic/${product_id}/`, configOptions())
                .then((res) => {
                    return res?.data;
                })
                .catch((err) => {
                    throw err?.response?.data;
                }),
        {
            enabled: product_id !== "" && product_id !== undefined && productState !== undefined,
            onSuccess: () => {
                // console.log(data)
            },
            onError: (err: string) => {
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
                toast.error(err || "Failed to get product's statistics");
            },
        },
    );
};

//get product
export const useGetProduct = (slug: string) => {
    return useQuery(
        ["getBusinessProduct", slug],
        () =>
            instance
                .get(BACKEND_URLS.product.seller, {
                    ...configOptions(),
                    params: {
                        productId: slug,
                    },
                })
                .then((res) => {
                    return res?.data;
                })
                .catch((err) => {
                    throw err?.response?.data;
                }),
        {
            enabled: slug !== "" && slug !== undefined,
            retry: 1
        },
    );
};

export const useGetBusiness = (store_id: string) => {
    return useQuery(
        ["getStore", store_id],
        () =>
            instance
                .get(BACKEND_URLS.seller.public + `?storeId=${store_id}`)
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

export const useGetBusinessAnalytics = () => {
    return useQuery(
        ["getAnalytics"],
        () =>
            instance
                .get(BACKEND_URLS.seller.analytics, configOptions())
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

//add and update logo
export const useUploadLogo = () => {
    const queryClient = useQueryClient();
    return useMutation((value: { logo: string }) => instance.post(BACKEND_URLS.seller.logo, value, configOptions()), {
        onSuccess: () => {
            queryClient.invalidateQueries(["getUserBusiness"])
        },
        onError: (err: string) => {
            if (typeof err === "string") {
                toast.error(err);
                return
            }
            toast.error("Failed update logo")
        },
    })
}

//remove logo
export const useDeleteLogo = () => {
    const queryClient = useQueryClient();
    return useMutation((params: { publicId: string }) => instance.delete(BACKEND_URLS.seller.logo, { ...configOptions(), params }), {
        onSuccess: () => {
            queryClient.invalidateQueries(["getUserBusiness"])
        },
        onError: (err: string) => {
            if (typeof err === "string") {
                toast.error(err);
                return
            }
            toast.error("Failed delete logo")
        },
    })
}
