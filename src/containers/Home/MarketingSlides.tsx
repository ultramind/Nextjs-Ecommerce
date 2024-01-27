import { Splide, SplideSlide, SplideTrack } from "@splidejs/react-splide";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { HiOutlineArrowUpRight } from "react-icons/hi2";

interface MarketingSlideProps {
  imageUrl: string;
  heading?: string;
  subtitle?: string;
  linkUrl?: string;
}

const MarketingSlide = ({
  imageUrl,
  heading,
  subtitle,
  linkUrl,
}: MarketingSlideProps) => {
  return (
    <div className="relative w-full h-full">
      <Image
        src={imageUrl}
        alt="computers"
        fill
        priority
        className="object-cover object-left md:object-center"
        sizes="(max-width: 760px) 50vw, 100vw"
      />
      <div className="absolute top-0 left-0 w-full flex items-end h-full bg-denim_blue/10 px-[1.01rem] lg:px-[7.29rem] pb-[1.66rem] lg:pb-[2.43rem]">
        {heading && (
          <span className="relative block w-full">
            <h1 className="text-t20 lg:text-t32 font-medium font-roboto max-w-[15rem] lg:max-w-[30rem] mb-[0.5rem] lg:mb-[1rem]">
              {heading}
            </h1>
            {linkUrl && (
              <Link href={linkUrl} title="Shop" className="block px-1">
                <span className="flex items-center space-x-[0.15rem] mb-[0.95rem] lg:mb-[1.90rem]">
                  <p className="text-t14 lg:text-t16 font-product_sans font-normal max-w-[13.5rem] lg:max-w-full">
                    {subtitle}
                  </p>

                  <HiOutlineArrowUpRight />
                </span>
              </Link>
            )}
          </span>
        )}
      </div>
    </div>
  );
};

function MarketingSlides() {
  const slides: MarketingSlideProps[] = [
    {
      imageUrl: "/images/slides/0F2836F9-4481-4F03-BC67-9D0443E8.jpg",
    },
    {
      imageUrl: "/images/slides/62BACDE9-D2F5-43F8-A2BB-8943B151.jpg",
    },
    {
      imageUrl: "/images/slides/9332DD5A-3AEC-45AF-99A3-4A2886B8.jpg",
    },
    {
      imageUrl: "/images/slides/13957E93-C04B-4C4B-831B-941A155C.jpg",
    },
    {
      imageUrl: "/images/slides/C441209B-319A-4118-BDA1-5D02F5C7.jpg",
    },
    {
      imageUrl: "/images/slides/D3EA39F6-7C3B-41A5-8BB2-BBC5539A.jpg",
    },
  ];
  return (
    <section className="relative w-full min-h-[16rem] lg:min-h-[28rem] text-white bg-american_silver">
      <Splide
        options={{
          perPage: 1,
          type: "loop",
          autoplay: true,
          gap: 10,
          lazyLoad: true,
          pagination: true,
          arrows: false,
          cover: true,
          easing: "linear",
          autoScroll: {
            speed: 0.5,
            autoStart: true,
          },
        }}
        aria-labelledby="preview products"
        hasTrack={false}
      >
        <SplideTrack>
          {slides.map((item, idx) => (
            <SplideSlide key={idx}>
              <div className="overflow-hidden relative bg-red-500 block h-[16rem] lg:h-[28rem] w-screen max-w-full">
                <MarketingSlide {...item} />
              </div>
            </SplideSlide>
          ))}
        </SplideTrack>
      </Splide>
    </section>
  );
}

export default MarketingSlides;
