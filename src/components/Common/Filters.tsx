import { useGetBrands, useGetColors } from "@api/category";
import { useGetMinMaxPrice } from "@api/product";
import { FilterState, FilterStateProps } from "@atoms/Filter";
import { globalCurrency } from "@atoms/globalState";
import { useCalculatePrice } from "@hooks/useCalculatePrice";
import { useIsFetching } from "@tanstack/react-query";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import { useRecoilValue, useResetRecoilState, useSetRecoilState } from "recoil";
import { CheckBox } from "./Input";

// interface TypeProps {
//   physical: boolean;
//   virtual: boolean;
//   // affiliate: boolean;
//   [x: string]: any;
// }

const ProductType = ({
  type,
  setProductType,
}: {
  type: string;
  setProductType: (value: string) => void;
}) => {
  const [isDropdownActive, setDropdownState] = useState(false);

  // const [checked, setChecked] = useState<TypeProps>({
  //   physical: false,
  //   virtual: false,
  //   // affiliate: false,
  // });

  const checkBoxHandler = (checked: boolean, name: string) => {
    if (checked && name === type) {
      setProductType("");
      return;
    }
    setProductType(name);
  };

  return (
    <div className="border-b-xs border-platinum">
      <button
        type="button"
        onClick={() => setDropdownState(!isDropdownActive)}
        aria-label="filter"
        className="flex items-center w-full justify-between text-t16 font-product_sans text-spanish_gray2 pb-[0.47rem]"
      >
        <span>Product Type</span>
        {isDropdownActive ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </button>

      <div
        className={`transition-all duration-100 overflow-hidden ${
          isDropdownActive ? "pb-[0.45rem] h-auto my-[0.47rem]" : "h-0"
        }`}
      >
        {/* <span className="block mb-[1.07rem]">
          <span className="block mb-[0.47rem] text-t14 font-product_sans text-spanish_gray2">
            Size:
          </span>
          <span className="flex items-center space-x-[0.59rem] overflow-auto no-scrollbar">
            {["S", "M", "L", "XL", "XXL"].map((d) => (
              <button
                key={d}
                className="min-w-[1.66rem] h-[1.72rem] rounded-[1.48rem] bg-floral_white text-t12 font-product_sans text-black"
              >
                {d}
              </button>
            ))}
          </span>
        </span> */}
        {/* <span className="block mb-[1.07rem]">
          <span className="block mb-[0.47rem] text-t14 font-product_sans text-spanish_gray2">
            Color
          </span>
          <span className="flex items-center space-x-[0.59rem] pr-[0.1rem] 2xl:pr-0 mb-[0.47rem] overflow-auto no-scrollbar">
            <input
              type="text"
              name="color"
              placeholder="Input desired color"
              value={color}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setColor(e.target.value)
              }
              className="max-w-full w-[9rem] p-1 outline-none text-spanish_gray2 font-product_sans text-t14 min-h-[1.72rem] border border-platinum rounded-[4px]"
            />
            <button
              onClick={() => {
                setColors((prev) => [...prev, color]);
                setColor("");
              }}
              className="min-w-[1.5rem] p-1 h-[1.5rem] bg-tangerine text-white grid place-content-center rounded-xs"
            >
              <BsPlus />
            </button>
          </span>
          {colors.length > 0 && (
            <span className="flex items-center space-x-[0.4rem]">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() =>
                    setProductType((prev) => ({ ...prev, color: "Black" }))
                  }
                  style={{
                    background:
                      color.toLowerCase() !== "white"
                        ? color.toLowerCase()
                        : "black",
                  }}
                  className="capitalize rounded-xs text-white text-t12 font-product_sans px-[0.59rem] py-[0.36rem]"
                >
                  {color}
                </button>
              ))}
            </span>
          )}
        </span> */}
        <div className="space-y-[0.47rem]">
          {["physical", "virtual"].map((d, i) => (
            <span
              key={i}
              className="flex items-center text-t14 lg:text-t16 font-product_sans space-x-[0.59rem]"
            >
              <CheckBox
                parentStyle={{
                  width: "1.19rem",
                  height: "1.19rem",
                }}
                name={d}
                checked={type === d}
                handleCheck={(checked) => checkBoxHandler(checked, d)}
              />
              <span className="text-spanish_gray2 first-letter:capitalize">
                {d}
              </span>
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};

const Color = ({
  color,
  setColor,
}: {
  color: string;
  setColor: (value: string) => void;
}) => {
  const [isDropdownActive, setDropdownState] = useState(false);
  const { data: colors, isFetching: gettingColors } = useGetColors(true);

  // const [checked, setChecked] = useState<{ [x: string]: any }>({});

  const checkBoxHandler = (checked: boolean, name: string) => {
    if (checked && name === color) {
      setColor("");
      return;
    }
    setColor(name);
  };

  return (
    <div className="border-b-xs border-platinum">
      <button
        type="button"
        onClick={() => setDropdownState(!isDropdownActive)}
        aria-label="filter"
        className="flex items-center w-full justify-between text-t16 font-product_sans text-spanish_gray2 pb-[0.47rem]"
      >
        <span>Color</span>
        {isDropdownActive ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </button>
      <div
        className={`transition-all duration-100 overflow-hidden ${
          isDropdownActive ? "space-y-[0.47rem] h-auto my-[0.47rem]" : "h-0"
        }`}
      >
        {!gettingColors &&
          colors &&
          colors?.data?.length > 0 &&
          colors?.data?.map((d: { name: string; _id: string }) => (
            <span
              key={d?._id}
              className="flex items-center text-t14 lg:text-t16 font-product_sans space-x-[0.59rem]"
            >
              <CheckBox
                parentStyle={{
                  width: "1.19rem",
                  height: "1.19rem",
                }}
                name={d?.name}
                checked={color === d?.name}
                handleCheck={(checked) => checkBoxHandler(checked, d?.name)}
              />
              <span className="text-spanish_gray2 first-letter:capitalize">
                {d?.name}
              </span>
            </span>
          ))}
        {!gettingColors && !colors && (
          <span className="text-spanish_gray2 text-t14">No color</span>
        )}
      </div>
      {/* <div
        className={`transition-all duration-100 overflow-hidden ${
          isDropdownActive ? "pb-[0.45rem] h-auto my-[0.47rem]" : "h-0"
        }`}
      >
        <span className="block mb-[1.07rem]">
          <span className="block mb-[0.47rem] text-t14 font-product_sans text-spanish_gray2">
            Size:
          </span>
          <span className="flex items-center space-x-[0.59rem] overflow-auto no-scrollbar">
            {["S", "M", "L", "XL", "XXL"].map((d) => (
              <button
                key={d}
                className="min-w-[1.66rem] h-[1.72rem] rounded-[1.48rem] bg-floral_white text-t12 font-product_sans text-black"
              >
                {d}
              </button>
            ))}
          </span>
        </span>
        <span className="block mb-[1.07rem]">
          <span className="block mb-[0.47rem] text-t14 font-product_sans text-spanish_gray2">
            Color
          </span>
          <span className="flex items-center space-x-[0.59rem] pr-[0.1rem] 2xl:pr-0 mb-[0.47rem] overflow-auto no-scrollbar">
            <input
              type="text"
              name="color"
              placeholder="Input desired color"
              value={color}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setColor(e.target.value)
              }
              className="max-w-full w-[9rem] p-1 outline-none text-spanish_gray2 font-product_sans text-t14 min-h-[1.72rem] border border-platinum rounded-[4px]"
            />
            <button
              onClick={() => {
                setColors((prev) => [...prev, color]);
                setColor("");
              }}
              className="min-w-[1.5rem] p-1 h-[1.5rem] bg-tangerine text-white grid place-content-center rounded-xs"
            >
              <BsPlus />
            </button>
          </span>
          {colors.length > 0 && (
            <span className="flex items-center space-x-[0.4rem]">
              {colors.map((color) => (
                <button
                  key={color}
                  onClick={() =>
                    setProductType((prev) => ({ ...prev, color: "Black" }))
                  }
                  style={{
                    background:
                      color.toLowerCase() !== "white"
                        ? color.toLowerCase()
                        : "black",
                  }}
                  className="capitalize rounded-xs text-white text-t12 font-product_sans px-[0.59rem] py-[0.36rem]"
                >
                  {color}
                </button>
              ))}
            </span>
          )}
        </span>
      </div> */}
    </div>
  );
};

const Price = ({
  setPrice,
}: {
  setPrice: (min: number, max: number) => void;
}) => {
  const [isDropdownActive, setDropdownState] = useState(false);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const currency = useRecoilValue(globalCurrency);

  // const [currency, setCurrency] = useState("NGN");
  const { calculatePrice } = useCalculatePrice(true);

  //get minimum and maximum price
  const { data, isSuccess } = useGetMinMaxPrice();

  useEffect(() => {
    if (isSuccess) {
      setMin(data?.minimum);
      setMax(data?.maximum);
    }
  }, [isSuccess]);

  useEffect(() => {
    setPrice(min, max);
  }, [min, max]);

  return (
    <div className="border-b-xs border-platinum pb-[0.47rem]">
      <button
        onClick={() => setDropdownState(!isDropdownActive)}
        type="button"
        aria-label="filter"
        className="flex items-center justify-between w-full text-t16 font-product_sans text-spanish_gray2"
      >
        <span>Price</span>
        {isDropdownActive ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </button>

      <div
        className={`transition-all duration-100 overflow-hidden ${
          isDropdownActive ? "h-auto my-[0.47rem]" : "h-0"
        }`}
      >
        <span className="block w-full">
          <input
            type="range"
            name="price"
            value={min || 0}
            // min={min}
            max={max}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setMin(Number(e.target.value))
            }
            className="price_slider"
          />
        </span>
        <div className="lg:max-w-[10rem] justify-between space-y-[0.94rem] w-full items-center mt-[0.65rem]">
          <span className="block w-full text-t14 font-product_sans text-spanish_gray2">
            <span className="block mb-[0.42rem]">From</span>
            <input
              type="text"
              name="min"
              className="bg-floral_white rounded-[4px] block w-full outline-none text-black p-3 lg:p-2"
              value={calculatePrice(currency, min)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setMin(Number(e.target?.value?.replace(/\D/g, "")))
              }
            />
          </span>
          <span className="block w-full text-t14 font-product_sans text-spanish_gray2">
            <span className="block mb-[0.42rem]">To</span>
            <input
              type="text"
              name="max"
              className="bg-floral_white rounded-[4px] w-full block outline-none text-black max-w-full p-3 lg:p-2"
              value={calculatePrice(currency, max)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setMax(Number(e.target?.value?.replace(/\D/g, "")))
              }
            />
          </span>
        </div>
        {/* <div className="space-y-[0.59rem]">
          <Radio
            label="Dollars"
            value="Currency"
            name="payment_method"
            selected={currency === "USD"}
            handleSelect={() => setCurrency("USD")}
            labelStyle={{
              color: "#989595",
            }}
          />
          <Radio
            label="Naira"
            value="Currency"
            name="payment_method"
            selected={currency === "NGN"}
            handleSelect={() => setCurrency("NGN")}
            labelStyle={{
              color: "#989595",
            }}
          />
        </div> */}
      </div>
    </div>
  );
};

const Brand = ({
  brand,
  setBrand,
}: {
  brand: string;
  setBrand: (value: string) => void;
}) => {
  const [isDropdownActive, setDropdownState] = useState(false);

  const { data: brands, isFetching: gettingBrands } = useGetBrands(true);

  // const [checked, setChecked] = useState<{ [x: string]: any }>({});

  const checkBoxHandler = (checked: boolean, name: string) => {
    if (checked && name === brand) {
      setBrand("");
      return;
    }
    setBrand(name);
    // setChecked(() => ({ ...checked, [name]: !checked[name] }));
  };

  return (
    <div className="border-b-xs border-platinum">
      <button
        onClick={() => setDropdownState(!isDropdownActive)}
        type="button"
        aria-label="filter"
        className="flex items-center w-full justify-between text-t16 font-product_sans text-spanish_gray2 pb-[0.47rem]"
      >
        <span>Brand</span>
        {isDropdownActive ? <IoIosArrowUp /> : <IoIosArrowDown />}
      </button>

      <div
        className={`transition-all duration-100 overflow-hidden ${
          isDropdownActive ? "space-y-[0.47rem] h-auto my-[0.47rem]" : "h-0"
        }`}
      >
        {!gettingBrands &&
          brands &&
          typeof brands?.data !== "string" &&
          brands?.data?.length > 0 &&
          brands?.data?.map((d: { name: string; _id: string }) => (
            <span
              key={d?._id}
              className="flex items-center text-t14 lg:text-t16 font-product_sans space-x-[0.59rem]"
            >
              <CheckBox
                parentStyle={{
                  width: "1.19rem",
                  height: "1.19rem",
                }}
                name={d?.name}
                checked={brand === d?.name}
                handleCheck={(checked) => checkBoxHandler(checked, d?.name)}
              />
              <span className="text-spanish_gray2 first-letter:capitalize">
                {d?.name}
              </span>
            </span>
          ))}
        {!gettingBrands && !brands?.data?.length && (
          <span className="text-spanish_gray2 text-t14">No brand</span>
        )}
      </div>
    </div>
  );
};

function Filters() {
  const resetFilterState = useResetRecoilState(FilterState);
  const setFiltersState = useSetRecoilState(FilterState);
  const [state, setState] = useState<Partial<FilterStateProps>>({});
  const { pathname } = useRouter();

  const isFetchingShopProducts = useIsFetching({
    queryKey: ["getAllProducts"],
  });

  const isFetchingTopPicks = useIsFetching({
    queryKey: ["getTopPicksProducts"],
  });

  useEffect(() => {
    if (pathname) {
      resetFilterState();
    }
  }, [pathname]);

  const { currency, calculatePriceWithoutFormatting } = useCalculatePrice();

  const applyHandler = () => {
    if (currency !== "NGN") {
      setFiltersState({
        ...state,
        minPrice: calculatePriceWithoutFormatting("NGN", state.minPrice || 0),
        maxPrice: calculatePriceWithoutFormatting("NGN", state.maxPrice || 0),
      });
      return;
    }
    setFiltersState(state);
  };

  return (
    <div>
      <span className="flex justify-between items-center mb-[0.95rem]">
        <h3 className="font-medium text-t20 font-roboto text-dark_charcoal">
          Filters
        </h3>
        <button
          onClick={applyHandler}
          disabled={(isFetchingShopProducts || isFetchingTopPicks) > 0}
          className="hidden p-2 font-medium md:block disabled:opacity-30 text-t12 text-tangerine bg-tangerine/30 rounded-xs"
        >
          {(isFetchingShopProducts || isFetchingTopPicks) > 0 ? (
            <BiLoaderAlt className="w-3 h-3 animate-spin text-tangerine" />
          ) : (
            <span>Apply</span>
          )}
        </button>
      </span>
      {/** filters */}
      <div className="space-y-[0.47rem] max-w-full">
        <Price
          setPrice={(min, max) =>
            setState((prev) => ({ ...prev, minPrice: min, maxPrice: max }))
          }
        />
        <ProductType
          type={state.type || ""}
          setProductType={(value) =>
            setState((prev) => ({ ...prev, type: value }))
          }
        />
        <Color
          color={state.color || ""}
          setColor={(value) => setState((prev) => ({ ...prev, color: value }))}
        />
        <Brand
          brand={state.brand || ""}
          setBrand={(value) => setState((prev) => ({ ...prev, brand: value }))}
        />
      </div>
      <button
        onClick={applyHandler}
        disabled={(isFetchingShopProducts || isFetchingTopPicks) > 0}
        className="p-3 font-medium md:hidden w-full block disabled:opacity-30 text-t14 mt-[1.5rem] text-tangerine bg-tangerine/30 rounded-xs"
      >
        {(isFetchingShopProducts || isFetchingTopPicks) > 0 ? (
          <BiLoaderAlt className="w-3 h-3 animate-spin text-tangerine" />
        ) : (
          <span>Apply</span>
        )}
      </button>
    </div>
  );
}

export default Filters;
