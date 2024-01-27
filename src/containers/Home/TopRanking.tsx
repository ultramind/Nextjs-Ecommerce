import { useGetTopRankingProducts } from "@api/product";
import ProductListingSkeleton from "@components/Loaders/Skeleton/ProductListingSkeleton";
import ProductListing from "@components/products/ProductListing";
import React from "react";

function TopRanking() {
  const { isFetching, data } = useGetTopRankingProducts();
  return (
    <section className="px-[1.01rem] lg:pl-[7.29rem] lg:pr-[7.23rem] w-full mb-[1.90rem] lg:mb-[3.56rem]">
      {!isFetching ? (
        <ProductListing
          title="Top Ranking"
          viewAllLink={`/shop`}
          data={data?.data || []}
          collapse
        />
      ) : (
        isFetching && <ProductListingSkeleton title="Top Ranking" />
      )}
    </section>
  );
}

export default TopRanking;
