import React from "react";

function OrderCardSkeleton() {
  return (
    <div className="flex min-h-[9.31rem] lg:min-h-[12.21rem] flex-col lg:py-[1.42rem] lg:px-[2.25rem] lg:rounded-[1.42rem] lg:shadow-card md:gap-y-4">
      <div className="mb-[0.47rem] flex w-full justify-between items-center font-product_sans">
        <div className="flex text-[10px] md:text-t12 items-center">
          <span className="py-1 md:py-2 px-4 rounded-xs"></span>

          <span className="flex items-center py-2 px-4"></span>
        </div>
        <span className="text-spanish text-t12 md:text-t12"></span>
      </div>
      <div className="flex mb-[0.47rem]">
        <div className="relative h-[3.50rem] w-[5.22rem] md:h-[3.97rem] md:w-[5.75rem]"></div>
        <div className="flex-1">
          <div className="w-full md:mb-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-2">
              <span className="text-t14 mb-2 font-product_sans md:text-t16"></span>
              <span className="text-t18 md:text-t20 font-medium font-roboto"></span>
            </div>
            <div className="hidden md:flex justify-between items-center text-t14 font-product_sans">
              <div className="flex gap-x-6">
                <p className=" px-2 py-1 rounded-lg bg-tangerine/20 text-tangerine">
                  Size:
                </p>
                <p className=" px-2 py-1 rounded-lg bg-tangerine/20 text-tangerine">
                  Quantity:
                </p>
                <p className=" px-2 py-1 rounded-lg bg-black text-white">
                  Color:
                </p>
              </div>
            </div>
          </div>
          <div className="hidden md:flex w-full justify-between items-center h-8">
            <div className="flex gap-6 text-spanish text-t16 font-product_sans">
              <span></span>
              <p>Delivery Location: Ikeja GRA</p>
            </div>
            <div className="flex gap-x-3 text-t16">
              <div className="w-[113px]">
                <button className="text-white font-roboto w-full px-[0.71rem] font-medium bg-tangerine py-[0.45rem] rounded-xs">
                  View Details
                </button>
              </div>{" "}
            </div>
          </div>
        </div>
      </div>
      {/* MOBILE VIEW */}
      <div className="w-full h-full flex flex-col font-product_sans md:hidden">
        <div className="flex text-t12 md:text-t16 gap-6 text-spanish">
          <p>Order by: Felicia Daudu</p>
          <p>Delivery Location: Ikeja GRA</p>
        </div>
        <div className="flex text-t12 md:text-base gap-x-6 mt-2">
          <p className=" px-2 py-1 rounded-lg border bg-tangerine/20 text-tangerine">
            Size:
          </p>
          <p className=" px-2 py-1 rounded-lg bg-black text-white">Color:</p>
        </div>
      </div>
    </div>
  );
}

export default OrderCardSkeleton;
