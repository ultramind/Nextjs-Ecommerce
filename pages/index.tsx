import { getOtherProducts } from "@api/services/getProducts";
import SearchField from "@components/Common/SearchField";
import AppLayout from "@layouts/AppLayout";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import React from "react";
import MarketingSlides from "src/containers/Home/MarketingSlides";
import NewArrivals from "src/containers/Home/NewArrivals";
import ShopByCategories from "src/containers/Home/ShopByCategories";
import TopPicks from "src/containers/Home/TopPicks";
import TopRanking from "src/containers/Home/TopRanking";

export default function Home() {
  return (
    <AppLayout>
      <MarketingSlides />
      <span className="grid grid-cols-1 place-content-center w-full mt-[1.60rem] mb-[1.90rem] px-[0.95rem] lg:hidden">
        <SearchField
          style={{
            width: "100%",
          }}
        />
      </span>
      <NewArrivals />
      <TopRanking />
      <ShopByCategories />
      <TopPicks />
    </AppLayout>
  );
}

// export const runtime = "experimental-edge";

export const getServerSideProps: GetServerSideProps = async () => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(["getNewArrivalsProducts"], () =>
    getOtherProducts({ newArrivals: true }),
  );

  await queryClient.prefetchQuery(["getTopRankingProducts"], () =>
    getOtherProducts({ topRanking: true }),
  );

  return { props: { dehydratedState: dehydrate(queryClient) } };
};
