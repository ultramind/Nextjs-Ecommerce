import BACKEND_URLS from "@api/urls";

const getTransactions = (accessToken: string) => fetch
    (`${BACKEND_URLS.baseURl}${BACKEND_URLS.seller.wallet.transaction}`, {
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
        return null
    })

export default getTransactions