import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import Link from "next/link";
import React from "react";
import { IoIosArrowForward } from "react-icons/io";
import { ProductListingProps } from "types/index";
import ProductCard from "./ProductCard";

function ProductListing({
  title,
  data,
  viewAllLink,
  collapse,
  productState,
  fromNewArrival,
  owner,
}: ProductListingProps) {
  return (
    <>
      <span className="flex justify-between items-center w-full mb-[0.95rem] lg:mb-[1.90rem]">
        {!productState && (
          <h2 className="font-medium font-roboto text-t18 lg:text-t32">
            {title}
          </h2>
        )}
        {productState && (
          <h2 className="text-xl font-medium font-roboto">{title}</h2>
        )}
        {viewAllLink && data && data?.length > 0 && (
          <Link
            className={`${
              productState ? "block" : "hidden"
            } md:block text-tangerine text-product_sans text-t16 underline`}
            href={viewAllLink}
          >
            View all
          </Link>
        )}
      </span>
      {!collapse && (
        <div className="grid gap-x-[0.35rem] gap-y-[1rem] grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data?.map((item, idx) => (
            <ProductCard
              owner={owner}
              key={idx}
              item={item}
              productState={productState}
            />
          ))}
        </div>
      )}
      {data && data?.length === 0 && (
        <p className="text-sm font-medium opacity-70">
          {fromNewArrival ? "No new arrival" : "No product"}
        </p>
      )}
      {collapse && data && data?.length > 0 && (
        <Splide
          options={{
            // perPage: 5,
            // gap: 10,
            autoWidth: true,
            autoHeight: true,
            //   arrows: false,
            lazyLoad: true,
            pagination: false,
            drag: true,
            // wheel: true,
          }}
          aria-labelledby="products"
          hasTrack={false}
        >
          <div className="relative">
            <SplideTrack>
              {data?.map((item, idx) => (
                <SplideSlide key={idx} className="py-4 pl-2 min-h-fit">
                  <ProductCard item={item} productState={productState} />
                </SplideSlide>
              ))}
            </SplideTrack>
            <div className="splide__arrows">
              <button
                id="arrow__prev"
                className="splide__arrow splide__arrow--prev !h-[1.90rem] lg:!h-[3.32rem] !w-[1.90rem] lg:!w-[3.32rem] !rounded-xs !left-[-0.5rem] lg:!left-[-4rem] !bg-denim/10 !border !border-gainsboro"
              >
                <IoIosArrowForward className="text-denim_blue" />
              </button>
              <button
                id="arrow__next"
                className="splide__arrow splide__arrow--next !h-[1.90rem] lg:!h-[3.32rem] !w-[1.90rem] lg:!w-[3.32rem] !rounded-xs !right-[-0.5rem] lg:!right-[-4.5rem] !bg-denim/10 !border !border-gainsboro"
              >
                <IoIosArrowForward className="text-denim_blue" />
              </button>
            </div>
          </div>
        </Splide>
      )}
    </>
  );
}
export default ProductListing;
