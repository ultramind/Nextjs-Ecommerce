import BACKEND_URLS from "@api/urls";

export const getOrders = (accessToken: string, state: string) =>
    fetch(
        `${BACKEND_URLS.baseURl}${BACKEND_URLS.order.get}?state=${state}&limit=40`, {
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

export const getOrder = (slug: string, accessToken: string) => {
    return fetch(
        `${BACKEND_URLS.baseURl}${BACKEND_URLS.order.get}?orderId=${slug}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
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

//seller
export const getSellerOrders = (accessToken: string, state: string) =>
    fetch(
        `${BACKEND_URLS.baseURl}${BACKEND_URLS.order.store}?state=${state}`, {
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

export const getSellerOrder = (slug: string, accessToken: string) => {
    return fetch(
        `${BACKEND_URLS.baseURl}${BACKEND_URLS.order.store}?orderId=${slug}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
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