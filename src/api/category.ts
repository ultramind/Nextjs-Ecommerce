import { useQuery } from "@tanstack/react-query";
import { configOptions, instance } from "./httpConfig";
import BACKEND_URLS from "./urls";

// get categories
export const useGetCategories = () => {
    return useQuery(
        ["getCategories"],
        () =>
            instance
                .get(BACKEND_URLS.catalog.categories, configOptions())
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

// get active categories
export const useGetActiveCategories = () => {
    return useQuery(
        ["getActiveCategories"],
        () =>
            instance
                .get(BACKEND_URLS.catalog.active_categories, configOptions())
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

// get sub-categories
export const useGetSubCategories = (category_id: string) => {
    return useQuery(
        ["getSubCategories", category_id],
        () =>
            instance
                .get(BACKEND_URLS.catalog.subcategories, {
                    ...configOptions(), params: {
                        category: category_id
                    }
                })
                .then((res) => {
                    return res?.data;
                })
                .catch((err) => {
                    throw err?.response?.data;
                }),
        {
            enabled: category_id !== "",
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
        },
    );
};

// get brands
export const useGetBrands = (fromFilter = false) => {
    return useQuery(
        ["getBrands", fromFilter],
        () =>
            instance
                .get(fromFilter ? BACKEND_URLS.catalog.active_brands : BACKEND_URLS.catalog.brands, configOptions())
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
            retryOnMount: false
        },
    );
};

// get colors
export const useGetColors = (fromFilter = false) => {
    return useQuery(
        ["getColors", fromFilter],
        () =>
            instance
                .get(fromFilter ? BACKEND_URLS.catalog.active_colors : BACKEND_URLS.catalog.colors, configOptions())
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