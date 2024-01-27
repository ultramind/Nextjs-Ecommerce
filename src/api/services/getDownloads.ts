import BACKEND_URLS from "@api/urls";

export const getDownloads = (accessToken: string) =>
  fetch(`${BACKEND_URLS.baseURl}${BACKEND_URLS.user.download}?limit=40`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      return res;
    })
    .catch(() => {
      return [];
    });
