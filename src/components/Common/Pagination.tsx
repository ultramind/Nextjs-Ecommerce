import { useRouter } from "next/router";
import React from "react";
import {
  MdKeyboardArrowLeft,
  MdKeyboardArrowRight,
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from "react-icons/md";

interface Props {
  currentPage: number;
  totalPages: number;
}

function Pagination({ currentPage, totalPages }: Props) {
  const router = useRouter();

  const pageHandler = (value: number) => {
    router.push(
      {
        query: { page: value },
      },
      undefined,
      {
        shallow: true,
      },
    );

    if (typeof window !== undefined) {
      window.scrollTo({
        top: 0,
        behavior: "smooth", // Optional: Add smooth scrolling behavior
      });
    }
  };
  return (
    <div className="flex items-center space-x-[0.95rem]">
      <button
        type="button"
        disabled={Number(currentPage) === 1}
        onClick={() => pageHandler(1)}
        className="h-[2.5rem] md:h-[3.32rem] w-[2.5rem] md:w-[3.32rem] border bg-white disabled:opacity-50 disabled:cursor-not-allowed border-gainsboro rounded-[0.24rem] grid place-content-center"
      >
        <MdKeyboardDoubleArrowLeft size={24} className="text-cool_grey" />
      </button>
      <button
        type="button"
        disabled={Number(currentPage) === 1}
        onClick={() => pageHandler(Number(currentPage) - 1)}
        className="h-[2.5rem] md:h-[3.32rem] w-[2.5rem] md:w-[3.32rem] border disabled:opacity-50 disabled:cursor-not-allowed bg-white border-gainsboro rounded-[0.24rem] grid place-content-center"
      >
        <MdKeyboardArrowLeft size={24} className="text-cool_grey" />
      </button>
      <button
        type="button"
        className="h-[2.5rem] md:h-[3.32rem] w-[2.5rem] md:w-[3.32rem] bg-tangerine disabled:opacity-50 disabled:cursor-not-allowed rounded-[0.24rem] grid place-content-center"
      >
        <span className="text-white text-t16 md:text-t18 lg:text-t24 font-roboto">
          {currentPage}
        </span>
      </button>
      <button
        onClick={() => pageHandler(Number(currentPage) + 1)}
        disabled={Number(totalPages) === Number(currentPage)}
        type="button"
        className="h-[2.5rem] md:h-[3.32rem] w-[2.5rem] md:w-[3.32rem] border disabled:opacity-50 disabled:cursor-not-allowed bg-white border-gainsboro rounded-[0.24rem] grid place-content-center"
      >
        <MdKeyboardArrowRight size={24} className="text-cool_grey" />
      </button>
      <button
        type="button"
        disabled={Number(totalPages) === Number(currentPage)}
        onClick={() => pageHandler(Number(totalPages))}
        className="h-[2.5rem] md:h-[3.32rem] w-[2.5rem] md:w-[3.32rem] border bg-white disabled:opacity-50 disabled:cursor-not-allowed border-gainsboro rounded-[0.24rem] grid place-content-center"
      >
        <MdKeyboardDoubleArrowRight size={24} className="text-cool_grey" />
      </button>
    </div>
  );
}

export default Pagination;
