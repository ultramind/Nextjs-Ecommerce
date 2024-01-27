import React from "react";

function ProductDetailSkeleton() {
  return (
    <div className="animate-pulse mb-4">
      <div className="grid max-w-full gap-[2.02rem] lg:grid-cols-2 lg:gap-[1.5rem] mb-[3.56rem] overflow-hidden">
        <div className="bg-american_silver rounded-xs min-h-[12.15rem] lg:min-h-[18.02rem] w-full max-w-full overflow-hidden"></div>
        <div className="max-w-[33.02rem] lg:pt-6 relative">
          <span className="block max-w-full lg:max-w-[29rem]">
            <span className="bg-american_silver w-full md:w-[25rem] max-w-full h-[4rem] block mb-4"></span>
            <span className="bg-american_silver block w-full md:w-[15rem] max-w-full h-[1.5rem] mb-1"></span>
            <span className="bg-american_silver block w-full md:w-[10rem] max-w-full h-[1.5rem]"></span>
          </span>
          <span className="flex items-center justify-between mt-[1.42rem] mb-[2.37rem]">
            <span className="bg-american_silver block w-[8rem] max-w-full h-[3rem]"></span>
            <span className="border border-platinum rounded-xs bg-american_silver py-[1rem] px-[2rem]"></span>
          </span>
          <span className="block my-[1.90rem] bg-american_silver rounded-xs h-[3rem] left-0 w-full"></span>
        </div>
      </div>
      <span className="relative w-full h-[11rem] rounded-xs bg-american_silver lg:h-[9.60rem] block mb-[0.65rem] lg:mb-[0.95rem]"></span>
    </div>
  );
}

export default ProductDetailSkeleton;
