import { useGetOrder, useGetRelatedOrders } from "@api/orders/seller";
import { useGetUserBusiness } from "@api/seller";
import getBusiness from "@api/services/getBusiness";
import { getSellerOrder } from "@api/services/getOrders";
import { AuthState } from "@atoms/authenticationState";
import { sellerBusinessState } from "@atoms/seller/business";
import { userState } from "@atoms/userState";
import ProductDetailSkeleton from "@components/Loaders/Skeleton/ProductDetailSkeleton";
import ProductDetails from "@components/Orders/ProductDetails";
import OrderCard from "@components/seller/OrderCard";
import AppLayout from "@layouts/AppLayout";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { IoIosArrowBack } from "react-icons/io";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { OrderItem } from "types/order";
function OrderDetails() {
  const router = useRouter();
  const { role } = useRecoilValue(userState);
  const goBack = () => {
    router.push("/seller/orders/");
  };

  const { data, isLoading: gettingOrder } = useGetOrder(
    router?.query?.slug as string,
  );

  const { isLoading, data: relatedOrders } = useGetRelatedOrders(
    router?.query?.slug as string,
    data?._id,
  );

  const { data: business } = useGetUserBusiness();
  const { isLoggedIn } = useRecoilValue(AuthState);

  useEffect(() => {
    if (
      business &&
      business?.adminAction === "pending" &&
      isLoggedIn &&
      role === "seller"
    ) {
      router.push("/unverified");
    }
  }, [business]);

  const setSellerBusiness = useSetRecoilState(sellerBusinessState);

  useEffect(() => {
    if (business) {
      setSellerBusiness(business);
    }
  }, [business]);

  if (!isLoggedIn) {
    return (
      <div className="grid w-full h-screen place-items-center">
        <BiLoaderAlt className="w-[2.5rem] lg:w-[3rem] h-[2.5rem] lg:h-[3rem] animate-spin text-tangerine" />
      </div>
    );
  }

  return (
    <>
      <AppLayout>
        <div className="lg:pt-[2.49rem]">
          <section className="px-[0.95rem] lg:pl-[7.23rem] lg:pr-[5.51rem] mb-[1.42rem] lg:mb-[3.56rem]">
            <button
              onClick={goBack}
              className="hidden md:flex items-center text-black text-t14 font-product_sans font-normal mb-[4.03rem]"
            >
              <IoIosArrowBack size={24} />
              <span>Back to Orders</span>
            </button>
            {data && !gettingOrder ? (
              <ProductDetails data={data} fromSeller />
            ) : gettingOrder ? (
              <ProductDetailSkeleton />
            ) : (
              <p className="text-sm font-medium opacity-70">
                Failed to get order or wrong order Id
              </p>
            )}
          </section>
          {!isLoading && relatedOrders?.length > 0 && (
            <section className="px-[0.95rem] lg:pl-[7.23rem] lg:pr-[5.51rem] mb-[1.42rem] lg:mb-[3.56rem]">
              <div className="mt-16 lg:mt-0">
                <h3 className="mb-8 font-medium text-t18 md:text-t20 font-roboto">
                  Orders from the same User
                </h3>

                <div className="flex w-full h-[200px] md:h-full overflow-x-auto space-x-8 p-1 no-scrollbar">
                  {relatedOrders.map((order: OrderItem) => (
                    <OrderCard key={order?._id} data={order} seller={true} />
                  ))}
                </div>
              </div>
            </section>
          )}
        </div>
      </AppLayout>
    </>
  );
}

OrderDetails.requireAuth = true;
export default OrderDetails;

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
  await queryClient.prefetchQuery(["getSellerOrder", slug], () =>
    getSellerOrder(slug as string, token),
  );

  return { props: { dehydratedState: dehydrate(queryClient) } };
};
