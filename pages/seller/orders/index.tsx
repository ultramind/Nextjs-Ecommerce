import { productTypeState } from "@atoms/productTypeState";
import { PrimaryButton } from "@components/Common/Buttons";
import Pagination from "@components/Common/Pagination";
import SearchField from "@components/Common/SearchField";
import useDisclosure from "@hooks/useDisclosure";
import SellerLayout from "@layouts/SellerLayout";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";

import OrderCard from "@components/seller/OrderCard";
import { Form, Formik } from "formik";
import { AiOutlinePlus } from "react-icons/ai";

import { useGetOrders } from "@api/orders/seller";
import getBusiness from "@api/services/getBusiness";
import { getSellerOrders } from "@api/services/getOrders";
import { sellerBusinessState } from "@atoms/seller/business";
import ProductEmptyState from "@components/Common/ProductEmptyState";
import ProductFilter from "@components/Common/ProductFilter";
import Select from "@components/Common/Select";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import { BiLoaderAlt } from "react-icons/bi";
import { selectProductTypeSchema } from "src/schemas/sellerDashboard";
import { OrderItem } from "types/order";

function Orders() {
  const router = useRouter();
  const { toggleModal, isOpen: modalShown, modalRef } = useDisclosure();
  const business = useRecoilValue(sellerBusinessState);

  const [filter, setFilter] = useState("");

  // STATES
  const [displayedOrders, setDisplayedOrders] = useState<"open" | "closed">(
    "open",
  );
  const { isLoading, data, isError } = useGetOrders(
    displayedOrders,
    router?.query?.search ? (router?.query?.search as string) : "",
    filter,
  );

  const productType = useRecoilValue(productTypeState);
  const setProductType = useSetRecoilState(productTypeState);
  return (
    <SellerLayout>
      <section className="flex flex-col w-full gap-y-5">
        <div className="hidden lg:block mb-6 pl-[0.95rem] md:pl-0">
          <p className="mb-2 text-sm text-ash">Hi, {business?.name}</p>
          <h2 className="font-medium">Orders</h2>
        </div>
        {/* ACTIVE AND PENDING SECTION */}
        <section className="flex items-center justify-between w-full mt-8 lg:mt-0">
          <div className="flex items-end w-full lg:w-[21.88rem] max-w-full font-roboto font-medium">
            <button
              type="button"
              onClick={() => setDisplayedOrders("open")}
              className={`${
                displayedOrders == "open"
                  ? "text-tangerine border-b-tangerine"
                  : "text-spanish_gray border-cultured"
              } max-md:w-full border-b-[1.5px] pb-1 transition duration-700`}
            >
              Open Orders
            </button>
            <span className="block w-[2.37rem] border-b-[1.5px] border-cultured"></span>
            <button
              type="button"
              onClick={() => setDisplayedOrders("closed")}
              className={`${
                displayedOrders == "closed"
                  ? "text-tangerine border-b-tangerine"
                  : "text-spanish_gray border-cultured"
              } max-md:w-full border-b-[1.5px] pb-1 transition duration-500`}
            >
              Closed Orders
            </button>
            <span className="hidden lg:block w-[2.37rem] border-b-[1.5px] border-cultured"></span>
          </div>
          <div className="hidden md:block min-w-[11.44rem]">
            <PrimaryButton
              text="Create New Product"
              type="button"
              onClick={toggleModal}
              disabled={business?.adminAction === "pending"}
            />
          </div>
        </section>
        {/* SEARCH SECTION */}
        <section className="flex gap-3 pl-[0.95rem] pr-[1.11rem] mt-2 md:mt-0 items-center">
          <SearchField
            style={{
              width: "100%",
            }}
            placeholder="Search by Order ID, Product name, Seller name"
            fromOrder
            orderProps={{
              key: displayedOrders,
              sortBy: filter,
              fromUser: false,
            }}
          />
          <ProductFilter
            handleFilterSelect={(value) => setFilter(value)}
            currentFilter={filter}
            filters={["name", "price", "date"]}
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

        <section className="px-[0.95rem] lg:px-0">
          {!isLoading && data?.data?.length > 0 && (
            <div className="space-y-[1.90rem]">
              {/* ORDER CARDS */}
              {data?.data?.map((order: OrderItem) => (
                <OrderCard key={order?._id} data={order} seller={true} />
              ))}
            </div>
          )}
          {isLoading && (
            <BiLoaderAlt className="w-5 h-5 m-auto mt-8 lg:w-8 lg:h-8 animate-spin text-tangerine" />
          )}
          {((!isLoading && (data?.data?.length === 0 || !data?.data)) ||
            isError) && (
            <ProductEmptyState
              className="max-w-[22rem] mx-auto mt-[2.37rem] mb-[16.84rem]"
              text={`You don't have any ${displayedOrders} orders`}
            />
          )}
          {!isLoading && data?.totalPages > 1 && (
            <div className="block mt-[1.90rem] mb-[3.79rem] w-fit mx-auto lg:mr-0 lg:ml-auto">
              <Pagination
                currentPage={data?.currentPage}
                totalPages={data?.totalPages}
              />
            </div>
          )}
        </section>
      </section>

      {modalShown && (
        <div className="fixed top-0 left-0 z-40 flex items-center justify-center w-full h-screen bg-black/30">
          <div
            ref={modalRef}
            className="w-full flex flex-col gap-y-[2rem] max-w-[34.75rem] bg-white rounded-md px-14 py-[3.38rem]"
          >
            <h2 className="text-2xl text-center">Create a new Product</h2>
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

Orders.requireAuth = true;
export default Orders;
export const runtime = "experimental-edge";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies.access_token as string;
  const queryClient = new QueryClient();
  
  const business = await queryClient.fetchQuery(["getUserBusiness"], () =>
    getBusiness(token),
  );

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

  await queryClient.prefetchQuery(["getSellerOrders", "open", "", "", 1], () =>
    getSellerOrders(token, "open"),
  );

  await queryClient.prefetchQuery(
    ["getSellerOrders", "closed", "", "", 1],
    () => getSellerOrders(token, "closed"),
  );

  return { props: { dehydratedState: dehydrate(queryClient) } };
};
