import React, { useState } from "react";

import { PrimaryButton } from "@components/Common/Buttons";
import SearchField from "@components/Common/SearchField";
import Select from "@components/Common/Select";
import ProductListing from "@components/products/ProductListing";
import SellerLayout from "@layouts/SellerLayout";
import { Form, Formik } from "formik";

import { useGetSellerProducts } from "@api/product";
import getBusiness from "@api/services/getBusiness";
import { getSellerProducts } from "@api/services/seller";
import { productTypeState } from "@atoms/productTypeState";
import { sellerBusinessState } from "@atoms/seller/business";
import Pagination from "@components/Common/Pagination";
import ProductEmptyState from "@components/Common/ProductEmptyState";
import ProductFilter from "@components/Common/ProductFilter";
import ProductCardSkeleton from "@components/Loaders/Skeleton/ProductCardSkeleton";
import useDisclosure from "@hooks/useDisclosure";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { AiOutlinePlus } from "react-icons/ai";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { selectProductTypeSchema } from "src/schemas/sellerDashboard";

function Products() {
  const business = useRecoilValue(sellerBusinessState);
  const router = useRouter();
  const { toggleModal, isOpen: modalShown, modalRef } = useDisclosure();

  const [filter, setFilter] = useState("");

  // STATES
  const [displayedProducts, setDisplayedProducts] = useState<
    "published" | "draft"
  >("published");

  const { data, isLoading } = useGetSellerProducts(
    displayedProducts,
    router?.query?.search ? (router?.query?.search as string) : "",
    filter,
  );

  const productType = useRecoilValue(productTypeState);
  const setProductType = useSetRecoilState(productTypeState);

  return (
    <SellerLayout>
      <section className="flex flex-col gap-5">
        <section className="hidden lg:block pl-[0.95rem] md:pl-0">
          <p className="mb-2 text-sm text-ash">Hi, Seller</p>
          <h2 className="font-medium first-letter:uppercase">
            {business?.name}
          </h2>
        </section>
        {/* ACTIVE AND DRAFT SECTION */}
        <section className="flex items-center justify-between w-full mt-8 lg:mt-0">
          <div className="flex items-center w-full pr-6 border-b gap-x-5 md:w-fit">
            <button
              type="button"
              onClick={() => setDisplayedProducts("published")}
              className={`${
                displayedProducts == "published"
                  ? "text-tangerine border-b-tangerine"
                  : "text-spanish_gray border-b-transparent"
              } max-md:w-full border-b-2 pr-1 transition duration-500 whitespace-nowrap`}
            >
              Active Products
            </button>
            <button
              type="button"
              onClick={() => setDisplayedProducts("draft")}
              className={`${
                displayedProducts == "draft"
                  ? "text-tangerine border-b-tangerine"
                  : "text-spanish_gray border-b-transparent"
              } max-md:w-full border-b-2 px-1 transition duration-500 whitespace-nowrap`}
            >
              Draft Products
            </button>
          </div>
          <div className="hidden md:block min-w-[11.44rem]">
            <PrimaryButton
              text="Create New Product"
              type="button"
              disabled={business?.adminAction === "pending"}
              onClick={toggleModal}
            />
          </div>
        </section>
        {/* SEARCH SECTION */}
        <section className="flex gap-3 mt-2 lg:mt-0 items-center pl-[0.95rem] pr-[1.11rem] md:pl-0">
          <div className="flex-1">
            <SearchField
              style={{
                width: "100%",
              }}
              fromSeller
              sellerProps={{
                key: displayedProducts,
                sortBy: filter,
              }}
            />
          </div>
          {/* <button className="hidden md:block border px-4 py-[0.78rem] cursor-pointer border-tangerine rounded-md">
            <BsFilter className="text-2xl text-tangerine" />
          </button> */}
          <ProductFilter
            handleFilterSelect={(value) => setFilter(value)}
            currentFilter={filter}
            filters={["name", "price", "date", "currency"]}
          />
          <div className="text-white rounded-lg bg-tangerine md:hidden">
            <button
              onClick={toggleModal}
              className="flex items-center justify-center w-8 h-8 font-medium rounded-lg"
            >
              <AiOutlinePlus />
            </button>
          </div>
        </section>
        {/* PRODUCT LISTING */}

        <section className="pl-[0.95rem] pr-[1.11rem] md:pl-0">
          <div className="mb-[3.56rem]">
            {isLoading && (
              <div className="grid gap-x-[1.5rem] gap-y-[1.90rem] grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array(10)
                  .fill("")
                  .map((item, index) => (
                    <ProductCardSkeleton key={index} />
                  ))}
              </div>
            )}
            {!isLoading && data?.data?.length > 0 ? (
              <ProductListing
                owner={true}
                data={data?.data || []}
                productState={displayedProducts}
              />
            ) : (
              !isLoading && (
                <ProductEmptyState
                  text={`No ${displayedProducts} product`}
                  fromSeller={true}
                />
              )
            )}
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
      </section>
      {/* ADD NEW PRODUCT MODAL */}
      {modalShown && (
        <div className="fixed top-0 left-0 w-full h-screen bg-black/30 z-[60] flex justify-center items-center">
          <div
            ref={modalRef}
            className="w-full flex flex-col gap-y-[2rem] max-w-[34.75rem] bg-white rounded-md mx-4 p-3 md:px-14 md:py-[3.38rem]"
          >
            <h2 className="text-2xl font-medium text-center font-roboto">
              Create a new Product
            </h2>
            <Formik
              initialValues={{
                product_type: productType,
              }}
              validationSchema={selectProductTypeSchema}
              onSubmit={(values, { setSubmitting }) => {
                setProductType(values.product_type);
                setSubmitting(false);
                router.push("/seller/products/create-product");
              }}
            >
              {({ setFieldValue, values }) => (
                <Form>
                  <Select
                    name="product_type"
                    value={values.product_type}
                    placeholder="Select Product Type"
                    classNameContainer="block font-product_sans font-normal text-t14 mb-4"
                    className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                    options={["Physical", "Virtual"]}
                    onChange={(value) => setFieldValue("product_type", value)}
                  />
                  <div className="mt-[2rem]">
                    <PrimaryButton
                      // disabled={isLoading}
                      text={"Continue"}
                      type="submit"
                    />
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </div>
      )}
    </SellerLayout>
  );
}

Products.requireAuth = true;
export default Products;

export const runtime = "experimental-edge";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies.access_token as string;
  const queryClient = new QueryClient();

  const business = await getBusiness(token);

  // if (!business) {
  //   queryClient.invalidateQueries(["getUserBusiness"]);
  //   return {
  //     redirect: {
  //       destination: "/",
  //       permanent: false,
  //     },
  //   };
  // }

  if (business?.adminAction === "pending") {
    return {
      redirect: {
        destination: "/unverified",
        permanent: false,
      },
    };
  }

  if (business?.adminAction === "disapproved") {
    return {
      redirect: {
        destination: "/blocked",
        permanent: false,
      },
    };
  }

  await queryClient.prefetchQuery(
    ["getSellerProducts", "published", "", "", 1],
    () => getSellerProducts(token, "published"),
  );

  await queryClient.prefetchQuery(
    ["getSellerProducts", "draft", "", "", 1],
    () => getSellerProducts(token, "draft"),
  );
  // if (business) {
  // }

  return { props: { dehydratedState: dehydrate(queryClient) } };
};
