import { configOptions, instance } from "@api/httpConfig";
import BACKEND_URLS from "@api/urls";
import { AuthState } from "@atoms/authenticationState";
import { CartState } from "@atoms/cartState";
import { MobileNavigatorState } from "@atoms/mobileNavigator";
import { registrationState } from "@atoms/registrationState";
import { userState } from "@atoms/userState";
import { verifyOtpState } from "@atoms/verifyOtpState";
import { WishlistState } from "@atoms/wishlistState";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import config from "@utils/config";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { isMobile } from "react-device-detect";
import { toast } from "react-hot-toast";
import { useResetRecoilState, useSetRecoilState } from "recoil";
import {
  LoginDetails,
  RegisterDetails,
  forgotPassword,
  resetPassword,
} from "types/authentication";
import { IError } from "types/index";

//useGoogle
export const useGoogle = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setMobileNavigatorComponent = useSetRecoilState(MobileNavigatorState);
  const setAuth = useSetRecoilState(AuthState);

  return useMutation(
    (values: { code: string }) =>
      instance
        .post(BACKEND_URLS.auth.google, values)
        .then((res) => {
          return res?.data;
        })
        .catch((err) => {
          throw err?.response?.data;
        }),
    {
      onSuccess: (data) => {
        //cookie expires in fifteen minutes
        const inSixHours = new Date(new Date().getTime() + 6 * 60 * 60 * 1000);
        Cookies.set(config.key.token, data.accesstoken, {
          expires: inSixHours,
        });
        Cookies.set(config.key.refresh, data.refreshToken, {
          expires: inSixHours,
        });

        toast.success(data.message || "Login Successful");
        setAuth({
          isLoggedIn: true,
          emailVerified: true,
          userLoggedOut: false,
        });

        queryClient.invalidateQueries(["getUser"]);
        if (isMobile) {
          setMobileNavigatorComponent("");
          return;
        }
        router.push((router?.query?.next as string) || "/");
      },
      onError: (err: IError) => {
        if (typeof err === "string") {
          toast.error(err || "Failed to authenticate with Google");
          return;
        }
        toast.error(err?.message || "Failed to authenticate with Google");
      },
    },
  );
};

export const useLogin = (email?: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const setVerifyOtpState = useSetRecoilState(verifyOtpState);
  const setMobileNavigatorComponent = useSetRecoilState(MobileNavigatorState);
  const setAuth = useSetRecoilState(AuthState);
  return useMutation(
    (values: LoginDetails) => {
      return instance
        .post(BACKEND_URLS.auth.login, values)
        .then((res) => {
          return res.data;
        })
        .catch((err) => {
          throw err?.response?.data;
        });
    },
    {
      onSuccess: (data) => {
        //cookie expires in fifteen minutes
        const inSixHours = new Date(new Date().getTime() + 60 * 6 * 60 * 1000);
        queryClient.invalidateQueries(["getUser"]);
        Cookies.set(config.key.token, data.user.accesstoken, {
          expires: inSixHours,
        });
        Cookies.set(config.key.refresh, data.user.refreshToken, {
          expires: inSixHours,
        });
        toast.success(data.message);
        setAuth({
          isLoggedIn: true,
          emailVerified: true,
          userLoggedOut: false,
        });
        if (isMobile) {
          setMobileNavigatorComponent("");
          return;
        }
        router.push((router?.query?.next as string) || "/");
      },
      onError: (err: IError) => {
        if (err.error) {
          toast.error(err.error);
          if (err.error === "Please verify your account") {
            setVerifyOtpState({ type: "email", email: email as string });
            if (isMobile) {
              setMobileNavigatorComponent("verify");
              return;
            }
            router.push("/auth/verify");
          }
          return;
        }
        toast.error(err.message);
      },
    },
  );
};

