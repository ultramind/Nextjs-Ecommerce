import { Splide, SplideSlide } from "@splidejs/react-splide";
import { Options } from "@splidejs/splide";
import { CldImage } from "next-cloudinary";
import React, { useEffect, useState } from "react";
import { AiFillEye } from "react-icons/ai";
import { ProductProps } from "types/product";
import { Heart } from "../ProductCard";
import Preview from "./Preview";

function ProductImages({
  product,
  quantity,
  fromSeller = false,
  fromOrder = false,
}: {
  product?: Partial<{
    productImages: string[];
    type?: string;
    productType?: string;
  }>;
  quantity?: number;
  fromSeller?: boolean;
  fromOrder?: boolean;
}) {
  const mainRef = React.createRef<Splide>();

  /**
   * The thumbnail Splide component.
   */
  const thumbsRef = React.createRef<Splide>();
  const mainOptions: Options = {
    type: "loop",
    perPage: 1,
    perMove: 1,
    gap: "1rem",
    pagination: false,
    arrows: false,
  };

  const thumbsOptions: Options = {
    type: "slide",
    rewind: true,
    gap: "0.5rem",
    pagination: false,
    direction: "ttb",
    height: "100%",
    fixedWidth: 110,
    autoHeight: true,
    cover: true,
    mediaQuery: "max",
    drag: true,
    breakpoints: {
      640: {
        focus: 0,
        direction: "ltr",
      },
    },
    isNavigation: true,
    arrows: false,
  };

  useEffect(() => {
    if (mainRef.current && thumbsRef.current && thumbsRef.current.splide) {
      mainRef.current.sync(thumbsRef.current.splide);
    }
  }, [mainRef, thumbsRef]);

  const [previewImages, setPreviewImagesState] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <>
      <div className="max-w-full flex flex-col-reverse md:grid md:gap-[0.25rem] md:grid-cols-[7.25rem,1fr]">
        <div className="mt-[1.5rem] md:mt-0 max-w-full overflow-auto lg:h-[24.5rem] style-scrollbar">
          <Splide
            options={thumbsOptions}
            ref={thumbsRef}
            aria-label="The carousel with thumbnails. Selecting a thumbnail will change the main carousel"
          >
            {product?.productImages?.map((d, i) => (
              <SplideSlide key={i}>
                <span className="relative w-full bg-light_silver rounded-[0.2rem] overflow-hidden h-[5rem] md:h-[6rem] block shadow-sm">
                  <CldImage
                    width={133}
                    height={95}
                    src={d}
                    alt="product image"
                    // fillBackground
                    className="object-cover object-center"
                  />
                </span>
              </SplideSlide>
            ))}
          </Splide>
        </div>
        <div className="relative max-w-full h-fit rounded-xs">
          <span className="capitalize absolute top-[1rem] left-[1rem] z-20 grid place-content-center text-white/90 text-t12 font-product_sans rounded-xs bg-tangerine/50 py-[0.5rem] px-[0.95rem]">
            {product?.type || product?.productType} Product
          </span>

          {!fromSeller && !fromOrder && (
            <span className="block absolute top-[1rem] right-[1rem] z-10 cursor-pointer">
              <Heart product={product as ProductProps} quantity={quantity} />
            </span>
          )}
          <Splide
            options={mainOptions}
            ref={mainRef}
            aria-labelledby="thumbnail-slider-example"
            onMove={(splide, index) => {
              setActiveIndex(index);
            }}
          >
            {product?.productImages?.map((d, i) => (
              <SplideSlide key={i}>
                <span className="relative bg-light_silver rounded-xs overflow-hidden block full shadow-sm h-[18.15rem] lg:h-[24.5rem]">
                  <CldImage
                    width={578}
                    height={304}
                    src={d}
                    alt="product image"
                    // fillBackground
                    className="object-cover object-center"
                  />
                </span>
              </SplideSlide>
            ))}
          </Splide>
          <span
            onClick={() => setPreviewImagesState(true)}
            className="flex items-center space-x-1 text-spanish absolute bottom-[1rem] left-[1rem] bg-white/80 transition-colors duration-100 hover:bg-white py-2 px-3 rounded-full z-10 cursor-pointer"
          >
            <AiFillEye />
            <span className="text-xs md:text-sm">Preview</span>
          </span>
        </div>
      </div>
      {previewImages && (
        <Preview
          data={product?.productImages ?? []}
          handleClose={() => setPreviewImagesState(false)}
          activeIndex={activeIndex}
        />
      )}
    </>
  );
}

export default ProductImages;
