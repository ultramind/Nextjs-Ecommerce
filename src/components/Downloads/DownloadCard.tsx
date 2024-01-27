import { CldImage } from "next-cloudinary";
import Link from "next/link";
import React from "react";
import { BsDownload, BsImage } from "react-icons/bs";
import { DownloadCardProps } from "types/user";

function DownloadCard({ data }: { data: DownloadCardProps }) {
  return (
    <div className="w-[13.75rem] max-w-full relative">
      <span className="block bg-light_silver rounded-tl-xs rounded-tr-xs overflow-hidden relative h-[9.60rem] mb-[0.95rem]">
        {/* <Image
          src="/images/Rectangle 4480.svg"
          alt="download"
          fill
          className="object-center object-contain"
        /> */}
        {data?.productImages && data?.productImages[0] ? (
          <CldImage
            width={216}
            height={162}
            src={data?.productImages[0]}
            alt="download image"
            // fillBackground
            className="object-cover object-center"
          />
        ) : (
          <BsImage className="w-full h-full text-tangerine" />
        )}
      </span>
      <span className="flex items-end justify-between space-x-2">
        <Link
          href={`/product/${data?.productId}`}
          className="block hover:underline transition-all duration-100"
        >
          <h5 className="text-t16 font-product_sans text-black overflow-hidden text-ellipsis max-w-[11rem]">
            {data?.productName}
          </h5>
        </Link>

        <a
          href={data?.downloadLink}
          download={data?.productName}
          className="block"
        >
          <BsDownload
            role="button"
            className="text-tangerine w-[1.5rem] h-[1.5rem]"
          />
        </a>
      </span>
    </div>
  );
}

export default DownloadCard;
