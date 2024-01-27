import BACKEND_URLS from "@api/urls";

export const getUser = (accessToken: string) => fetch(
    `${BACKEND_URLS.baseURl}${BACKEND_URLS.auth.me}`, {
    method: "GET",
    headers: {
        Authorization: `Bearer ${accessToken}`,
    },
})
    .then(res => res.json())
    .then((res) => {
        if (res?.error) {
            return null
        }
        return res;
    })
    .catch(() => {
        // console.log("error", err)
        return null
    })

export const getWishlist = (accessToken: string) => fetch(`${BACKEND_URLS.baseURl}${BACKEND_URLS.user.wishlist}`, {
    method: "GET",
    headers: {
        Authorization: `Bearer ${accessToken}`,
    },
})
    .then(res => res.json())
    .then((res) => {
        return res;
    })
    .catch(() => {
        return []
    })

export const getUserCart = (accessToken: string, id: string) => fetch
    (`${BACKEND_URLS.baseURl}${BACKEND_URLS.user.cart}${id}`, {
        method: "GET",
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    })
    .then(res => res.json())
    .then((res) => {
        return res;
    })
    .catch(() => {
        return []
    })