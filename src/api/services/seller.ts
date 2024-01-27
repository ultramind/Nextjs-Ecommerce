import BACKEND_URLS from "@api/urls";


export const getSellerProducts = (accessToken: string, state: string) =>
    fetch(
        `${BACKEND_URLS.baseURl}${BACKEND_URLS.product.seller}?state=${state}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
        .then(res => res.json())
        .then((res) => {
            if (typeof res === "string") {
                return []
            }
            return res;
        })
        .catch(() => {
            return []
        })

export const getSellerProduct = (accessToken: string, slug: string) =>
    fetch(
        `${BACKEND_URLS.baseURl}${BACKEND_URLS.product.seller}?productId=${slug}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
        .then(res => res.json())
        .then((res) => {
            if (typeof res === "string") {
                return []
            }
            return res;
        })
        .catch(() => {
            return []
        })