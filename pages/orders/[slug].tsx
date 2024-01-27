import { useGetOrder } from "@api/orders/user";
import { getOrder } from "@api/services/getOrders";
import { getUser } from "@api/services/user";
import { AuthState } from "@atoms/authenticationState";
import ProductDetailSkeleton from "@components/Loaders/Skeleton/ProductDetailSkeleton";
import ProductDetails from "@components/Orders/ProductDetails";
import AppLayout from "@layouts/AppLayout";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { IoIosArrowBack } from "react-icons/io";
import { useRecoilValue } from "recoil";

function Order() {
  const { isLoggedIn } = useRecoilValue(AuthState);
  const router = useRouter();
  const goBack = () => {
    router.push("/orders");
  };

  const { data, isLoading } = useGetOrder(router?.query?.slug as string);

  if (!isLoggedIn) {
    return (
      <div className="grid w-full h-screen place-items-center">
        <BiLoaderAlt className="w-[2.5rem] lg:w-[3rem] h-[2.5rem] lg:h-[3rem] animate-spin text-tangerine" />
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="lg:pt-[2.49rem]">
        <section className="px-[0.95rem] lg:pl-[7.23rem] lg:pr-[5.51rem] mb-[1.42rem] lg:mb-[3.56rem] block">
          <button
            onClick={goBack}
            className="hidden md:flex items-center text-black text-t14 font-product_sans font-normal mb-[4.03rem]"
          >
            <IoIosArrowBack size={24} />
            <span>Back to Orders</span>
          </button>
          {data && !isLoading ? (
            <ProductDetails data={data} />
          ) : isLoading ? (
            <ProductDetailSkeleton />
          ) : (
            <p className="text-sm font-medium opacity-70">
              Failed to get order or wrong order Id
            </p>
          )}
        </section>
      </div>
    </AppLayout>
  );
}

Order.requireAuth = true;
export default Order;

export const runtime = "experimental-edge";

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  const token = req.cookies.access_token as string;
  const queryClient = new QueryClient();

  const user = await queryClient.fetchQuery(["getUser"], () => getUser(token));
  if (!user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  if (user) {
    const slug = params?.slug;
    await queryClient.prefetchQuery(["getUserOrder", slug], () =>
      getOrder(slug as string, token),
    );
  }

  return { props: { dehydratedState: dehydrate(queryClient) } };
};
