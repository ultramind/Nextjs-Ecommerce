import React from "react";

function CartItemSkeleton() {
  return (
    <div className="overflow-hidden animate-pulse max-w-full relative">
      <div className="flex items-start space-x-[1.90rem]">
        <span className="block bg-american_silver relative h-[7.65rem] w-[8.83rem] md:w-[10.14rem]"></span>
        <div className="w-full">
          <span className="flex flex-col md:flex-row md:justify-between mb-[0.47rem]">
            <span className="w-[23.66rem] max-w-full h-[2rem] block bg-american_silver"></span>
            <span className="mt-[0.47rem] md:mt-0 w-[5rem] h-[1rem] block bg-american_silver"></span>
          </span>
          <span className="text-t12 lg:text-t14 font-product_sans font-normal text-spanish_gray mb-[0.95rem] block"></span>
          <span className="flex justify-between">
            <span className="flex w-full md:w-auto items-center justify-between md:justify-normal md:space-x-[1.42rem]">
              <span className="block bg-american_silver py-[0.8rem] px-[3rem] rounded-xs"></span>
              <span className="block bg-american_silver py-[0.8rem] px-[3rem] rounded-xs"></span>
            </span>
            <span className="hidden md:flex bg-american_silver w-[3rem] h-[1.5rem]"></span>
          </span>
        </div>
      </div>
      <span className="flex items-center justify-between mt-[0.47rem] md:mt-0">
        <span className="block bg-american_silver w-[3rem] h-[0.5rem] mt-[0.47rem]"></span>
        <span className="flex md:hidden bg-american_silver w-[3rem] h-[1.5rem]"></span>
      </span>
    </div>
  );
}

export default CartItemSkeleton;
