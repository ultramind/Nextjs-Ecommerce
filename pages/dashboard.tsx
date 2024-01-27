import { useGetRelatedProducts } from "@api/product";
import { useGetWishlist } from "@api/user/wishlist";
import Card from "@components/Cart/Card";
import ProductEmptyState from "@components/Common/ProductEmptyState";
import SearchField from "@components/Common/SearchField";
import ProductCard from "@components/products/ProductCard";
import DashboardLayout from "@layouts/DashboardLayout";
import React from "react";
import { ProductProps } from "types/product";
import { WishlistProps } from "types/user";

function Dashboard() {
  const { data, isError } = useGetWishlist();

  const { data: otherProducts, isLoading: gettingRelatedProducts } =
    useGetRelatedProducts(
      data?.items?.length > 0 ? data?.items[0]?.product?.productId : null,
    );

  return (
    <DashboardLayout>
      <div>
        <span className="grid grid-cols-1 place-content-center w-full mt-[1.60rem] mb-[1.90rem] px-[0.95rem] lg:hidden">
          <SearchField
            style={{
              width: "100%",
            }}
          />
        </span>
        <section className="px-[0.71rem] lg:p-0 max-w-[48.56rem]">
          <span className="flex items-start w-fit space-x-[0.24rem] mb-[2.37rem]">
            <h1 className="font-medium text-black font-roboto text-t24">
              Wishlist
            </h1>
            <span className="border h-[0.8rem] w-[0.8rem] grid place-content-center text-[0.6rem] border-denim_blue rounded-full font-product_sans text-denim_blue">
              {data?.items?.length || 0}
            </span>
          </span>

          <div className="w-full space-y-[2.37rem] mb-[3.56rem]">
            {data?.items?.length > 0 &&
              data?.items?.map((product: WishlistProps) => (
                <Card
                  data={{
                    ...product?.product,
                    pricePerUnit: product?.price,
                    purchaseAmount: product?.price,
                    purchaseQuantity: product?.quantity,
                    productQuantity: product?.quantity,
                  }}
                  key={product?.product?.productId}
                  wishlist={true}
                />
              ))}
            {/* {isLoading &&
              Array(5)
                .fill("")
                .map((d, i) => <CartItemSkeleton key={i} />)} */}
          </div>
          {(data?.items?.length === 0 || !data?.items || isError) && (
            <ProductEmptyState
              className="max-w-[22rem] mx-auto mt-[2.37rem] mb-[16.84rem]"
              text={"You’ve not added any products to your wishlist yet"}
            />
          )}
        </section>
        {/**more */}
        {!gettingRelatedProducts &&
          otherProducts?.length > 0 &&
          data?.items?.length > 0 && (
            <section className="pl-[0.71rem] lg:p-0">
              <h3 className="text-black font-roboto text-t18 lg:text-t24 font-medium mb-[2.37rem]">
                Other products you may like
              </h3>
              <div className="mb-[4.03rem] max-w-full overflow-auto no-scrollbar">
                <div className="flex pb-2 flex-nowrap w-fit h-fit">
                  {otherProducts?.map((product: ProductProps) => (
                    <ProductCard item={product} key={product?._id} />
                  ))}
                </div>
              </div>
            </section>
          )}
      </div>
    </DashboardLayout>
  );
}

Dashboard.requireAuth = true;
export default Dashboard;
