import { useCalculatePrice } from "@hooks/useCalculatePrice";
import Link from "next/link";
import React from "react";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { NewOrdersProps } from "types/index";

function NewOrders({ data }: NewOrdersProps) {
  const { calculatePrice } = useCalculatePrice();
  return (
    <>
      <table className="hidden w-full mt-4 text-left md:table">
        <thead className="text-white bg-denim_blue">
          <tr>
            <th scope="col" className="px-6 py-3">
              Customer Name
            </th>
            <th scope="col" className="px-6 py-3">
              Product
            </th>
            <th scope="col" className="px-6 py-3">
              Price(NGN)
            </th>
            <th scope="col" className="px-6 py-3">
              Status
            </th>
            <th scope="col" className="px-6 py-3">
              Order Date
            </th>
            <th align="center">|</th>
          </tr>
        </thead>
        <tbody>
          {data.map((order, idx) => {
            const statusStyle =
              order?.status == "pending"
                ? "bg-tangerine/20 text-tangerine"
                : "bg-apple_green/10 text-apple_green";
            return (
              <tr
                className={`${
                  idx % 2 === 0 ? "bg-white" : "bg-denim_blue/5"
                } text-[#6A6666]`}
                key={idx}
              >
                <td className="px-6 py-3">{order?.buyer?.buyerName}</td>
                <td className="px-6 py-3 line-clamp-1">
                  {order?.product?.productName}
                </td>
                <td className="px-6 py-3">
                  {calculatePrice(
                    order?.product?.currency,
                    order?.product?.sellerPrice,
                  )}
                </td>
                <td className={`px-6 py-3 capitalize`}>
                  <span
                    className={` ${statusStyle} text-xs rounded-lg px-5 py-2 capitalize`}
                  >
                    {order?.status}
                  </span>
                </td>
                <td className="px-6 py-3">
                  {new Date(order?.createdAt).toDateString()}
                </td>
                <td>
                  <div className="flex-shrink px-1 cursor-pointer">
                    <Link href={`/seller/orders/${order?._id}`}>
                      <MdOutlineKeyboardArrowRight
                        className="text-tangerine"
                        size={20}
                      />
                    </Link>
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div className="flex flex-col md:hidden">
        {data.map((order, idx) => (
          <div
            key={idx}
            className="flex items-center py-3 border-b font-product_sans"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1 text-sm">
                <p className="font-medium line-clamp-1">
                  {order?.product?.productName}
                </p>
                <p className="">
                  {calculatePrice(
                    order?.product?.currency,
                    order?.product?.sellerPrice,
                  )}
                </p>
              </div>
              <div className="flex justify-between text-[10px] items-center text-ash">
                <p className="">{order?.buyer?.buyerName}</p>
                <p className="">{new Date(order?.createdAt).toDateString()}</p>
              </div>
            </div>
            <div className="flex-shrink px-1">
              <Link href={`/seller/orders/${order?._id}`}>
                <MdOutlineKeyboardArrowRight
                  className="text-tangerine"
                  size={20}
                />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export default NewOrders;