// for registration
export const useRegister = (next_route?: string) => {
  const setVerifyOtpState = useSetRecoilState(verifyOtpState);
  const setNewRegisteredUser = useSetRecoilState(registrationState);
  const router = useRouter();
  return useMutation(
    (values: RegisterDetails) => {
      return instance
        .post(BACKEND_URLS.auth.register, values)
        .then((res) => res.data)
        .catch((err) => {
          throw err.response.data;
        });
    },
    {
      onSuccess: (data) => {
        setNewRegisteredUser(data.newUser);
        toast.success(data.message);
        setVerifyOtpState({ type: "email", email: data.newUser.email });
        if (!next_route) {
          router.push("/auth/verify");
          return;
        }
        router.push(next_route);
      },
      onError: (err: IError) => {
        if (err.error) {
          toast.error(err.error);
          return;
        }
        if (err.errors) {
          Object.entries(err.errors).map(([, value]) => {
            toast.error(value[0]);
          });
          return;
        }
        toast.error(err.message);
      },
    },
  );
};

type verifyOtp = {
  otp: string;
  email: string;
};
export const useVerifyAccount = () => {
  const reset = useResetRecoilState(registrationState);
  return useMutation(
    (values: verifyOtp) => {
      return instance
        .patch(BACKEND_URLS.auth.verifyEmail, values)
        .then((res) => res.data)
        .catch((err) => {
          throw err.response.data;
        });
    },
    {
      onSuccess: (data) => {
        // console.log(data);
        toast.success(data.message);
        reset();
      },
      onError: (err: IError) => {
        // console.log(err)
        if (err.error) {
          toast.error(err.error);
          return;
        }
        if (err.errors) {
          Object.entries(err.errors).map(([, value]) => {
            toast.error(value[0]);
          });
          return;
        }
        toast.error(err.message);
      },
    },
  );
};

export const useResendOtp = () => {
  return useMutation(
    (email: string) => {
      return instance
        .put(BACKEND_URLS.auth.resendOtp, { email })
        .then((res) => res.data)
        .catch((err) => {
          throw err.response.data;
        });
    },
    {
      onSuccess: (data) => {
        toast.success(data.message);
      },
      onError: (err: IError) => {
        // console.log(err)
        if (err.error) {
          toast.error(err.error);
          return;
        }
        if (err.errors) {
          Object.entries(err.errors).map(([, value]) => {
            toast.error(value[0]);
          });
          return;
        }
        toast.error(err.message);
      },
    },
  );
};

// useResetPassword
export const useResetPassword = () => {
  return useMutation(
    (values: resetPassword) => {
      return instance
        .patch(BACKEND_URLS.auth.resetPassword, values)
        .then((res) => res.data)
        .catch((err) => {
          throw err.response.data;
        });
    },
    {
      onSuccess: (data) => {
        // console.log(data)
        toast.success(data.message);
      },
      onError: (err: IError) => {
        if (err.error) {
          toast.error(err.error);
          return;
        }
        toast.error(err.message);
      },
    },
  );
};

// useForgotPassword
export const useForgotPassword = (email?: string) => {
  const router = useRouter();
  const setVerifyOtpState = useSetRecoilState(verifyOtpState);
  const setMobileNavigatorComponent = useSetRecoilState(MobileNavigatorState);
  return useMutation(
    (values: forgotPassword) => {
      return instance
        .patch(BACKEND_URLS.auth.forgotPassword, values)
        .then((res) => res.data)
        .catch((err) => {
          throw err.response.data;
        });
    },
    {
      onSuccess: () => {
        // console.log(data)
        // toast.success(data.message);
        toast.success("Password reset otp sent to your email");
        setVerifyOtpState({ type: "password-reset", email: email as string });
        if (isMobile) {
          setMobileNavigatorComponent("verify");
          return;
        }
        router.push("/auth/verify");
      },
      onError: (err: IError) => {
        // console.log(err)
        if (err.error) {
          toast.error(err.error);
          return;
        }
        toast.error(err.message);
      },
    },
  );
};

