import { useGetTopPickProducts } from "@api/product";
import ProductListingWithCategoriesFilters from "@components/Common/ProductListingWithCategoriesFilters";
import { useRouter } from "next/router";
import React from "react";

function TopPicks() {
  const {
    query: { category },
  } = useRouter();

  const { isLoading, data } = useGetTopPickProducts(category as string);
  return (
    <section className="px-[1.01rem] lg:pl-[7.29rem] lg:pr-[7.23rem] w-full mb-[1.78rem] lg:mb-[6.94rem]">
      <span className="flex justify-between items-center w-full mb-[0.95rem] lg:mb-[1.90rem]">
        <h2 className="font-medium font-roboto text-t18 lg:text-t32">
          Top Picks for you
        </h2>
        {/* <Link
      className="hidden md:block text-tangerine text-product_sans text-t16 underline"
      href="/shop?top_pick=true"
    >
      View all
    </Link> */}
      </span>
      <ProductListingWithCategoriesFilters
        products={data?.data || []}
        loading={isLoading}
        fromTopPick={true}
      />
    </section>
  );
}

export default TopPicks;
