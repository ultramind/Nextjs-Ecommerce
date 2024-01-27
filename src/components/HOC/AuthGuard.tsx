import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect } from "react";

import { instance } from "@api/httpConfig";
import { AuthState } from "@atoms/authenticationState";
import { useIsFetching } from "@tanstack/react-query";
import config from "@utils/config";
import { InternalAxiosRequestConfig } from "axios";
import { BiLoaderAlt } from "react-icons/bi";
import { useRecoilValue } from "recoil";

//refresh token
async function refresh(configObj: InternalAxiosRequestConfig<any>) {
  const accessToken = Cookies.get(config.key.token);
  const refreshToken = Cookies.get(config.key.refresh);

  if (!configObj?.headers?.hasAuthorization) return configObj;

  if (
    accessToken &&
    accessToken !== undefined &&
    !accessToken.includes("undefined")
  )
    return configObj;

  if (configObj.url?.includes("/users/login/")) return configObj;

  if (configObj.url?.includes("/users/refresh-access-token/")) return configObj;

  if (!refreshToken) return configObj;

  const response = await instance.post("/users/refresh-access-token/", {
    refreshToken,
  });

  console.log({ response });

  const inFifteenMinutes = new Date(new Date().getTime() + 15 * 60 * 1000);

  if (response.status === 200) {
    Cookies.set(config.key.token, response?.data?.token?.accesstoken, {
      expires: inFifteenMinutes,
    });

    configObj.headers.Authorization = `Bearer ${response?.data?.token?.accesstoken}`;
  }

  return configObj;
}

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLoggedIn, userLoggedOut } = useRecoilValue(AuthState);
  const isFetchingUserData = useIsFetching({
    queryKey: ["getUser"],
  });

  const myInterceptor = instance.interceptors.request.use(refresh, (error) => {
    if (error) {
      router.push({
        pathname: "/auth/login",
        query: {
          next: router.asPath,
          ...router?.query,
        },
      });

      instance.interceptors.request.eject(myInterceptor);
      return;
    }
  });

  const refreshToken = Cookies.get(config.key.refresh);

  useEffect(() => {
    if (!refreshToken && !isLoggedIn) {
      instance.interceptors.request.eject(myInterceptor);
      if (userLoggedOut) {
        router.push("/auth/login");
        return;
      }
      router.push({
        pathname: "/auth/login",
        query: {
          next: router.asPath,
          ...router?.query,
        },
      });
      return;
    }

    return () => instance.interceptors.request.eject(myInterceptor);
  }, [refreshToken, router, isLoggedIn, userLoggedOut]);

  if (!isLoggedIn && isFetchingUserData) {
    return (
      <div className="grid w-full h-screen place-items-center">
        <BiLoaderAlt className="w-[2.5rem] lg:w-[3rem] h-[2.5rem] lg:h-[3rem] animate-spin text-tangerine" />
      </div>
    );
  }

  return <div>{children}</div>;
}
