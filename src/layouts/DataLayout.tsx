import { useGetRefreshToken, useGetUser } from "@api/authentication";
import { useGetCart } from "@api/user/cart";
import { useGetWishlist } from "@api/user/wishlist";
import { AuthState } from "@atoms/authenticationState";
import { globalCurrency, globalExchangeRates } from "@atoms/globalState";
import { userCountry } from "@atoms/userCountry";
import { userState } from "@atoms/userState";
import {
  useForegroundNotification,
  useRefreshNotificationToken,
} from "@hooks/useNotification";
import config from "@utils/config";
import { Country } from "country-state-city";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ExchangeRate } from "types/cart";

function DataLayout({
  children,
  protectedRoute = false,
}: {
  children: React.ReactNode;
  protectedRoute?: boolean;
}) {
  // refresh token on unprotected routes
  const { data: refreshTokenData, isSuccess } = useGetRefreshToken(
    !protectedRoute,
  );

  useEffect(() => {
    if (isSuccess && refreshTokenData) {
      const inFifteenMinutes = new Date(new Date().getTime() + 15 * 60 * 1000);
      Cookies.set(config.key.token, refreshTokenData?.token?.accesstoken, {
        expires: inFifteenMinutes,
      });
    }
  }, [isSuccess, refreshTokenData]);

  const setUser = useSetRecoilState(userState);
  const setAuth = useSetRecoilState(AuthState);
  const [countryOfUser, setUserCountry] = useRecoilState(userCountry);
  const { data, isError } = useGetUser();
  const router = useRouter();
  const countries = Country.getAllCountries();
  const [rates, setRates] = useState<ExchangeRate | null>(null);

  const [currency, setGlobalCurrency] = useRecoilState(globalCurrency);
  const setGlobalExchangeRates = useSetRecoilState(globalExchangeRates);

  useEffect(() => {
    if (countryOfUser) {
      const res = countries.find(
        (country) => country.isoCode === countryOfUser,
      );
      if (res) {
        // console.log(res);
        setGlobalCurrency(res.currency);
      }
    }
  }, [countries, countryOfUser]);

  useEffect(() => {
    if (rates && currency) {
      setGlobalExchangeRates(rates.rates);
    }
  }, [rates, currency]);

  useEffect(() => {
    if (data?.isVerified) {
      setUser(data);
      setAuth({ isLoggedIn: true, emailVerified: true, userLoggedOut: false });
    }
  }, [data]);

  useGetWishlist();
  useGetCart();

  //notification
  useRefreshNotificationToken(data?.id, data?.fcm_token);
  useForegroundNotification();

  useEffect(() => {
    //gets user's country
    fetch("https://api.country.is/")
      .then((res) => res.json())
      .then((data) => {
        setUserCountry(data?.country);
      })
      .catch((err) => {
        console.error(err);
      });

    //gets currency exchange rates
    fetch("https://cdn.moneyconvert.net/api/latest.json")
      .then((res) => res.json())
      .then((data: ExchangeRate) => {
        setRates(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  useEffect(() => {
    if (protectedRoute && isError) {
      toast.error("Failed to load page data due to some error.");
      router.push("/");
      return;
    }
  }, [isError]);

  return children;
}

export default DataLayout;
