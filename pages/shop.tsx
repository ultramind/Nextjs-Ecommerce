import { useGetAllProducts } from "@api/product";
import getProducts from "@api/services/getProducts";
import Pagination from "@components/Common/Pagination";
import ProductListingWithCategoriesFilters from "@components/Common/ProductListingWithCategoriesFilters";
import SearchField from "@components/Common/SearchField";
import AppLayout from "@layouts/AppLayout";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import React from "react";

function Shop() {
  const {
    query: { category },
  } = useRouter();

  // const [filters, setFilters] = useState({});

  const { data, isLoading } = useGetAllProducts(
    category ? (category as string) : "",
  );

  return (
    <AppLayout>
      <span className="grid grid-cols-1 place-content-center w-full mt-[1.60rem] mb-[1.90rem] px-[0.95rem] lg:hidden">
        <SearchField
          style={{
            width: "100%",
          }}
        />
      </span>
      <section className="px-[1.2rem] lg:px-[3.56rem] w-full mb-[1.78rem]">
        <div className="mb-[3.56rem]">
          <ProductListingWithCategoriesFilters
            loading={isLoading}
            products={data?.data || []}
            shop={true}
          />
        </div>
        {data?.totalPages > 1 && !isLoading && (
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

export default Shop;

// export const runtime = "experimental-edge";

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery(
    ["getAllProducts", "", Number(query?.page) || 1, {}],
    () =>
      getProducts(
        query?.category ? (query?.category as string) : "",
        Number(query?.page) || 1,
      ),
  );

  return { props: { dehydratedState: dehydrate(queryClient) } };
};