export const useGetUser = () => {
  const token = Cookies.get(config.key.token);
  const refreshToken = Cookies.get(config.key.refresh);

  return useQuery(
    ["getUser"],
    () =>
      instance
        .get(BACKEND_URLS.auth.me, configOptions())
        .then((res) => {
          return res?.data;
        })
        .catch((err) => {
          throw err?.response?.data;
        }),
    {
      retry: 1,
      enabled: token !== undefined || refreshToken !== undefined,
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  );
};

export const useLogout = () => {
  const queryClient = useQueryClient();
  const setUser = useSetRecoilState(userState);
  const setAuth = useSetRecoilState(AuthState);
  const resetWishlistState = useResetRecoilState(WishlistState);
  const resetCartState = useResetRecoilState(CartState);
  return useMutation(
    () => {
      return instance
        .post(
          BACKEND_URLS.auth.logout,
          {
            refreshToken: Cookies.get(config.key.refresh),
          },
          configOptions(),
        )
        .then((res) => res?.data)
        .catch((err) => {
          throw err?.response?.data;
        });
    },
    {
      onSuccess: (data) => {
        setUser({});
        setAuth({
          isLoggedIn: false,
          emailVerified: false,
          userLoggedOut: true,
        });
        toast.success(data?.message);
        Cookies.remove(config.key.token);
        Cookies.remove(config.key.refresh);
        resetCartState();
        resetWishlistState();
        queryClient.removeQueries();
        queryClient.clear();
      },
      onError: (err: IError) => {
        // console.log(err)
        if (err?.error) {
          toast.error(err.error);
          if (
            err?.error.includes(
              "failed to logout, user not found or already logged out",
            )
          ) {
            setUser({});
            setAuth({ isLoggedIn: false, emailVerified: false });
            Cookies.remove(config.key.token);
            Cookies.remove(config.key.refresh);
            resetCartState();
            resetWishlistState();
          }
          return;
        }
        if (err?.errors) {
          Object.entries(err?.errors).map(([, value]) => {
            toast.error(value[0]);
          });
          return;
        }
        toast.error(err?.message);
      },
    },
  );
};

export const useGetRefreshToken = (execute: boolean) => {
  const refreshToken = Cookies.get(config.key.refresh);
  const accessToken = Cookies.get(config.key.token);

  return useQuery(
    ["getRefreshToken"],
    () =>
      instance
        .post(`${BACKEND_URLS.auth.refreshToken}`, {
          refreshToken,
        })
        .then((res) => res?.data)
        .catch((err) => {
          throw err?.response?.data;
        }),
    {
      retry: false,
      refetchOnMount: false,
      retryOnMount: false,
      enabled:
        execute && refreshToken !== undefined && accessToken === undefined,
    },
  );
};

export type UpdateProfile = {
  firstName?: string;
  lastName?: string;
  email?: string;
  phoneNumber?: string;
  address: {
    country?: string;
    state?: string;
    city?: string;
    postalCode?: string;
    address?: string;
  };
  fcm_token?: string;
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  return useMutation(
    (values: Partial<UpdateProfile>) =>
      instance
        .patch(`/users/`, values, configOptions())
        .then((res) => res.data)
        .catch((err) => {
          throw err.response.data;
        }),
    {
      onSuccess: (data) => {
        if (data) {
          queryClient.invalidateQueries(["getUser"]);
          toast.success("Updated successfully");
        }
      },
      onError: (err: IError) => {
        if (err.error) {
          toast.error(err.error);
          return;
        }
        toast.error(err.message);
      },
    },
  );
};

interface PushTokenProps {
  state: boolean;
  deviceToken: string;
}

//push notification
export const useAddPushNotificationToken = () => {
  return useMutation((values: Partial<PushTokenProps>) =>
    instance
      .post(`/users/push-notification`, values, configOptions())
      .then((res) => res.data)
      .catch((err) => {
        throw err.response.data;
      }),
  );
};
