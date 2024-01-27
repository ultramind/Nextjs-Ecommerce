import BACKEND_URLS from "@api/urls";

export const getCategories = (accessToken: string) =>
    fetch(
        `${BACKEND_URLS.baseURl}${BACKEND_URLS.catalog.categories}`, {
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