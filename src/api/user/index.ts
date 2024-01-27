import { AuthState } from "@atoms/authenticationState";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import toast from "react-hot-toast";
import { useRecoilValue } from "recoil";
import { configOptions, instance } from "../httpConfig";
import BACKEND_URLS from "../urls";


//get cart items, orders, wishlist
export const useGetUserDownloads = () => {
    const { isLoggedIn, emailVerified } = useRecoilValue(AuthState);
    const { query: { page } } = useRouter();

    return useQuery(
        ["getUserDownloads", Number(page) || 1],
        () =>
            instance
                .get(`${BACKEND_URLS.user.download}`, { ...configOptions(), params: { page: Number(page) || 1, limit: 40 } })
                .then((res) => {
                    return res?.data;
                })
                .catch((err) => {
                    throw err?.response?.data;
                }),
        {
            enabled: isLoggedIn && emailVerified,
            retry: 1,
            refetchOnWindowFocus: false,
            refetchOnMount: false,
        },
    );
};

//add, and update profile picture
export const useUploadProfilePicture = () => {
    const queryClient = useQueryClient();
    return useMutation((value: { profilePicture: string }) => instance.post(BACKEND_URLS.user.profile_picture, value, configOptions()), {
        onSuccess: () => {
            queryClient.invalidateQueries(["getUser"])
        },
        onError: (err: string) => {
            if (typeof err === "string") {
                toast.error(err);
                return
            }
            toast.error("Failed update profile picture")
        },
    })
}

//remove profile picture
export const useDeleteProfilePicture = () => {
    const queryClient = useQueryClient();
    return useMutation((params: { publicId: string }) => instance.delete(BACKEND_URLS.user.profile_picture, { ...configOptions(), params }), {
        onSuccess: () => {
            queryClient.invalidateQueries(["getUser"])
        },
        onError: (err: string) => {
            if (typeof err === "string") {
                toast.error(err);
                return
            }
            toast.error("Failed delete profile picture")
        },
    })
}