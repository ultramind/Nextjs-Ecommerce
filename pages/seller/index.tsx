import { useGetOrders } from "@api/orders/seller";
import { useGetSellerProducts } from "@api/product";
import { useGetBusinessAnalytics } from "@api/seller";
import getBusiness from "@api/services/getBusiness";
import { getSellerOrders } from "@api/services/getOrders";
import { getSellerProducts } from "@api/services/seller";
import { sellerBusinessState } from "@atoms/seller/business";
import ProductListing from "@components/products/ProductListing";
import { SummaryCard } from "@components/seller/SummaryCard";
import BarChart from "@components/seller/charts/BarChart";
import LineChart from "@components/seller/charts/LineChart";
import NewOrders from "@components/seller/tables/NewOrders";
import SellerLayout from "@layouts/SellerLayout";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import Link from "next/link";
import React from "react";
import { useRecoilValue } from "recoil";

function Dashboard() {
  const business = useRecoilValue(sellerBusinessState);

  const { data } = useGetSellerProducts("published", "", "");

  //orders
  const { data: orders } = useGetOrders("open", "", "");

  //analytics
  const { data: analytics } = useGetBusinessAnalytics();

  return (
    <SellerLayout>
      <section className="flex flex-col gap-5">
        <div className="mb-6 mt-8 lg:mt-0 pl-[1rem] md:pl-0">
          <p className="mb-2 text-sm text-ash">Hi, Seller</p>
          <h2 className="font-medium first-letter:uppercase">
            {business?.name}
          </h2>
        </div>

        <div className="h-auto px-[1rem] grid w-full gap-x-[0.95rem] gap-y-[1.20rem] grid-cols-2 xs:grid-cols-[200px, 4fr] md:grid-cols-4">
          {/* {finances.map((item, idx) => (
            <SummaryCard key={idx} title={item.title} amount={item.amount} />
          ))} */}
          <SummaryCard
            title="Wallet Balance"
            amount={analytics?.walletBalance || 0}
          />
          <SummaryCard
            title="Ledger Balance"
            amount={analytics?.ledgerBalance || 0}
          />
          <SummaryCard
            title="Total Orders"
            amount={analytics?.totalOrders || 0}
            subtitle="Open & Closed"
          />
          <SummaryCard
            title="Open Orders"
            amount={analytics?.openOrders || 0}
            subtitle="Orders"
          />
        </div>

        {/* CHARTS */}
        {/* min-h-[21.125rem] */}
        <div className="flex flex-wrap items-stretch justify-center h-auto gap-3 mt-12 lg:flex-nowrap md:flex-row">
          {/* min-h-[13.224rem] */}
          <div className="w-full h-fit lg:w-1/2 md:h-full lg:shadow-md rounded-lg p-4 md:px-[21px] md:py-[23px]">
            <LineChart title="Total Sales" />
          </div>
          {/* min-h-[13.224rem] */}
          <div className="w-full mt-1 h-fit lg:w-1/2  lg:shadow-md rounded-lg p-4 md:px-[21px] md:py-[23px]">
            <BarChart title="Best Sellers" />
          </div>
        </div>

        {/* New Orders */}
        <div className="mt-0 lg:mt-12 pl-[1rem]">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">New Orders</h2>
            <Link
              href="/seller/orders"
              className="hidden underline md:block text-tangerine"
            >
              View all
            </Link>
          </div>
          {orders?.data?.length > 0 ? (
            <NewOrders data={orders?.data || []} />
          ) : (
            <p className="mt-5 text-sm font-medium opacity-70">No new order</p>
          )}
        </div>

        <div className="mt-14 pl-[1rem]">
          <ProductListing
            title="Inventory"
            viewAllLink="/seller/products"
            data={data?.data || []}
            productState="published"
            owner
          />
        </div>
      </section>
    </SellerLayout>
  );
}

Dashboard.requireAuth = true;
export default Dashboard;

export const runtime = "experimental-edge";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies.access_token as string;
  const queryClient = new QueryClient();

  const business = await queryClient.fetchQuery(["getUserBusiness"], () =>
    getBusiness(token),
  );

  // console.log({ token });

  // console.log({ business });

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

  await queryClient.prefetchQuery(
    ["getSellerProducts", "published", "", ""],
    () => getSellerProducts(token, "published"),
  );

  await queryClient.prefetchQuery(["getSellerOrders", "open", "", ""], () =>
    getSellerOrders(token, "open"),
  );
  // }
  // if (business) {

  return { props: { dehydratedState: dehydrate(queryClient) } };
};
