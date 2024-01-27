import { useSellerCancelOrder, useUpdateOrder } from "@api/orders/seller";
import { useCancelOrder } from "@api/orders/user";
import { DangerButton, PrimaryButton } from "@components/Common/Buttons";
import ProductImages from "@components/products/Details/ProductImages";
import Rating from "@components/products/Rating";
import { useCalculatePrice } from "@hooks/useCalculatePrice";
import React from "react";
import { OrderItem } from "types/order";

function ProductDetails({
  data,
  fromSeller,
}: {
  data: OrderItem;
  fromSeller?: boolean;
}) {
  const { isLoading, mutate } = useUpdateOrder(data?._id);

  const { isLoading: sellerCancelling, mutate: sellerCancel } =
    useSellerCancelOrder(data?._id);

  const { isLoading: buyerCancelling, mutate: buyerCancel } = useCancelOrder(
    data?._id,
  );

  const { calculatePrice } = useCalculatePrice();

  return (
    <div className="grid max-w-full gap-[2.02rem] lg:grid-cols-2 lg:min-h-[25.38rem] lg:gap-[1.5rem] mb-[3.56rem]">
      <div className="h-full max-w-full overflow-hidden">
        <ProductImages product={data?.product} fromOrder={true} />
      </div>
      <div className="max-w-[33.02rem]">
        <span className="hidden lg:flex items-center space-x-[0.95rem] mb-[0.95rem]">
          <span className="hidden px-4 py-2 text-xs rounded-lg bg-apple_green/10 lg:block text-apple_green w-fit">
            Order #{data?._id}
          </span>
          <span className="block px-[0.5rem] capitalize py-[0.47rem] text-tangerine text-t12 font-product_sans">
            {data?.status}
          </span>
        </span>
        <span className="block lg:max-w-[29rem]">
          <h1 className="text-black text-t20 lg:text-t32 font-roboto">
            {data?.product?.productName}
          </h1>
          <span className="flex items-center my-[0.95rem] space-x-[1.19rem]">
            <Rating
              filled={Math.round(data?.product?.rating?.averageRating || 0)}
              unfilled={
                5 - Math.round(data?.product?.rating?.averageRating || 0)
              }
            />
            <span className="text-granite_gray font-product_sans text-t14">
              (
              <span className="underline underline-offset-4">
                {data?.product?.rating?.totalReview || 0} verified rating
                {data?.product?.rating?.totalReview > 1 ? "s" : ""}
              </span>
              )
            </span>
          </span>
          <p className="truncate text-spanish_gray text-t14 lg:text-t16 font-product_sans">
            {data?.product?.description}
          </p>
        </span>
        <span className="flex items-end justify-between mt-[1.42rem] mb-[2.37rem] space-x-3 lg:my-[1.90rem]">
          <span className="flex items-end font-medium text-black font-roboto">
            <h4 className="text-t24 lg:text-[1.7rem]">
              {calculatePrice(
                data?.product?.currency,
                data?.product?.pricePerUnit,
              )}
            </h4>
            {data?.product?.pricePerUnit && (
              <span className="text-t16">/piece</span>
            )}
          </span>
          <span className="hidden lg:flex w-full md:w-auto items-center justify-between md:justify-normal md:space-x-[0.75rem]">
            {data?.product?.size && (
              <span className="grid place-content-center border border-platinum text-tangerine text-t12 lg:text-t14 font-product_sans rounded-xs bg-tangerine/10 py-[0.24rem] px-[0.47rem]">
                Size: {data?.product?.size}
              </span>
            )}
            <span className="grid place-content-center border border-platinum text-tangerine text-t12 lg:text-t14 font-product_sans rounded-xs bg-tangerine/10 py-[0.24rem] px-[0.47rem]">
              Quantity: {data?.product?.purchaseQuantity}pcs
            </span>
            {data?.product?.size && (
              <span
                style={{
                  background:
                    data?.product?.color?.toLowerCase() !== "white"
                      ? data?.product?.color?.toLowerCase()
                      : "black" || "black",
                }}
                className="grid place-content-center border border-white text-white text-t12 lg:text-t14 font-product_sans rounded-xs py-[0.24rem] px-[0.47rem]"
              >
                Color: {data?.product?.color}
              </span>
            )}
          </span>
        </span>
        <div className="mt-[2.37rem]">
          <h4 className="text-t18 lg:text-t20 font-roboto font-medium mb-[0.95rem]">
            Order breakdown
          </h4>
          <div className="text-t16 font-product_sans text-spanish_gray space-y-[0.95rem] border-b-xs border-platinum pb-[0.95rem]">
            <span className="flex items-center justify-between">
              <span>Item&apos;s total</span>
              <span>
                {calculatePrice(
                  data?.product?.currency,
                  data?.product?.purchaseAmount,
                )}
              </span>
            </span>
            <span className="flex items-center justify-between">
              <span>Shipping Fee</span>
              <span>
                {calculatePrice(
                  data?.product?.currency,
                  data?.product?.shippingFee,
                )}
              </span>
            </span>
            <span className="flex items-center justify-between">
              <span>Service Fee</span>
              <span>
                {calculatePrice(
                  data?.product?.currency,
                  data?.product?.serviceCharge,
                )}
              </span>
            </span>
            <span className="flex items-center justify-between">
              <span>VAT</span>
              <span>
                {calculatePrice(data?.product?.currency, data?.product?.VAT)}
              </span>
            </span>
          </div>
          <span className="text-black flex mt-[0.95rem] text-t18 lg:text-t20 font-medium font-roboto justify-between items-center">
            <h4>Total</h4>
            <h4>{calculatePrice(data?.currency, data?.totalAmount)}</h4>
          </span>
        </div>
        {data?.state !== "closed" && (
          <div className="flex gap-x-8 mt-[2.37rem] mb-[2.5rem] lg:gap-x-2 w-full justify-between">
            {data?.status === "pending" &&
              ((fromSeller && !data?.sellerCancel) ||
                (!fromSeller && !data?.buyerCancel)) && (
                <div className="w-full">
                  <DangerButton
                    onClick={() => {
                      if (fromSeller) {
                        sellerCancel();
                        return;
                      }
                      buyerCancel();
                    }}
                    disabled={sellerCancelling || buyerCancelling || isLoading}
                    text="Request Cancel"
                  />
                </div>
              )}
            {fromSeller &&
              data?.status !== "confirmed" &&
              !data?.buyerCancel &&
              !data?.sellerCancel && (
                <div className="w-full">
                  <PrimaryButton
                    disabled={isLoading || sellerCancelling}
                    text="Confirm Order"
                    onClick={() =>
                      mutate({ status: "confirmed", state: data?.state })
                    }
                  />
                </div>
              )}
          </div>
        )}
      </div>
    </div>
  );
}

export default ProductDetails;
