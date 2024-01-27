import { useCalculatePrice } from "@hooks/useCalculatePrice";
import moment from "moment";
import React from "react";
import { HiOutlineArrowUpRight } from "react-icons/hi2";
import { TransactionProps } from "types/transaction";

function TransactionHistory({ data }: { data: TransactionProps[] }) {
  const { calculatePrice } = useCalculatePrice();
  return (
    <div className="w-full mr-0 overflow-x-scroll no-scrollbar">
      <>
        <table className="hidden w-full mt-5 overflow-hidden break-words border-separate table-fixed md:table border-spacing-y-3">
          <thead className="text-white bg-denim_blue ">
            <tr className="w-full">
              <th
                align="left"
                scope="col"
                className="py-3 pl-4 font-medium text-t16 font-roboto"
              >
                Name
              </th>
              <th
                align="left"
                scope="col"
                className="py-3 pl-6 font-medium text-t16 font-roboto"
              >
                Type
              </th>
              <th
                align="left"
                scope="col"
                className="flex-grow py-3 pl-6 font-medium text-t16 font-roboto"
              >
                Date/Time
              </th>
              <th
                align="left"
                scope="col"
                className="py-3 pl-6 font-medium text-t16 font-roboto"
              >
                Amount
              </th>
              <th
                align="left"
                scope="col"
                className="py-3 pl-6 font-medium text-t16 font-roboto"
              >
                Bank Info
              </th>
              <th
                align="left"
                scope="col"
                className="py-3 pl-6 font-medium text-t16 font-roboto"
              >
                Status
              </th>
              {/* <th className="w-[40px]">-</th> */}
            </tr>
          </thead>
          <tbody>
            {data.map((item, idx) => {
              const statusStyle =
                item?.state == "pending"
                  ? "bg-tangerine/20 text-tangerine"
                  : "bg-apple_green/10 text-apple_green";
              return (
                <tr
                  key={idx}
                  className={`${
                    idx % 2 === 0 ? "bg-white" : "bg-denim_blue/5"
                  } text-spanish_gray mb-28 w-full`}
                >
                  <td className="py-4 pl-4 text-left text-t16">
                    {item?.bankInfo?.accountName || "-"}
                  </td>
                  <td className="py-4 pl-6 text-left capitalize text-tangerine text-t16">
                    {item?.type}
                    <span>
                      <HiOutlineArrowUpRight className="inline-block mb-1 ml-2 text-sm " />
                    </span>
                  </td>
                  <td className="py-4 pl-6 text-left text-t16">
                    {moment(item?.createdAt).format("lll")}
                  </td>
                  <td className="py-4 pl-6 text-left text-t16">
                    {calculatePrice(item?.currency || "NGN", item?.amount)}
                  </td>
                  <td className="py-4 pl-6 text-left text-t16">
                    {item?.bankInfo?.name || "Sales"}
                  </td>
                  <td className="py-4 pl-6 text-left text-t16">
                    <span
                      className={` ${statusStyle} text-xs rounded-lg px-5 py-2 capitalize`}
                    >
                      {item?.state}
                    </span>
                  </td>
                  {/* <td className="">
                    <div className="flex-shrink px-1 cursor-pointer">
                      <MdOutlineKeyboardArrowRight className="" size={20} />
                    </div>
                  </td> */}
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className="flex flex-col pb-10 space-y-4 md:hidden mt-7">
          {data.map((item, idx) => (
            <div
              key={idx}
              className="flex border-b items-left font-product_sans"
            >
              <div className="flex-1">
                <div className="flex justify-between text-sm items-left text-[#333333] mb-1">
                  <p className="capitalize line-clamp-1">{item?.type}</p>
                  <p className="">
                    {calculatePrice(item?.currency || "NGN", item?.amount)}
                  </p>
                </div>
                <div className="flex justify-between text-[10px] items-left mb-2 text-ash">
                  <p className="">{item?.bankInfo?.accountName || "Sales"}</p>
                  <p className="">{moment(item?.createdAt).format("lll")}</p>
                </div>
              </div>
              {/* <div className="flex-shrink px-1">
                <MdOutlineKeyboardArrowRight
                  className="text-tangerine"
                  size={20}
                />
              </div> */}
            </div>
          ))}
        </div>
      </>
    </div>
  );
}

export default TransactionHistory;
