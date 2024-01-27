import {
  useGetProduct,
  useGetRelatedProducts,
  useGetReviews,
  useGetSellerOtherProducts,
} from "@api/product";
import getProduct from "@api/services/getProduct";
import { AuthState } from "@atoms/authenticationState";
import SearchField from "@components/Common/SearchField";
import ProductCardSkeleton from "@components/Loaders/Skeleton/ProductCardSkeleton";
import ProductDetailSkeleton from "@components/Loaders/Skeleton/ProductDetailSkeleton";
import AddReview from "@components/Modals/AddReview";
import Description from "@components/products/Details/Description";
import OtherDetails from "@components/products/Details/OtherDetails";
import ProductDetail from "@components/products/Details/ProductDetail";
import Reviews from "@components/products/Details/Reviews";
import ProductCard from "@components/products/ProductCard";
import AppLayout from "@layouts/AppLayout";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { useRecoilValue } from "recoil";
import { ProductProps, ReviewProps } from "types/product";
import { NextSeo, ProductJsonLd } from "next-seo";

function ProductPage() {
  const { isLoggedIn, emailVerified } = useRecoilValue(AuthState);
  const [showReviewModal, setReviewModalState] = useState(false);
  const router = useRouter();
  const goBack = () => {
    router.push("/shop");
  };

  const { data, isLoading } = useGetProduct(router?.query?.slug as string);
  const { data: products, isFetching: gettingOtherProducts } =
    useGetSellerOtherProducts(data?.storeId as string);

  const { data: otherProducts, isLoading: gettingRelatedProducts } =
    useGetRelatedProducts(router?.query?.slug as string);

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

  const addReviewHandler = () => {
    if (!isLoggedIn && !emailVerified) {
      router.push({
        pathname: "/auth/login",
        query: {
          next: router.asPath,
        },
      });
      return;
    }
    setReviewModalState(true);
  };

  return (
    <>
      <NextSeo title={data?.name} description={data?.description} />
      <ProductJsonLd
        productName={data?.name}
        description={data?.description}
        brand={data?.brand}
        color={data?.color?.join(", ")}
        reviews={reviews?.data}
        aggregateRating={{
          ratingValue: `${Number(totalReview.toFixed())}`,
          reviewCount: `${reviews?.data?.length}`,
        }}
        releaseDate={data?.createdAt}
      />
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
                  <span>Back to shop</span>
                </button>
                <ProductDetail
                  totalReview={Number(totalReview.toFixed())}
                  product={data}
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
          <span className="max-w-[85.38rem] mb-[1.42rem] mx-auto hidden lg:block w-full h-[1.42rem] bg-platinum mt-[5.51rem]"></span>

          {/**others */}

          {!gettingOtherProducts && (
            <section className="pl-[0.95rem] lg:pl-[7.23rem] mt-[1.42rem] lg:my-[3.56rem]">
              <h3 className="text-black font-roboto text-t18 lg:text-t24 font-medium mb-[1.90rem]">
                Other items from this seller
              </h3>
              <div className="mb-[1.90rem] lg:mb-[4.03rem] max-w-full overflow-auto no-scrollbar">
                <div className="flex pb-2 flex-nowrap w-fit h-fit">
                  {!gettingOtherProducts && products?.data?.length > 0
                    ? products?.data?.map((product: ProductProps) => (
                        <ProductCard item={product} key={product?._id} />
                      ))
                    : !gettingOtherProducts &&
                      !products && (
                        <p className="text-sm font-medium">No other product</p>
                      )}
                  {gettingOtherProducts && (
                    <>
                      {Array(10)
                        .fill("")
                        .map((d, index) => (
                          <ProductCardSkeleton key={index} />
                        ))}
                    </>
                  )}
                </div>
              </div>
            </section>
          )}

          {/**you may like */}

          {!gettingRelatedProducts && otherProducts?.length > 0 && (
            <section className="pl-[0.95rem] lg:pl-[7.23rem] mt-[1.42rem]">
              <h3 className="text-black font-roboto text-t18 lg:text-t24 font-medium mb-[1.90rem]">
                You may also like
              </h3>
              <div className="mb-[1.90rem] lg:mb-[4.03rem] max-w-full overflow-auto no-scrollbar">
                <div className="flex pb-2 flex-nowrap w-fit h-fit">
                  {otherProducts?.data?.map((product: ProductProps) => (
                    <ProductCard item={product} key={product?._id} />
                  ))}
                </div>
              </div>
            </section>
          )}

          {/**reviews */}
          {!gettingReviews && (
            <Reviews
              reviews={reviews?.data || []}
              totalReview={totalReview}
              addReview={addReviewHandler}
              ownerId={data?.userId}
            />
          )}
        </div>
      </AppLayout>
      {showReviewModal && (
        <AddReview close={() => setReviewModalState(false)} />
      )}
    </>
  );
}

export default ProductPage;
// export const runtime = "experimental-edge";

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  const queryClient = new QueryClient();

  const slug = params?.slug;
  await queryClient.prefetchQuery(["getProduct", slug], () =>
    getProduct(slug as string),
  );

  return { props: { dehydratedState: dehydrate(queryClient) } };
};
