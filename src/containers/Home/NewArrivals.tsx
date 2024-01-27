import { useGetNewArrivalsProducts } from "@api/product";
import ProductListingSkeleton from "@components/Loaders/Skeleton/ProductListingSkeleton";
import ProductListing from "@components/products/ProductListing";
import React from "react";

function NewArrivals() {
  const { isFetching, data } = useGetNewArrivalsProducts();
  return (
    <section className="px-[1.01rem] lg:pl-[7.29rem] lg:pr-[7.23rem] lg:mt-[3.56rem] w-full mb-[1.90rem] lg:mb-[3.56rem]">
      {!isFetching ? (
        <ProductListing
          title="New Arrivals"
          viewAllLink={`/shop`}
          fromNewArrival={true}
          data={data?.data || []}
          collapse
        />
      ) : (
        isFetching && <ProductListingSkeleton title="New Arrivals" />
      )}
    </section>
  );
}

export default NewArrivals;
