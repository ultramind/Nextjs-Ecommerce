import { useGetBusiness } from "@api/seller";
import Link from "next/link";
import React, { useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

const ManufacturerDetails = ({ store_id }: { store_id: string }) => {
  const { data, isError } = useGetBusiness(store_id);
  const [showMore, setShowMore] = useState(true);
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };

  return (
    <span
      className={`block max-w-full ${
        showMore ? "w-[24.01rem] max-w-full flex-1" : "w-[24.01rem]"
      } mx-auto`}
    >
      <span className="flex items-center justify-between text-black">
        <h6
          className={`transition-all duration-150 ${
            showMore
              ? "text-t20 font-medium font-roboto"
              : "text-t18 font-product_sans"
          }`}
        >
          Manufacturer Details
        </h6>
        {!showMore ? (
          <IoIosArrowDown role="button" onClick={toggleShowMore} />
        ) : (
          <IoIosArrowUp role="button" onClick={toggleShowMore} />
        )}
      </span>
      <span
        className={`block transition-all duration-150 overflow-hidden ${
          showMore ? "h-auto mt-[0.95rem]" : "h-0"
        }`}
      >
        <>
          {data && data?.name ? (
            <>
              <h3 className="text-t16 font-roboto text-black lg:font-medium mb-[0.5rem] capitalize">
                Name: {data?.name}
              </h3>
              {data?.businessAddress?.state ? (
                <span className="block text-t14 lg:text-t16 font-product_sans text-spanish_gray">
                  {data?.businessAddress?.state}
                  {", "}
                  {data?.businessAddress?.country}.
                </span>
              ) : (
                ""
              )}
            </>
          ) : (
            <></>
          )}
          {isError && (
            <p className="text-sm text-granite_gray">
              Could not get store details
            </p>
          )}
        </>
        {/* <p className="text-t16 font-product_sans text-granite_gray2">
          Company Name and brief description of the company, according to the
          profile description given by the company.Company Name and brief
          description of the company, according to the profile description given
          by the company.
        </p> */}
        {data?.phone && (
          <span className="block max-w-[18.20rem] mt-[0.95rem]">
            {/* <PrimaryButton text="Chat with Manufacturer" /> */}
            <Link
              href={`mailto:${data?.email}`}
              title={
                data?.email
                  ? "Chat with Manufacturer"
                  : "No available email address"
              }
              className={`w-full py-4 font-medium block text-center font-roboto text-14 lg:text-t16 disabled:opacity-50 !leading-[1.11rem] rounded-xs text-white bg-tangerine ${
                !data?.email ? "cursor-not-allowed opacity-50" : ""
              }`}
            >
              Chat with Manufacturer
            </Link>
          </span>
        )}
      </span>
    </span>
  );
};

const MinimumOrderQuantity = ({ moq = 0 }: { moq: number }) => {
  const [showMore, setShowMore] = useState(true);
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };
  return (
    <span className="block max-w-full w-[18.38rem] mx-auto">
      <span className="flex items-center justify-between text-black">
        <h6
          className={`transition-all duration-150 ${
            showMore
              ? "text-t20 font-medium font-roboto"
              : "text-t18 font-product_sans"
          }`}
        >
          Minimum Order Quantity
        </h6>
        {!showMore ? (
          <IoIosArrowDown role="button" onClick={toggleShowMore} />
        ) : (
          <IoIosArrowUp role="button" onClick={toggleShowMore} />
        )}
      </span>
      <span
        className={`block transition-all duration-150 overflow-hidden ${
          showMore ? "h-auto mt-[0.95rem]" : "h-0"
        }`}
      >
        <p className="text-t16 font-product_sans text-granite_gray2">
          The minimum amount that can be ordered is {moq} piece
          {moq > 1 ? "s" : ""}
        </p>
      </span>
    </span>
  );
};

const LeadTime = () => {
  const [showMore, setShowMore] = useState(true);
  const toggleShowMore = () => {
    setShowMore(!showMore);
  };
  return (
    <span className="block max-w-full w-[18.38rem] mx-auto">
      <span className="flex items-center justify-between text-black">
        <h6
          className={`transition-all duration-150 ${
            showMore
              ? "text-t20 font-medium font-roboto"
              : "text-t18 font-product_sans"
          }`}
        >
          Lead time
        </h6>
        {!showMore ? (
          <IoIosArrowDown role="button" onClick={toggleShowMore} />
        ) : (
          <IoIosArrowUp role="button" onClick={toggleShowMore} />
        )}
      </span>
      <span
        className={`block transition-all duration-150 overflow-hidden ${
          showMore ? "h-auto mt-[0.95rem]" : "h-0"
        }`}
      >
        <span className="flex items-center justify-between border-y text-black border-platinum py-[0.95rem]">
          <span className="font-medium text-t16 font-roboto">1-10 Pcs</span>
          <span className="font-medium text-t16 font-roboto">10-100 Pcs</span>
          <span className="font-medium text-t16 font-roboto">100-1000 Pcs</span>
        </span>
        <span className="flex items-center space-x-[3.32rem] text-granite_gray pt-[0.95rem]">
          <span className="text-t16 font-product_sans">5 days</span>
          <span className="text-t16 font-product_sans">10 days</span>
          <span className="text-t16 font-product_sans">20 days</span>
        </span>
      </span>
    </span>
  );
};

function OtherDetails({ store_id, moq }: { store_id: string; moq: number }) {
  return (
    <div
      className={`hidden mb-[3.56rem] lg:flex w-full justify-between max-w-full xl:max-w-[74rem] mx-auto  xl:mx-0 space-x-[2.37rem]`}
    >
      <ManufacturerDetails store_id={store_id} />
      <MinimumOrderQuantity moq={moq} />
      <LeadTime />
    </div>
  );
}

export default OtherDetails;
