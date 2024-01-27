import { CartState } from "@atoms/cartState";
import { WishlistState } from "@atoms/wishlistState";
import Card from "@components/Cart/Card";
import CartEmpty from "@components/Cart/CartEmpty";
import { PrimaryButton } from "@components/Common/Buttons";
import SearchField from "@components/Common/SearchField";
import ProductCard from "@components/products/ProductCard";
import { useCalculatePrice } from "@hooks/useCalculatePrice";
import AppLayout from "@layouts/AppLayout";
import { formatter } from "@utils/formatter";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import { CartItem } from "types/cart";
import { WishlistProps } from "types/user";

function Cart() {
  const { calculatePriceWithoutFormatting, currency } = useCalculatePrice();
  const router = useRouter();
  // const { isLoading, isPaused } = useGetCart();
  const [totalPrice, setTotalPrice] = useState(0);

  const [cartItemsAfterHydration, setCartItemsAfterHydration] = useState<
    CartItem[]
  >([]);
  const wishList = useRecoilValue(WishlistState);

  const cartItems = useRecoilValue(CartState);

  useEffect(() => {
    if (cartItems) {
      setCartItemsAfterHydration([...cartItems]);
      return;
    }
    setCartItemsAfterHydration([]);
  }, [cartItems]);

  useEffect(() => {
    if (cartItemsAfterHydration.length > 0) {
      const total =
        cartItemsAfterHydration?.reduce((total: number, item: CartItem) => {
          return (
            total +
            calculatePriceWithoutFormatting(
              item?.currency,
              item?.purchaseAmount,
            )
          );
        }, 0) || 0;

      setTotalPrice(total);
    } else {
      setTotalPrice(0);
    }
  }, [cartItemsAfterHydration]);

  return (
    <AppLayout>
      <div className="lg:pt-[2.49rem]">
        <span className="grid grid-cols-1 place-content-center w-full mt-[1.60rem] mb-[1.90rem] px-[0.95rem] lg:hidden">
          <SearchField
            style={{
              width: "100%",
            }}
          />
        </span>
        <section className="px-[0.95rem] lg:pl-[7.23rem] lg:pr-[5.51rem]">
          <span className="flex items-start w-fit space-x-[0.24rem] mb-[2.37rem]">
            <h1 className="font-medium text-black font-roboto text-t24">
              Cart
            </h1>
            <span className="border h-[0.77rem] w-[0.77rem] grid place-content-center text-[0.5rem] border-denim_blue rounded-full font-product_sans text-denim_blue">
              {cartItemsAfterHydration?.length || 0}
            </span>
          </span>
          <div className="lg:grid lg:grid-cols-[1fr,21.05rem] mb-[3.56rem] lg:gap-[2.96rem]">
            <div className="w-full space-y-[2.37rem] max-w-full overflow-hidden">
              {/* {isLoading &&
                !isPaused &&
                Array(5)
                  .fill("")
                  .map((d, i) => <CartItemSkeleton key={i} />)} */}
              {cartItemsAfterHydration?.length > 0 &&
                cartItemsAfterHydration?.map(
                  (product: CartItem, index: number) => (
                    <Card data={product} key={`${product?.itemId}${index}`} />
                  ),
                )}
              {cartItemsAfterHydration?.length === 0 && <CartEmpty />}
            </div>
            <div className="pt-[2.37rem] lg:p-[1.42rem] lg:pt-0 max-w-full">
              <span className="block">
                <h3 className="font-medium text-black text-t18 lg:text-t20 font-roboto">
                  Cart summary
                </h3>
                <span className="flex items-center justify-between my-[0.95rem]">
                  <span className="font-normal text-t14 lg:text-t16 font-product_sans text-spanish_gray">
                    Subtotal:
                  </span>
                  <h4 className="font-medium text-right font-roboto text-t18 lg:text-t20">
                    {totalPrice === 0
                      ? "--"
                      : formatter(currency).format(totalPrice)}
                  </h4>
                </span>
                <p className="text-t14 lg:text-t16 font-normal font-product_sans text-spanish_gray mb-[0.95rem]">
                  Delivery Fees not included yet
                </p>
                <PrimaryButton
                  text="Proceed to Checkout"
                  onClick={() => router.push("/checkout")}
                  disabled={cartItemsAfterHydration?.length === 0}
                  style={{
                    background:
                      cartItemsAfterHydration?.length === 0
                        ? "#E6E6E6"
                        : "#F0860E",
                    opacity: 1,
                  }}
                />
              </span>
              <span className="block mt-[3.79rem]">
                <h3 className="font-medium text-black text-t18 lg:text-t20 font-roboto">
                  Returns policy
                </h3>
                <p className="text-t14 lg:text-t16 font-normal font-product_sans text-spanish_gray mt-[0.95rem]">
                  Free return within 15 days for Official Store items and 7 days
                  for other eligible items.{" "}
                  {/* <Link href="#" className="text-denim_blue">
                    See more
                  </Link> */}
                </p>
              </span>
            </div>
          </div>
        </section>
        {/**wishlist */}
        {wishList?.length > 0 && (
          <section className="pl-[0.95rem] lg:pl-[7.23rem] mb-[3.56rem]">
            <h3 className="text-black font-roboto text-t18 lg:text-t24 font-medium mb-[1rem]">
              Wishlist
            </h3>
            <div className="mb-[4.03rem] max-w-full overflow-auto no-scrollbar">
              <div className="flex py-4 pb-2 pl-4 space-x-5 flex-nowrap w-fit h-fit">
                {wishList.map((product: WishlistProps) => (
                  <ProductCard
                    item={{
                      ...product.product,
                      quantity: product?.quantity,
                      price: product?.price,
                      _id: product?.product?.productId,
                      name: product?.product?.productName,
                      // productSeller: product?.product?.storeName,
                    }}
                    key={product?.product?.productId}
                  />
                ))}
              </div>
            </div>
          </section>
        )}
      </div>
    </AppLayout>
  );
}

Cart.requireAuth = true;
export default Cart;
