import { FilterState } from "@atoms/Filter";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { removeEmptyProperties } from "@utils/RemoveEmptyProps";
import { useRouter } from "next/router";
import { toast } from "react-hot-toast";
import { useRecoilValue } from "recoil";
import { AddReviewProps, CommentProps } from "types/product";
import { CreateProductProps } from "types/seller";
import { configOptions, instance } from "./httpConfig";
import BACKEND_URLS from "./urls";

//create product
export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    const { query: { page } } = useRouter();
    return useMutation(
        (values: Partial<CreateProductProps>) =>
            instance
                .post(BACKEND_URLS.product.create, values, configOptions())
                .then((res) => res.data)
                .catch((err) => {
                    throw err.response.data;
                }),
        {
            onSuccess: () => {
                // console.log(data);
                queryClient.invalidateQueries(["getSellerProducts", "published", "", "", Number(page) || 1]);
                queryClient.invalidateQueries(["getSellerProducts", "draft", "", "", Number(page) || 1]);
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
                if (typeof err === "string") {
                    toast.error(err || "Failed to create product");
                }
            },
        },
    );
};

//upload product images
export const useUploadImages = (uploadCallback: (data: any) => void) => {
    return useMutation(
        (values: any) =>
            instance
                .post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`, values)
                .then((res) => res.data)
                .catch((err) => {
                    throw err?.response?.data;
                }),
        {
            onSuccess: (data) => {
                // console.log(data)
                uploadCallback(data);
                toast.success("Upload successful!")
            },
            onError: (err: string) => {
                if (typeof err === "string") {
                    toast.error(err || "Failed to upload product image");
                }
            },
        },
    );
};

//delete image from cloudinary
export const useDeleteImageFromCloudinary = () => {
    return useMutation(
        (values: any) =>
            instance
                .post(`https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/destroy`, values)
                .then((res) => res.data)
                .catch((err) => {
                    throw err?.response?.data;
                }),
        {
            onSuccess: () => {
                toast.success("Image removed successfully!")
            },
            onError: (err: string) => {
                if (typeof err === "string") {
                    toast.error(err || "Failed to remove product image");
                }
            },
        },
    );
};

//delete product images
export const useDeleteImage = (product_id: string) => {
    const queryClient = useQueryClient();

    return useMutation(
        ({ index, publicId }: { index: number, publicId: string }) =>
            instance
                .delete(BACKEND_URLS.product.create + `images/`, { ...configOptions(), params: { productId: product_id, index, publicId } })
                .then((res) => res.data)
                .catch((err) => {
                    throw err.response.data;
                }),
        {
            onSuccess: () => {
                // console.log(data);
                queryClient.invalidateQueries(["getBusinessProduct", product_id]);
            },
            onError: (err: string) => {
                if (typeof err === "string") {
                    toast.error(err || "Failed to remove product image");
                }
            },
        },
    );
};

//edit product
export const useEditProduct = (product_id: string) => {
    // const { headers: augmentHeader } = configOptions();
    // const headers = { ...augmentHeader, 'Content-Type': 'multipart/form-data' };
    const { query: { page } } = useRouter();

    const queryClient = useQueryClient();
    return useMutation(
        (values: Partial<CreateProductProps>) =>
            instance
                .put(
                    BACKEND_URLS.product.create,
                    { ...values, productId: product_id },
                    configOptions(),
                )
                .then((res) => res.data)
                .catch((err) => {
                    throw err.response.data;
                }),
        {
            onSuccess: (data) => {
                // console.log(data);
                toast.success(data?.message || "Successfully updated product");
                queryClient.invalidateQueries(["getBusinessProduct", product_id]);
                queryClient.invalidateQueries(["getSellerProducts", "published", "", "", Number(page) || 1]);
                queryClient.invalidateQueries(["getSellerProducts", "draft", "", "", Number(page) || 1]);
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
                if (typeof err === "string") {
                    toast.error(err || "Failed to update");
                }
            },
        },
    );
};

//delete product
export const useDeleteProduct = (product_id: string) => {
    const queryClient = useQueryClient();
    return useMutation(
        () =>
            instance
                .delete(
                    BACKEND_URLS.product.create + `?productId=${product_id}`,
                    configOptions(),
                )
                .then((res) => res.data)
                .catch((err) => {
                    throw err.response.data;
                }),
        {
            onSuccess: () => {
                // console.log(data);
                queryClient.invalidateQueries(["getSellerProducts", "published", "", ""]);
                queryClient.invalidateQueries(["getSellerProducts", "draft", "", ""]);
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
                if (typeof err === "string") {
                    toast.error(err || "Failed to delete");
                }
            },
        },
    );
};

//get all products
export const useGetAllProducts = (category?: string) => {
    const { query: { page } } = useRouter();
    const filtersState = useRecoilValue(FilterState);

    //params
    const params = {
        category,
        limit: 40,
        page: Number(page) || 1,
        ...filtersState
    }

    removeEmptyProperties(params)

    return useQuery(
        ["getAllProducts", category, Number(page) || 1, filtersState],
        () =>
            instance
                .get(BACKEND_URLS.product.index, {
                    params
                })
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

//get all new arrival products
export const useGetNewArrivalsProducts = () => {
    return useQuery(
        ["getNewArrivalsProducts"],
        () =>
            instance
                .get(BACKEND_URLS.product.index + "others", {
                    params: {
                        newArrivals: true,
                    },
                })
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

//get all top ranking products
export const useGetTopRankingProducts = () => {
    return useQuery(
        ["getTopRankingProducts"],
        () =>
            instance
                .get(BACKEND_URLS.product.index + "others", {
                    params: {
                        topRanking: true,
                    },
                })
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

//get all top picks products
export const useGetTopPickProducts = (category: string) => {
    const filtersState = useRecoilValue(FilterState);

    //params
    const params = {
        topPicks: true,
        category,
        limit: 20,
        ...filtersState
    }

    removeEmptyProperties(params)

    return useQuery(
        ["getTopPicksProducts", category, filtersState],
        () =>
            instance
                .get(BACKEND_URLS.product.index + "others", {
                    params
                })
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

//get other products
export const useGetRelatedProducts = (product_id: string) => {
    return useQuery(
        ["getRelatedProducts", product_id],
        () =>
            instance
                .get(BACKEND_URLS.product.index + "others", {
                    params: {
                        relatedProduct: product_id,
                    },
                })
                .then((res) => {
                    return res?.data;
                })
                .catch((err) => {
                    throw err?.response?.data;
                }),
        {
            enabled: product_id !== undefined && product_id !== null,
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            retryOnMount: false,
        },
    );
};

//get product
export const useGetProduct = (slug: string) => {
    return useQuery(
        ["getProduct", slug],
        () =>
            instance
                .get(`/product`, {
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
            retry: 1,
            enabled: slug !== "" && slug !== undefined,
            onSuccess: () => {
                // console.log(data)
            },
        },
    );
};

//get other products from same seller
export const useGetSellerOtherProducts = (storeId: string) => {
    return useQuery(
        ["getSellerOtherProducts", storeId],
        () =>
            instance
                .get(`/product?storeId=${storeId}`)
                .then((res) => {
                    return res?.data;
                })
                .catch((err) => {
                    throw err?.response?.data;
                }),
        {
            retry: 1,
            enabled: storeId !== "" && storeId !== undefined,
            refetchOnMount: false,
            refetchOnWindowFocus: false
        },
    );
};

//get seller products
export const useGetSellerProducts = (
    key: string,
    search?: string,
    sortBy?: string
) => {
    const { query: { page } } = useRouter();
    return useQuery(
        ["getSellerProducts", key, search, sortBy, Number(page) || 1],
        ({ signal }) =>
            instance
                .get(
                    BACKEND_URLS.product.seller +
                    `?state=${key}${search ? `&search=${search}` : ""}${sortBy ? `&sortBy=${sortBy}` : ""}&page=${Number(page) || 1}`,
                    { ...configOptions(), signal },
                )
                .then((res) => {
                    return res?.data;
                })
                .catch((err) => {
                    throw err?.response?.data;
                }),
        {
            enabled: key !== "" && key !== null,
            retry: 1,
            retryOnMount: false,
            refetchOnMount: false
        },
    );
};

//get all products by id
export const useGetAllProductsById = (business_id: string) => {
    return useQuery(
        ["getAllProductsById", business_id],
        () =>
            instance
                .get(`/product/${business_id}/`, configOptions())
                .then((res) => {
                    return res?.data;
                })
                .catch((err) => {
                    throw err?.response?.data;
                }),
        {
            enabled: business_id !== "",
        },
    );
};

//get search through products
export const useGetSearchForProducts = (search: string, category?: string) => {
    const { query: { page } } = useRouter();
    const filtersState = useRecoilValue(FilterState);

    //params
    const params = {
        search,
        category,
        limit: 40,
        page: Number(page) || 1,
        ...filtersState
    }

    removeEmptyProperties(params)

    return useQuery(
        ["getSearchForProducts", search, category, Number(page) || 1],
        () =>
            instance
                .get(BACKEND_URLS.product.index, {
                    params,
                })
                .then((res) => {
                    return res?.data;
                })
                .catch((err) => {
                    throw err?.response?.data;
                }),
        {
            retry: 1,
            enabled: search !== "" ? true : false,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
            onError: (err: string) => {
                toast.error(err || "No product found");
            },
        },
    );
};

//send product review
export const useSendReview = (product_id: string) => {
    const queryClient = useQueryClient();

    return useMutation(
        (values: AddReviewProps) =>
            instance
                .post(
                    BACKEND_URLS.product.addReview,
                    values,
                    configOptions(),
                )
                .then((res) => res.data)
                .catch((err) => {
                    throw err.response.data;
                }),
        {
            onSuccess: (data) => {
                // console.log(data);
                toast.success(data?.message || "Successfully added a review");
                queryClient.invalidateQueries(["getProduct", product_id]);
                queryClient.invalidateQueries(["getProductReview", product_id]);
            },
            onError: (err: string) => {
                if (typeof err === "string") {
                    toast.error(err || "Failed to add review");
                    return
                }
                toast.error("Failed to add review");
            },
        },
    );
};

//get reviews
export const useGetReviews = (product_id: string) => {
    return useQuery(
        ["getProductReview", product_id],
        () =>
            instance
                .get(`/review/product/${product_id}/`)
                .then((res) => {
                    return res?.data;
                })
                .catch((err) => {
                    throw err?.response?.data;
                }),
        {
            enabled: product_id !== "" && product_id !== undefined,
            // onError: (err: string) => {
            //     if (typeof err === "string") {
            //         toast.error(err || "Failed to get product reviews");
            //     }
            // },
            retry: 1,
            retryOnMount: false,
            refetchOnMount: false
        },
    );
};

//post a review comment
export const useSendComment = (store_id: string, product_id: string) => {
    const queryClient = useQueryClient();

    return useMutation(
        (values: CommentProps) =>
            instance
                .put(`/review/store/${store_id}/`, values, configOptions())
                .then((res) => {
                    return res?.data;
                })
                .catch((err) => {
                    throw err?.response?.data;
                }),
        {
            onSuccess: (data) => {
                toast.success(data?.message || "Successfully added reply");
                queryClient.invalidateQueries(["getProductReview", product_id]);
            },
            onError: (err: string) => {
                if (typeof err === "string") {
                    toast.error(err || "Failed to post reply");
                }
            },
        },
    );
};

//get minimum and maximum price
export const useGetMinMaxPrice = () => {
    return useQuery(["MinMaxPrice"], () => instance.get(BACKEND_URLS.product.min_max_price).then(res => res.data).catch(error => { throw error?.response?.data }), {
        retry: 1,
        refetchOnMount: false,
        refetchOnWindowFocus: false,
    })
}
