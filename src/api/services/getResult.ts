import BACKEND_URLS from "@api/urls";

const getResult = (search: string) => {
    return fetch(
        `${BACKEND_URLS.baseURl}${BACKEND_URLS.product.index}?search=${search}`, {
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

export default getResult