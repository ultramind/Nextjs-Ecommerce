import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { ProductProps } from "types/product";

function Description({ product }: { product?: ProductProps }) {
  const [showMore, setShowMore] = useState(false);
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };
  return (
    <div>
      <h3 className="text-black font-roboto text-t18 lg:text-t20 font-medium mb-[0.95rem]">
        Description
      </h3>
      <div className="grid relative lg:grid-cols-[13.34rem,1fr] lg:gap-[1.90rem] text-t14 lg:text-t16 text-justify font-product_sans font-normal text-spanish_gray">
        <span
          className={`hidden lg:block absolute z-0 bottom-0 left-0 w-full from-white via-white to-white/0 bg-gradient-to-t transition-all duration-150 overflow-hidden ${
            !showMore ? "h-[10rem]" : "h-0"
          }`}
        ></span>
        <div className="text-left">
          <div
            className={`transition-all space-y-1 duration-150 ${
              !showMore ? "lg:mb-[1.5rem]" : "lg:mb-[3.02rem]"
            }`}
          >
            <p>Category: {product?.category}</p>
            <p>Subcategory: {product?.subCategory}</p>
            {product?.brand ? <p>Brand: {product?.brand}</p> : ""}
            {product?.type === "physical" ? (
              <>
                {product?.color.length > 0 && (
                  <p>
                    Colors:{" "}
                    <span className="capitalize text-t14">
                      {product?.color?.join(", ") || "-"}
                    </span>
                  </p>
                )}
                {product?.size.length > 0 && (
                  <p>
                    Sizes:{" "}
                    <span className="capitalize text-t14">
                      {product?.size?.join(", ") || "-"}
                    </span>
                  </p>
                )}
                <p>Weight: {`${product?.weight ? product?.weight : "-"}`}</p>
              </>
            ) : (
              ""
            )}
            {/* <p>
              Materials: Particle Board, Durable, Easy to clean, Stylish, Very
              accessible price
            </p> */}

            {/* <p>Dimensions: 80 × 40 × 165 cm</p> */}
          </div>
          <button
            onClick={toggleShowMore}
            className="relative z-20 flex items-center w-[9.66rem] justify-between py-[0.65rem]"
          >
            <span className="text-dark_charcoal text-t14 lg:text-t16">
              Read {showMore ? "Less" : "More"}
            </span>
            {showMore ? (
              <IoIosArrowUp className="text-tangerine w-[1rem] lg:w-[1.42rem] h-[1rem] lg:h-[1.42rem]" />
            ) : (
              <IoIosArrowDown className="text-tangerine w-[1rem] lg:w-[1.42rem] h-[1rem] lg:h-[1.42rem]" />
            )}
          </button>
        </div>
        <div
          className={`overflow-hidden xl:max-w-[56.96rem] transition-all duration-150 ${
            showMore ? "h-auto" : "h-0 lg:h-[10rem]"
          }`}
        >
          <p className="text-left leading-normal whitespace-pre-wrap">
            {product?.description}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Description;
