import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import { CldImage } from "next-cloudinary";
import React from "react";
import { IoIosArrowForward, IoMdClose } from "react-icons/io";

function Preview({
  data,
  handleClose,
  activeIndex,
}: {
  data: string[];
  handleClose: () => void;
  activeIndex: number;
}) {
  return (
    <div className="fixed top-0 left-0 z-50 grid w-full h-full max-w-full p-4 place-content-center bg-black/70">
      <IoMdClose
        role="button"
        onClick={handleClose}
        className="absolute z-10 text-white top-5 lg:top-8 right-5 lg:right-8 w-7 h-7"
      />
      <div className="bg-white relative hover:cursor-grab h-[35rem] lg:h-[40rem] p-2 grid place-content-center rounded-md w-full max-w-full xl:w-[60rem] overflow-hidden mx-auto">
        <Splide
          options={{
            perPage: 1,
            gap: 10,
            width: "60rem",
            // autoWidth: true,
            // autoHeight: true,
            start: activeIndex,
            lazyLoad: true,
            pagination: false,
            drag: true,
          }}
          aria-labelledby="preview products"
          hasTrack={false}
        >
          <SplideTrack>
            {data?.map((item, idx) => (
              <SplideSlide key={idx}>
                <span className="overflow-hidden relative block h-[32rem] w-[50rem] max-w-full mx-auto">
                  <CldImage
                    width="1200"
                    height="1200"
                    src={item}
                    sizes="100vw"
                    alt="product preview image"
                    className="object-contain object-center w-full max-w-full"
                  />
                </span>
              </SplideSlide>
            ))}
          </SplideTrack>
          <div className="w-full splide__arrows">
            <button
              id="arrow__prev"
              className="splide__arrow splide__arrow--prev !h-[1.90rem] lg:!h-[3.32rem] !w-[1.90rem] lg:!w-[3.32rem] !rounded-xs !bg-blueberry/70 !border !border-gainsboro"
            >
              <IoIosArrowForward className="text-denim_blue" />
            </button>
            <button
              id="arrow__next"
              className="splide__arrow splide__arrow--next !h-[1.90rem] lg:!h-[3.32rem] !w-[1.90rem] lg:!w-[3.32rem] !rounded-xs !bg-blueberry/70 !border !border-gainsboro"
            >
              <IoIosArrowForward className="text-denim_blue" />
            </button>
          </div>
        </Splide>
      </div>
    </div>
  );
}

export default Preview;
