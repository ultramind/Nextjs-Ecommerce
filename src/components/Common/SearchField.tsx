import { useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { IoIosSearch } from "react-icons/io";

interface SearchProps extends React.ComponentProps<"form"> {
  fromSeller?: boolean;
  fromSearch?: boolean;
  fromOrder?: boolean;
  placeholder?: string;
  sellerProps?: {
    key: string;
    sortBy: string;
  };
  orderProps?: {
    key: string;
    sortBy: string;
    fromUser: boolean;
  };
}

function SearchField({
  fromSeller,
  fromSearch,
  fromOrder,
  placeholder,
  sellerProps,
  orderProps,
  ...props
}: SearchProps) {
  const router = useRouter();
  const [term, setTerm] = useState("");
  const [searching, setSearchingState] = useState(false);

  const queryClient = useQueryClient();

  useEffect(() => {
    if ((fromSeller || fromOrder) && searching) {
      router.push(
        {
          query: {
            search: term,
          },
        },
        undefined,
        { shallow: true },
      );
    }
  }, [term, fromSeller, fromOrder]);

  useEffect(() => {
    if (fromSearch && term !== "") {
      router.push(
        {
          query: {
            query: term,
            category: router?.query?.category || "",
          },
        },
        undefined,
        { shallow: true },
      );
    }
  }, [term, fromSearch]);

  const handleSubmit = (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (fromSeller || fromOrder) {
      router.push(
        {
          query: {
            search: term,
          },
        },
        undefined,
        { shallow: true },
      );
      return;
    }
    router.push({
      pathname: "/search",
      query: {
        query: term,
      },
    });
  };
  return (
    <form
      onSubmit={handleSubmit}
      className="flex items-center space-x-4 py-[0.89rem] max-w-full w-[32rem] border-platinum border-xs px-2 md:px-[1.78rem] rounded-xs"
      {...props}
    >
      <button type="submit">
        <IoIosSearch className=" w-4 h-4 md:h-[1.3rem] md:w-[1.3rem]" />
      </button>
      <input
        type="text"
        name="search"
        placeholder={placeholder || "Search Products, Brands, Categories"}
        autoComplete="off"
        defaultValue={router?.query?.query || ""}
        className="block w-full font-normal outline-none text-t14 lg:text-t16 placeholder:text-cadet_gray font-product_sans"
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
          setTerm(e.target.value);
          if (fromSeller || fromOrder) {
            setSearchingState(true);
            if (term !== "" && fromSeller) {
              queryClient.cancelQueries({
                queryKey: [
                  "getSellerProducts",
                  sellerProps?.key,
                  term,
                  sellerProps?.sortBy,
                ],
              });
              return;
            }

            //fromOrders
            if (term !== "" && fromOrder) {
              queryClient.cancelQueries({
                queryKey: [
                  orderProps?.fromUser ? "getUserOrders" : "getSellerOrders",
                  orderProps?.key,
                  term,
                  orderProps?.sortBy,
                ],
              });
              return;
            }
          }
        }}
      />
    </form>
  );
}

export default SearchField;
