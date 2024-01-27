import { useGetOrders } from "@api/orders/user";
import Pagination from "@components/Common/Pagination";
import ProductEmptyState from "@components/Common/ProductEmptyState";
import ProductFilter from "@components/Common/ProductFilter";
import SearchField from "@components/Common/SearchField";
import OrderCard from "@components/seller/OrderCard";
import { useRouter } from "next/router";
import React, { useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { OrderItem } from "types/order";

function Tabs() {
  const router = useRouter();
  const [displayedOrders, setDisplayedOrders] = useState<"open" | "closed">(
    "open",
  );

  const [filter, setFilter] = useState("");

  const { isLoading, data, isError } = useGetOrders(
    displayedOrders,
    router?.query?.search ? (router?.query?.search as string) : "",
    filter,
  );

  return (
    <div className="max-w-[1440px] lg:pr-[7.17rem]">
      <div className="flex items-end w-full lg:w-[21.88rem] max-w-full font-roboto font-medium mb-[2.37rem]">
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
      <section className="px-[0.95rem] lg:px-0 flex space-x-[0.95rem] items-center mb-[2.37rem]">
        <SearchField
          style={{
            width: "100%",
          }}
          fromOrder
          placeholder="Search by Order ID, Product name, Seller name"
          orderProps={{
            key: displayedOrders,
            sortBy: filter,
            fromUser: true,
          }}
        />
        <ProductFilter
          handleFilterSelect={(value) => setFilter(value)}
          currentFilter={filter}
          filters={["name", "price", "date"]}
        />
      </section>
      {/**tab panels */}
      <div className="px-[0.95rem] lg:px-0 mb-[8.89rem] lg:mb-0">
        <section>
          {!isLoading && data?.data?.length > 0 && (
            <div className="space-y-[1.90rem]">
              {/* ORDER CARDS */}
              {data?.data?.map((order: OrderItem) => (
                <OrderCard key={order?._id} data={order} seller={false} />
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
          <div className="block mt-[1.90rem] mb-[3.79rem] w-fit mx-auto lg:mr-0 lg:ml-auto">
            {!isLoading && data?.totalPages > 1 && (
              <Pagination
                currentPage={data?.currentPage}
                totalPages={data?.totalPages}
              />
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

export default Tabs;
