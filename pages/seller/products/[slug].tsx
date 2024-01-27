import { useGetReviews } from "@api/product";
import { useGetProduct, useGetUserBusiness } from "@api/seller";
import getBusiness from "@api/services/getBusiness";
import { getSellerProduct } from "@api/services/seller";
import { AuthState } from "@atoms/authenticationState";
import { sellerBusinessState } from "@atoms/seller/business";
import { userState } from "@atoms/userState";
import SearchField from "@components/Common/SearchField";
import ProductDetailSkeleton from "@components/Loaders/Skeleton/ProductDetailSkeleton";
import Description from "@components/products/Details/Description";
import OtherDetails from "@components/products/Details/OtherDetails";
import ProductDetail from "@components/products/Details/ProductDetail";
import Reviews from "@components/products/Details/Reviews";
import { SummaryCard } from "@components/seller/SummaryCard";
import AppLayout from "@layouts/AppLayout";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { IoIosArrowBack } from "react-icons/io";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { ReviewProps } from "types/product";

function ProductPage() {
  const { isLoggedIn } = useRecoilValue(AuthState);
  const { role } = useRecoilValue(userState);
  const router = useRouter();
  const goBack = () => {
    router.push("/seller/products");
  };

  const { data: business } = useGetUserBusiness();
  const setSellerBusiness = useSetRecoilState(sellerBusinessState);

  useEffect(() => {
    if (
      business &&
      business?.adminAction === "pending" &&
      isLoggedIn &&
      role === "seller"
    ) {
      router.push("/unverified");
      return;
    }
    if (
      business &&
      isLoggedIn &&
      role === "seller" &&
      business?.adminAction === "disapproved"
    ) {
      router.push("/blocked");
      return;
    }
  }, [business]);

  useEffect(() => {
    if (business) {
      setSellerBusiness(business);
    }
  }, [business]);

  const { data, isLoading } = useGetProduct(router?.query?.slug as string);

  const { data: reviews, isLoading: gettingReviews } = useGetReviews(
    router?.query?.slug as string,
  );

  const [totalReview, setTotalReview] = useState<number>(0);

  useEffect(() => {
    if (reviews?.data?.length > 0) {
      const totalRating = reviews?.data?.reduceRight(
        (total: number, p: ReviewProps) => total + p.productRating,
        0,
      );
      setTotalReview(totalRating / 5);
    }
  }, [reviews]);

  if (!isLoggedIn) {
    return (
      <div className="grid w-full h-screen place-items-center">
        <BiLoaderAlt className="w-[2.5rem] lg:w-[3rem] h-[2.5rem] lg:h-[3rem] animate-spin text-tangerine" />
      </div>
    );
  }

  return (
    <>
      <NextSeo title={data?.name} description={data?.description} />
      <AppLayout>
        <div className="lg:pt-[2.49rem]">
          <span className="grid grid-cols-1 place-content-center w-full mt-[1.60rem] mb-[1.90rem] px-[0.95rem] lg:hidden">
            <SearchField
              style={{
                width: "100%",
              }}
            />
          </span>
          <section className="px-[0.95rem] lg:pl-[7.23rem] lg:pr-[5.51rem] overflow-hidden">
            {!isLoading && data ? (
              <>
                <button
                  onClick={goBack}
                  className="hidden md:flex items-center text-black text-t14 font-product_sans font-normal mt-[1.5rem] mb-[3rem]"
                >
                  <IoIosArrowBack size={24} />
                  <span>Back to products</span>
                </button>
                <ProductDetail
                  product={data}
                  productState={data?.state}
                  fromSeller={true}
                />
                <OtherDetails store_id={data?.storeId} moq={data?.moq} />
                <Description product={data} />
              </>
            ) : (
              isLoading && <ProductDetailSkeleton />
            )}
            {!data && (
              <p className="text-sm font-medium">
                Product not found or Couldn&apos;t load product
              </p>
            )}
          </section>
          <span className="max-w-[85.38rem] mx-auto hidden lg:block w-full h-[1.42rem] bg-platinum mt-[5.51rem]"></span>

          <section className="pl-[0.95rem] lg:my-[3.75rem] pr-2 md:pr-0 lg:pl-[7.23rem] lg:pr-[5.51rem] mb-[4.98rem]">
            <h3 className="mb-8 font-medium text-black font-roboto text-t18 lg:text-t24">
              Statistics
            </h3>
            {!isLoading && data && (
              <div className="grid w-full gap-x-[0.95rem] gap-y-[1.20rem] grid-cols-2 xs:grid-cols-[200px, 4fr] md:grid-cols-4">
                <SummaryCard
                  title="Total Purchases"
                  amount={data?.stats?.purchases || 0}
                />
                <SummaryCard
                  title="Total Views count"
                  amount={data?.stats?.views || 0}
                  subtitle="views"
                />
                <SummaryCard
                  title="Click counts"
                  amount={data?.stats?.clicks || 0}
                  subtitle="clicks"
                />
                <SummaryCard
                  title="Open orders"
                  amount={data?.stats?.openOrders || 0}
                  subtitle={
                    data?.stats?.openOrders > 1 ? "Quantities" : "Quantity"
                  }
                />
              </div>
            )}
          </section>

          {/**reviews */}
          {!gettingReviews && (
            <Reviews
              reviews={reviews?.data || []}
              totalReview={totalReview}
              fromSeller={true}
              ownerId={data?.userId}
            />
          )}
        </div>
      </AppLayout>
    </>
  );
}

ProductPage.requireAuth = true;
export default ProductPage;

export const runtime = "experimental-edge";

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  const token = req.cookies.access_token as string;
  const queryClient = new QueryClient();

  const business = await queryClient.fetchQuery(["getUserBusiness"], () =>
    getBusiness(token),
  );

  // if (!business) {
  //   queryClient.invalidateQueries(["getUserBusiness"]);
  //   return {
  //     redirect: {
  //       destination: "/",
  //       permanent: false,
  //     },
  //   };
  // }

  if (business?.adminAction === "pending") {
    return {
      redirect: {
        destination: "/unverified",
        permanent: false,
      },
    };
  }

  if (business?.adminAction === "disapproved") {
    return {
      redirect: {
        destination: "/blocked",
        permanent: false,
      },
    };
  }

  const slug = params?.slug;
  await queryClient.prefetchQuery(["getBusinessProduct", slug], () =>
    getSellerProduct(token, slug as string),
  );

  return { props: { dehydratedState: dehydrate(queryClient) } };
};
