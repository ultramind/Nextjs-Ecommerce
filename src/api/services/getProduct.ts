import BACKEND_URLS from "@api/urls";

const getProduct = (slug: string) => {
    return fetch(
        `${BACKEND_URLS.baseURl}${BACKEND_URLS.product.index}?productId=${slug}`, {
        method: "GET",
    })
        .then(res => res.json())
        .then((res) => {
            if (typeof res === "string") {
                return null
            }
            return res;
        })
        .catch(() => {
            return null
        })
}

export default getProduct