import BACKEND_URLS from "@api/urls";

const getProducts = (category: string | null, page: number) => {
    return fetch(
        `${BACKEND_URLS.baseURl}${BACKEND_URLS.product.index}?limit=40&page=${page}${category ? `&category=${category?.replace(" ", "")}` : ""}`, {
        method: "GET",
    })
        .then(res => res.json())
        .then((res) => {
            if (typeof res === "string") {
                return []
            }
            return res;
        })
        .catch(() => {
            return null
        })
}

export default getProducts

export const getOtherProducts = (params: any) => {
    const url = new URL(`${BACKEND_URLS.baseURl}${BACKEND_URLS.product.index}others/`)
    Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
    return fetch(
        url, {
        method: "GET",
    })
        .then(res => res.json())
        .then((res) => {
            if (typeof res === "string") {
                return []
            }
            return res;
        })
        .catch(() => {
            return null
        })
}
