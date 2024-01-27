import { useGetUserDownloads } from "@api/user";
import Pagination from "@components/Common/Pagination";
import ProductEmptyState from "@components/Common/ProductEmptyState";
import SearchField from "@components/Common/SearchField";
import DownloadCard from "@components/Downloads/DownloadCard";

import DashboardLayout from "@layouts/DashboardLayout";
import React from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { DownloadCardProps } from "types/user";

function Downloads() {
  const { data, isError, isLoading } = useGetUserDownloads();

  return (
    <DashboardLayout>
      <span className="grid grid-cols-1 place-content-center w-full mt-[1.60rem] mb-[1.90rem] px-[0.95rem] lg:hidden">
        <SearchField
          style={{
            width: "100%",
          }}
        />
      </span>
      <section className="px-[0.71rem] lg:pl-0 max-w-[60.71rem] lg:pr-[7.35rem]">
        <h1 className="text-black font-roboto text-t24 font-medium mb-[0.95rem] lg:mb-[2rem]">
          Downloads
        </h1>
        {isLoading && (
          <BiLoaderAlt className="w-5 h-5 m-auto mt-8 lg:w-8 lg:h-8 animate-spin text-tangerine" />
        )}
        {(isError || data?.data?.length === 0 || !data?.data) && !isLoading && (
          <ProductEmptyState
            className="max-w-[22rem] mx-auto mt-[2.37rem] mb-[16.84rem]"
            text={"You’ve not added any products to downloads yet"}
          />
        )}
        {Array.isArray(data?.data) && data?.data?.length > 0 && (
          <div className="p-[0.47rem] grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-[1.90rem] gap-y-[2.37rem] mb-[2.37rem]">
            {data?.data?.map((item: DownloadCardProps) => (
              <DownloadCard key={item?.productId} data={item} />
            ))}
          </div>
        )}
        {data?.totalPages > 1 && (
          <div className="block mb-[3.79rem] w-fit mx-auto lg:mr-0 lg:ml-auto">
            <Pagination
              currentPage={data?.currentPage}
              totalPages={data?.totalPages}
            />
          </div>
        )}
      </section>
    </DashboardLayout>
  );
}

Downloads.requireAuth = true;
export default Downloads;
