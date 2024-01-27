import { CldImage } from "next-cloudinary";
import Link from "next/link";
import React from "react";
import { BsDownload, BsImage } from "react-icons/bs";
import { DocumentCardProps } from "types/user";

function DocumentCard({ data }: { data: DocumentCardProps }) {
  return (
    <div className="w-[13.75rem] max-w-full relative">
      <span className="block bg-light_silver rounded-tl-xs rounded-tr-xs overflow-hidden relative h-[9.60rem] mb-[0.95rem]">
        {data?.url ? (
          <CldImage
            width={216}
            height={162}
            src={data?.url}
            alt="download image"
            // fillBackground
            className="object-cover object-center"
          />
        ) : (
          <BsImage className="w-full h-full text-tangerine" />
        )}
      </span>
      <span className="flex items-end justify-between space-x-2">
        {data?.title && (
          <h5 className="text-t16 font-product_sans text-black overflow-hidden text-ellipsis max-w-[11rem]">
            {data?.title}
          </h5>
        )}

        <Link href={data?.url} download={data?.title} className="block">
          <BsDownload
            role="button"
            className="text-tangerine w-[1.5rem] h-[1.5rem]"
          />
        </Link>
      </span>
    </div>
  );
}

export default DocumentCard;
