import { AuthState } from "@atoms/authenticationState";
import config from "@utils/config";
import Cookies from "js-cookie";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { useRecoilValue } from "recoil";

function AuthLayout({ children }: { children: JSX.Element | JSX.Element[] }) {
  const router = useRouter();
  const { isLoggedIn, emailVerified } = useRecoilValue(AuthState);
  const accessToken = Cookies.get(config.key.token);
  const refreshToken = Cookies.get(config.key.refresh);

  useEffect(() => {
    if (
      isLoggedIn &&
      !router.pathname.includes("/auth/seller/profile") &&
      router.pathname.includes("auth") &&
      emailVerified &&
      refreshToken &&
      accessToken
    ) {
      router.push({
        pathname: (router?.query?.next as string) || "/",
      });

      return;
    }
  }, [isLoggedIn, router, emailVerified, accessToken, refreshToken]);

  // console.log(data);

  if (
    isLoggedIn &&
    !router.pathname.includes("/auth/seller/profile") &&
    emailVerified &&
    refreshToken &&
    accessToken
  ) {
    return (
      <div className="grid w-full h-screen place-items-center">
        <BiLoaderAlt className="w-[2.5rem] lg:w-[3rem] h-[2.5rem] lg:h-[3rem] animate-spin text-tangerine" />
      </div>
    );
  }

  return (
    <div className="relative min-h-screen h-fit max-w-full w-screen px-[1rem] lg:px-0">
      <Link
        href="/"
        className="lg:absolute block lg:top-[3.11rem] w-fit lg:left-[2.11rem]"
      >
        <Image
          src="/niteon.svg"
          width={100}
          height={100}
          alt="niteon"
          priority
        />
      </Link>
      {children}
    </div>
  );
}

export default AuthLayout;
