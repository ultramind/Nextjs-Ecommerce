import ProductCardSkeleton from "@components/Loaders/Skeleton/ProductCardSkeleton";
import ProductCard from "@components/products/ProductCard";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { AiOutlineClose } from "react-icons/ai";
import { BiLoaderAlt } from "react-icons/bi";
import { BsFilterRight } from "react-icons/bs";
import { ProductProps } from "types/product";
import Categories from "./Categories";
import Filters from "./Filters";
import ProductEmptyState from "./ProductEmptyState";

interface Props {
  search: boolean;
  shop?: boolean;
  products?: ProductProps[];
  loading?: boolean;
  fromTopPick?: boolean;
}

function ProductListingWithCategoriesFilters({
  search,
  products,
  shop,
  loading,
  fromTopPick,
}: Partial<Props>) {
  const {
    query: { query, category },
  } = useRouter();
  const [showFilter, setShowFilter] = useState(false);
  return (
    <div
      className={`relative lg:grid ${
        search || shop
          ? "lg:grid-cols-[12.5rem,1fr]"
          : "lg:grid-cols-[11rem,1fr]"
      } 2xl:grid-cols-[14rem,1fr] lg:gap-[1.90rem]`}
    >
      <button
        onClick={() => setShowFilter(true)}
        className="flex items-center border text-spanish hover:text-black transition-colors duration-100 border-tangerine rounded-md w-fit mb-[1rem] p-2 text-t14 space-x-1 lg:hidden"
      >
        <BsFilterRight />
        <span>Filter</span>
      </button>
      <div
        className={`max-w-full ${
          showFilter ? "translate-x-0" : "translate-x-[100%]"
        } transition-transform duration-200 lg:translate-x-0 fixed min-h-screen w-full lg:relative top-0 left-0 bg-white z-50 lg:z-0 px-[1rem] pt-[2rem] lg:pt-0 lg:px-0 lg:block space-y-[1.90rem] ${
          search || shop ? "border-r lg:pr-[1rem] lg:py-[2.96rem]" : ""
        }`}
      >
        <AiOutlineClose
          onClick={() => setShowFilter(false)}
          className="absolute w-5 h-5 cursor-pointer lg:hidden top-4 right-6"
        />
        <Categories fromTopPick={fromTopPick} fromSearch={search} />
        <Filters />
      </div>

      <div
        className={`pb-[1.78rem] ${search || shop ? "lg:pt-[2.96rem]" : ""}`}
      >
        {search && (
          <span className="flex items-center space-x-2 mb-[1.90rem] lg:mb-[2.25rem]">
            {loading && (
              <BiLoaderAlt className="text-tangerine w-[1rem] h-[1rem] animate-spin" />
            )}
            <h3 className="font-medium text-black text-t24 font-roboto">
              Showing Results for &apos;
              <span className="capitalize first-letter:">{query}</span>&apos;
            </h3>
          </span>
        )}
        {shop && category && (
          <span className="flex items-center space-x-2 mb-[1.90rem] lg:mb-[2.25rem]">
            {loading && (
              <BiLoaderAlt className="text-tangerine w-[1rem] h-[1rem] animate-spin" />
            )}
            <h3 className="font-medium text-black text-t24 first-letter:capitalize font-roboto">
              {typeof category === "string" && category?.replace("_", " ")}
            </h3>
          </span>
        )}
        {!loading && products ? (
          <div
            className={`grid gap-x-[0.35rem] place-content-center gap-y-[1rem] grid-cols-2 sm:grid-cols-[repeat(auto-fill,minmax(12rem,1fr))]`}
          >
            {products?.length > 0 &&
              products.map((product) => (
                <ProductCard
                  key={product._id}
                  item={product}
                  className="w-full md:w-[13rem] max-w-full"
                />
              ))}
          </div>
        ) : (
          loading && (
            <div className="grid gap-x-[0.75rem] place-content-center gap-y-[1rem] grid-cols-2  sm:grid-cols-[repeat(auto-fill,minmax(12rem,1fr))]">
              {Array(20)
                .fill("")
                .map((item, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
            </div>
          )
        )}
        {((!loading && products?.length === 0) || query === "") && (
          <ProductEmptyState
            className="max-w-[22rem] mx-auto my-[9.43rem]"
            fromTopPick={fromTopPick}
            shop={shop}
            text={
              search
                ? `There are currently no product for ‘${query}’`
                : `There are currently no products${
                    category !== "" && category !== undefined
                      ? ` under ${category}`
                      : ""
                  }`
            }
          />
        )}
      </div>
    </div>
  );
}

export default ProductListingWithCategoriesFilters;
