import React from "react";

function ProductCardSkeleton() {
  return (
    <div className="w-full overflow-hidden rounded-xs animate-pulse shadow-card lg:w-[13rem] max-w-full p-[0.47rem] pb-[1.36rem] relative">
      <span className="relative w-full h-[6.46rem] rounded-xs bg-american_silver lg:h-[9.60rem] block mb-[0.65rem] lg:mb-[0.95rem]"></span>
      <span className="bg-american_silver max-w-full w-[8rem] h-[1rem] block mb-[0.30rem] lg:mb-[0.47rem]"></span>
      <span className="bg-american_silver max-w-full w-[11rem] h-[1.5rem] block mb-[0.30rem] lg:mb-[0.47rem]"></span>
      <span className="bg-american_silver block w-[5rem] h-[0.5rem]"></span>
    </div>
  );
}

export default ProductCardSkeleton;
