import { useGetActiveCategories } from "@api/category";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { HiOutlineArrowUpRight } from "react-icons/hi2";

function ShopByCategories() {
  const { data, isFetching } = useGetActiveCategories();

  return (
    <>
      {!isFetching && data?.length > 0 && (
        <section className="px-[1.01rem] lg:pl-[7.29rem] lg:pr-[7.23rem] w-full mb-[1.90rem] lg:mb-[3.56rem]">
          <span className="flex justify-between items-center w-full mb-[0.95rem] lg:mb-[1.90rem]">
            <h2 className="font-medium font-roboto text-t18 lg:text-t32">
              Shop by Category
            </h2>
            <Link
              className="hidden underline md:block text-tangerine text-product_sans text-t16"
              href="/shop"
            >
              View all
            </Link>
          </span>
          <div className="flex flex-col lg:flex-row lg:h-[34.68rem] text-white">
            {data[0] && (
              <div className="relative h-[15.00rem] lg:h-full w-full">
                <Image
                  src={data[0]?.productImage}
                  alt={data[0]?.subCategory}
                  fill
                  className="object-cover object-center"
                  loading="lazy"
                  sizes="(max-width: 808px) 40vw,
                50vw"
                />
                <span className="flex items-center justify-between py-[1.07rem] px-[1.96rem] w-full h-[3.79rem] bg-tangerine absolute bottom-0 left-0">
                  <h4 className="font-medium first-letter:capitalize font-roboto text-t14 lg:text-t24">
                    {data[0]?.subCategory?.toLowerCase() === "uncategorized"
                      ? data[0]?.category
                      : data[0]?.subCategory}
                  </h4>
                  <Link
                    href={`/shop?category=${data[0]?.category}`}
                    className="flex items-center space-x-[0.71rem]"
                    title="Shop from category"
                  >
                    <span className="text-t12 lg:text-t14 font-product_sans">
                      Shop from category
                    </span>
                    <HiOutlineArrowUpRight />
                  </Link>
                </span>
              </div>
            )}
            {data?.length > 1 && (
              <div className="flex w-full h-[15.00rem] lg:h-full flex-row lg:flex-col space-x-[0.23px] lg:space-x-0">
                {data[1] && (
                  <div className="relative flex-1 w-full h-full">
                    <Image
                      src={data[1]?.productImage}
                      alt={data[1]?.subCategory}
                      fill
                      className="object-cover object-center"
                      loading="lazy"
                      sizes="
            (max-width: 808px) 25vw,
            50vw"
                    />

                    <span className="flex items-center space-x-3 justify-between py-[1.07rem] px-[1.96rem] w-full h-[3.79rem] bg-tangerine absolute bottom-0 left-0">
                      <h4 className="font-medium first-letter:capitalize font-roboto text-t14 lg:text-t24">
                        {data[1]?.subCategory?.toLowerCase() === "uncategorized"
                          ? data[1]?.category
                          : data[1]?.subCategory}
                      </h4>
                      <Link
                        href={`/shop?category=${data[1]?.category}`}
                        className="flex items-center space-x-[0.71rem]"
                        title="Shop from category"
                      >
                        <span className="hidden md:block text-t12 lg:text-t14 font-product_sans">
                          Shop from category
                        </span>
                        <HiOutlineArrowUpRight />
                      </Link>
                    </span>
                  </div>
                )}
                {data[2] && (
                  <div className="relative flex-1 w-full h-full">
                    <Image
                      src={data[2]?.productImage}
                      alt={data[2]?.subCategory}
                      fill
                      className="object-cover object-center"
                      loading="lazy"
                      sizes="
            (max-width: 808px) 25vw,
            50vw"
                    />
                    <span className="flex items-center justify-between space-x-3 py-[1.07rem] px-[1.96rem] w-full h-[3.79rem] bg-tangerine absolute bottom-0 left-0">
                      <h4 className="font-medium first-letter:capitalize font-roboto text-t14 lg:text-t24">
                        {data[2]?.subCategory?.toLowerCase() === "uncategorized"
                          ? data[2]?.category
                          : data[2]?.subCategory}
                      </h4>
                      <Link
                        href={`/shop?category=${data[2]?.category}`}
                        className="flex items-center space-x-[0.71rem]"
                        title="Shop from category"
                      >
                        <span className="hidden md:block text-t12 lg:text-t14 font-product_sans">
                          Shop from category
                        </span>
                        <HiOutlineArrowUpRight />
                      </Link>
                    </span>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}

export default ShopByCategories;
