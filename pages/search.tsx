import { useGetSearchForProducts } from "@api/product";
import Pagination from "@components/Common/Pagination";
import ProductListingWithCategoriesFilters from "@components/Common/ProductListingWithCategoriesFilters";
import SearchField from "@components/Common/SearchField";
import AppLayout from "@layouts/AppLayout";
import { useRouter } from "next/router";
import React from "react";

function Search() {
  const {
    query: { query, category },
  } = useRouter();

  const { data, isLoading } = useGetSearchForProducts(
    query as string,
    category as string,
  );

  return (
    <AppLayout>
      <span className="grid grid-cols-1 place-content-center w-full mt-[1.60rem] mb-[1.90rem] px-[0.95rem] lg:hidden">
        <SearchField
          style={{
            width: "100%",
          }}
          fromSearch
        />
      </span>
      <section className="px-[1.2rem] lg:px-[3.56rem] w-full min-h-screen">
        <div className="mb-[3.56rem]">
          <ProductListingWithCategoriesFilters
            loading={isLoading}
            products={data?.data || []}
            search={true}
          />
        </div>
        {!isLoading && data?.totalPages > 1 && (
          <div className="block mb-[3.79rem] w-fit mx-auto lg:mr-0 lg:ml-auto">
            <Pagination
              currentPage={data?.currentPage}
              totalPages={data?.totalPages}
            />
          </div>
        )}
      </section>
    </AppLayout>
  );
}

export default Search;
