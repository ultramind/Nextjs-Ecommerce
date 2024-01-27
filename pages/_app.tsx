import AuthGuard from "@components/HOC/AuthGuard";
import DataLayout from "@layouts/DataLayout";
import MobileNavigatorLayout from "@layouts/MobileNavigatorLayout";
import { GoogleOAuthProvider } from "@react-oauth/google";
import "@splidejs/react-splide/css";
import "@stripe/stripe-js";
import "@styles/globals.css";
import {
  Hydrate,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { DefaultSeo } from "next-seo";
import { Roboto } from "next/font/google";
import localFont from "next/font/local";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { Toaster } from "react-hot-toast";
import { IoCloseCircle } from "react-icons/io5";
import { RecoilRoot } from "recoil";
import { NextPageWithLayout } from "types/index";

const product_sans = localFont({
  src: "../src/assets/fonts/Product Sans Regular.ttf",
  variable: "--font-productSans",
});

const roboto = Roboto({
  weight: ["100", "300", "400", "500", "700", "900"],
  subsets: ["vietnamese"],
  variable: "--font-roboto",
});

function CookiePopup() {
  const [isCookiePopupRead, setCookiePopupReadStatus] = useState(true);

  useEffect(() => {
    if (typeof window !== undefined) {
      const status = window.localStorage.getItem("CookiePopupRead");
      if (status) {
        setCookiePopupReadStatus(true);
      } else {
        setCookiePopupReadStatus(false);
      }
    }
  }, []);

  const cookieReadHandler = () => {
    setCookiePopupReadStatus(true);
    if (typeof window !== undefined) {
      window.localStorage.setItem("CookiePopupRead", "true");
    }
  };
  return (
    <>
      {!isCookiePopupRead ? (
        <div className="fixed z-[100] bottom-0 left-0 w-full bg-platinum text-sm font-roboto p-2.5 lg:px-[2.5rem] text-spanish">
          <div className="relative pt-5 lg:pt-0">
            <p>
              This website uses cookies. For further information on how we use
              cookies you can read our{" "}
              <Link href="/privacy-policy" className="text-blue-600">
                privacy policy
              </Link>
            </p>
            <IoCloseCircle
              size={24}
              onClick={cookieReadHandler}
              className="absolute cursor-pointer -top-1.5 lg:top-0 text-spanish_gray right-1"
            />
          </div>
        </div>
      ) : (
        <></>
      )}
    </>
  );
}

function Loading() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const handleStart = (url: any) => url !== router.asPath && setLoading(true);
    const handleComplete = () => setLoading(false);

    router.events.on("routeChangeStart", handleStart);
    router.events.on("routeChangeComplete", handleComplete);
    router.events.on("routeChangeError", handleComplete);

    return () => {
      router.events.off("routeChangeStart", handleStart);
      router.events.off("routeChangeComplete", handleComplete);
      router.events.off("routeChangeError", handleComplete);
    };
  });

  return loading ? (
    <div className="fixed z-[150] top-0 left-0 w-screen h-1">
      <div className="w-5 h-full bg-tangerine global-loader"></div>
    </div>
  ) : (
    <div className="fixed z-[150] top-0 left-0 w-screen h-1 global-loader-finished">
      <div className="w-full h-full bg-tangerine"></div>
    </div>
  );
}

type Props = {
  Component: NextPageWithLayout;
  pageProps: any;
};

export default function App({ Component, pageProps }: Props) {
  const [queryClient] = React.useState(() => new QueryClient());
  const [fonts, setFonts] = useState("");

  useEffect(() => {
    setFonts(`${product_sans.variable} ${roboto.variable}`);
  }, []);

  return (
    <>
      <DefaultSeo
        openGraph={{
          type: "website",
          locale: "en_US",
          url: "https://niteon.co/",
          siteName: "Niteon Market",
          title: "Niteon Market - Africa Trade Center",
          description: `NITEON is a B2B marketplace focused on connecting
          emerging African businesses to the globalized world economy.`,

          images: [
            {
              url: "https://niteon.co/images/slides/0F2836F9-4481-4F03-BC67-9D0443E8.jpg",
              width: 800,
              height: 600,
              alt: "Niteon OG",
            },
            {
              url: "https://niteon.co/images/slides/13957E93-C04B-4C4B-831B-941A155C.jpg",
              width: 800,
              height: 600,
              alt: "Niteon Og",
            },
            {
              url: "https://niteon.co/images/slides/D3EA39F6-7C3B-41A5-8BB2-BBC5539A.jpg",
              width: 800,
              height: 600,
              alt: "Niteon Og",
            },
          ],
        }}
        defaultTitle="Niteon Market - Africa Trade Center"
        twitter={{
          handle: "@niteonhq",
          site: "niteon.co",
          cardType: "summary_large_image",
        }}
        canonical="https://niteon.co/"
        description="NITEON is a B2B marketplace focused on connecting
        emerging African businesses to the globalized world economy."
        additionalMetaTags={[
          {
            name: "keywords",
            content:
              "niteon, niteon business, niteon market, market, ecommerce, Market place, b2b, africa market, africa marketplace, african businesses, business, sell on Niteon, sell african goods, build a business, sell, ecommerce website, seller",
          },
        ]}
        additionalLinkTags={[
          {
            rel: "icon",
            href: "https://niteon.co/favicon.ico",
          },
        ]}
      />
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <Hydrate state={pageProps.dehydratedState}>
            <GoogleOAuthProvider
              clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}
            >
              <Toaster position="top-center" reverseOrder={true} />
              <MobileNavigatorLayout>
                <main className={fonts}>
                  <Loading />
                  {Component.requireAuth ? (
                    <AuthGuard>
                      <DataLayout protectedRoute={Component.requireAuth}>
                        <Component {...pageProps} />
                      </DataLayout>
                    </AuthGuard>
                  ) : (
                    <DataLayout>
                      <Component {...pageProps} />
                    </DataLayout>
                  )}
                  <CookiePopup />
                </main>
              </MobileNavigatorLayout>
              <ReactQueryDevtools initialIsOpen={false} />
            </GoogleOAuthProvider>
          </Hydrate>
        </QueryClientProvider>
      </RecoilRoot>
    </>
  );
}
