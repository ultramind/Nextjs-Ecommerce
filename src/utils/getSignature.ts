import BACKEND_URLS from "@api/urls";

export function generateSignature(callback: any, paramsToSign: any) {
    fetch(`${BACKEND_URLS.baseURl}/product/signature`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            paramsToSign,
        }),
    })
        .then((r) => r.json())
        .then((signature) => {
            callback(signature);
        }).catch((error) => {
            throw error
        });
}
