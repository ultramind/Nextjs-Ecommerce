import BACKEND_URLS from "@api/urls";

const getBusiness = (accessToken: string) =>
  fetch(`${BACKEND_URLS.baseURl}${BACKEND_URLS.seller.business}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    signal: new AbortController().signal,
    cache: "no-store",
  })
    .then((res) => res.json())
    .then((res) => {
      if (typeof res === "string") {
        return null;
      }
      return res;
    })
    .catch(() => {
      return null;
    });

export default getBusiness;

export const getStore = () =>
  fetch(`${BACKEND_URLS.baseURl}${BACKEND_URLS.seller.public}`, {
    method: "GET",
  })
    .then((res) => res.json())
    .then((res) => {
      return res;
    })
    .catch(() => {
      return null;
    });
