import { getOrders } from "@api/services/getOrders";
import Tabs from "@components/Orders/Tabs";
import DashboardLayout from "@layouts/DashboardLayout";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import React from "react";

function Index() {
  return (
    <DashboardLayout>
      <section className="pt-[1.72rem] lg:pt-0">
        <h1 className="pl-[0.83rem] lg:pl-0 block text-black font-roboto text-t20 lg:text-t24 font-medium mb-[1.90rem] lg:mb-[3rem]">
          My Orders
        </h1>
        <Tabs />
      </section>
    </DashboardLayout>
  );
}

Index.requireAuth = true;
export default Index;

export const runtime = "experimental-edge";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies.access_token as string;
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["getUserOrders", "open", "", "", 1], () =>
    getOrders(token, "open"),
  );

  await queryClient.prefetchQuery(["getUserOrders", "closed", "", "", 1], () =>
    getOrders(token, "closed"),
  );

  return { props: { dehydratedState: dehydrate(queryClient) } };
};
