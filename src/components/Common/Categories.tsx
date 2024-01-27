import { useGetCategories } from "@api/category";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

interface CategoriesProps {
  fromTopPick?: boolean;
  fromSearch?: boolean;
}

function Categories({ fromTopPick, fromSearch }: CategoriesProps) {
  const {
    push,
    query: { category, query },
  } = useRouter();

  const { data: categories, isFetching: gettingCategories } =
    useGetCategories();

  const addCategoryToRoute = (category: string) => {
    push(
      {
        query: { query, category },
      },
      undefined,
      {
        shallow: true,
      },
    );
  };

  return (
    <div>
      <h3 className="text-t20 font-roboto font-medium text-dark_charcoal mb-[0.95rem]">
        Categories
      </h3>
      <ul>
        {!gettingCategories &&
        categories?.data?.length > 0 &&
        typeof categories?.data !== "string" ? (
          categories?.data?.map((cat: { name: string; _id: string }) => (
            <li key={cat?._id} className="group">
              {fromTopPick || fromSearch ? (
                <button
                  onClick={() => addCategoryToRoute(cat?.name)}
                  className={`block text-t16 font-product_sans text-left w-full ${
                    category === cat?.name
                      ? "text-tangerine"
                      : "text-spanish_gray2"
                  } group-last-of-type:border-none first-letter:capitalize border-b-xs border-platinum group-last-of-type:pb-0 group-last-of-type:mb-0 pb-[0.47rem] mb-[0.47rem]`}
                >
                  {cat?.name}
                </button>
              ) : (
                <Link
                  href={`/shop?category=${cat?.name?.replace("&", "+")}`}
                  className={`block text-t16 font-product_sans w-full text-left ${
                    category === cat?.name?.replace("&", " ")
                      ? "text-tangerine"
                      : "text-spanish_gray2"
                  } group-last-of-type:border-none border-b-xs first-letter:capitalize border-platinum group-last-of-type:pb-0 group-last-of-type:mb-0 pb-[0.47rem] mb-[0.47rem]`}
                >
                  {cat?.name}
                </Link>
              )}
            </li>
          ))
        ) : (
          <span className="text-spanish_gray2 text-t14">No category</span>
        )}
      </ul>
    </div>
  );
}

export default Categories;
