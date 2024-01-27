import React from "react";
import ProductCardSkeleton from "./ProductCardSkeleton";

function ProductListingSkeleton({ title }: { title: string }) {
  return (
    <div>
      <span className="flex justify-between items-center w-full mb-[0.95rem] lg:mb-[1.90rem]">
        <h2 className="font-medium font-roboto text-t18 lg:text-t32">
          {title}
        </h2>
      </span>

      <div className="grid gap-x-[1.5rem] gap-y-[1.90rem] grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {Array(5)
          .fill("")
          .map((item, index) => (
            <ProductCardSkeleton key={index} />
          ))}
      </div>
    </div>
  );
}

export default ProductListingSkeleton;
