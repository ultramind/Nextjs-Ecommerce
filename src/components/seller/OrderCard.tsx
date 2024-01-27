import React, { useMemo } from "react";

import { useSellerCancelOrder } from "@api/orders/seller";
import { useCancelOrder } from "@api/orders/user";
import ChangeOrderStatus from "@components/Modals/ChangeOrderStatus";
import { useCalculatePrice } from "@hooks/useCalculatePrice";
import { CldImage } from "next-cloudinary";
import Link from "next/link";
import { BsImage } from "react-icons/bs";
import { OrderCardProps } from "types/index";

function OrderCard({ data, orderDetail, seller }: OrderCardProps) {
  const { _id, status, state } = data;

  const { isLoading: sellerCancelling, mutate: sellerCancel } =
    useSellerCancelOrder(data?._id);

  const { isLoading: buyerCancelling, mutate: buyerCancel } = useCancelOrder(
    data?._id,
  );

  const { calculatePrice } = useCalculatePrice();

  const infoColor = useMemo(() => {
    if (status === "pending") {
      return "text-tangerine";
    }
    if (status === "in transit" || status == "In Process") {
      return "text-[#2644AE]";
    }
    if (status === "confirmed" || status == "shipped") {
      return "text-[#06882A]";
    }
  }, [status]);

  const closedStatusColor = useMemo(() => {
    if (state === "closed" && status === "cancelled") {
      return "text-[#FF6161] bg-[#FF6161]/10";
    } else if (state === "closed" && status === "completed") {
      return "text-apple_green bg-apple_green/10";
    } else if (state === "closed" && status === "refunded") {
      return "text-black bg-[#E6E6E6]/80";
    } else {
      return "text-apple_green bg-apple_green/10";
    }
  }, [status, status]);

  const width = orderDetail
    ? "w-[322px] max-w-full md:min-w-[800px] lg:min-w-[1015px]"
    : "";
  const show = orderDetail ? "hidden" : "";
  return (
    <div
      className={`${width} flex min-h-[9.31rem] lg:min-h-[12.21rem] flex-col py-[1rem] px-[0.85rem] md:px-[1.5rem] lg:py-[1.42rem] lg:px-[2.25rem] hover:rounded-[1rem] transition-all duration-100 border-b hover:shadow-card md:gap-y-4`}
    >
      <div className="mb-[0.47rem] flex w-full flex-col space-y-2 md:flex-row md:space-y-0 md:justify-between md:items-center font-product_sans">
        <div className="flex items-center text-xs md:text-t12">
          <p className={`${closedStatusColor} py-1 md:py-2 px-4 rounded-xs`}>
            Order #{_id}
            {state === "closed" && (
              <span className="capitalize">: {status}</span>
            )}
          </p>
          <div className={`${show}`}>
            {state === "open" &&
              (!seller ||
              (data?.product?.productType === "virtual" &&
                data?.status === "confirmed") ? (
                <p className={`${infoColor} py-2 px-4 capitalize`}>{status}</p>
              ) : (
                <ChangeOrderStatus
                  id={data?._id}
                  state={data?.state}
                  status={status}
                  cancelled={
                    data?.buyerCancel ||
                    data?.sellerCancel ||
                    status?.toLowerCase() === "delivered"
                  }
                />
              ))}
          </div>
        </div>
        <div className="text-spanish text-t12 md:text-t12">
          <p>{new Date(data?.createdAt).toDateString()}</p>
        </div>
      </div>
      <div className="flex gap-x-[1rem] mb-[0.47rem]">
        <div className="relative bg-light_silver overflow-hidden h-[3.50rem] rounded-xs w-[5.22rem] md:h-[3.97rem] md:w-[5.75rem]">
          {data?.product?.productImages && data?.product?.productImages[0] ? (
            // <Image
            //   src={data?.product?.productImages[0]}
            //   alt="product image"
            //   fill
            //   loading="lazy"
            //   className="object-cover object-center"
            //   placeholder="blur"
            //   sizes="25vw"
            //   blurDataURL="data:image/webp;base64,UklGRoQCAABXRUJQVlA4WAoAAAAgAAAAagAAagAASUNDUMgBAAAAAAHIAAAAAAQwAABtbnRyUkdCIFhZWiAH4AABAAEAAAAAAABhY3NwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQAA9tYAAQAAAADTLQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAlkZXNjAAAA8AAAACRyWFlaAAABFAAAABRnWFlaAAABKAAAABRiWFlaAAABPAAAABR3dHB0AAABUAAAABRyVFJDAAABZAAAAChnVFJDAAABZAAAAChiVFJDAAABZAAAAChjcHJ0AAABjAAAADxtbHVjAAAAAAAAAAEAAAAMZW5VUwAAAAgAAAAcAHMAUgBHAEJYWVogAAAAAAAAb6IAADj1AAADkFhZWiAAAAAAAABimQAAt4UAABjaWFlaIAAAAAAAACSgAAAPhAAAts9YWVogAAAAAAAA9tYAAQAAAADTLXBhcmEAAAAAAAQAAAACZmYAAPKnAAANWQAAE9AAAApbAAAAAAAAAABtbHVjAAAAAAAAAAEAAAAMZW5VUwAAACAAAAAcAEcAbwBvAGcAbABlACAASQBuAGMALgAgADIAMAAxADZWUDgglgAAAJAHAJ0BKmsAawA+0WarUaglI6KhWAqJABoJaW7f/O9jWNRgN6sOawiza38KM5x7kI68xZBmPfKN2U+roZFHu99VY1YXAAD+7tywrOoZ0S61X8PpOoS7/jSqdI0S/lfm3ABCD6nbZ+cauOsHbWS3GltBKqUmy0hx0iYp+hD1Qux78QqmwYB21rSveo5okPq51FJQn1+AAA=="
            // />
            <CldImage
              width={97}
              height={67}
              src={data?.product?.productImages[0]}
              alt="product image"
              // fillBackground
              className="object-cover object-center"
            />
          ) : (
            <BsImage className="w-full h-full text-tangerine" />
          )}
        </div>
        <div className="flex-1">
          <div className="w-full md:mb-6">
            <div className="flex flex-col mb-2 md:flex-row md:justify-between md:items-center">
              <h3
                title={data?.product?.productName}
                className="mb-2 font-medium text-t14 font-product_sans md:text-t16 truncate-text"
              >
                {data?.product?.productName}
              </h3>
              <p className="font-medium text-t18 md:text-t20 font-roboto">
                {calculatePrice(data?.currency, data?.totalAmount)}
              </p>
            </div>
            <div className="items-center justify-between hidden md:flex text-t14 font-product_sans">
              <div className="flex gap-x-6">
                {data?.product?.size && (
                  <p className="px-2 py-1 capitalize rounded-lg bg-tangerine/20 text-tangerine">
                    Size: {data?.product?.size}
                  </p>
                )}
                <p className="px-2 py-1 rounded-lg bg-tangerine/20 text-tangerine">
                  Quantity: {data?.product?.purchaseQuantity}pcs
                </p>
                {data?.product?.color && (
                  <p
                    style={{
                      background:
                        data?.product?.color?.toLowerCase() !== "white"
                          ? data?.product?.color?.toLowerCase()
                          : "black" || "black",
                    }}
                    className="px-2 py-1 text-white capitalize rounded-lg "
                  >
                    Color: {data?.product?.color}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="items-end justify-between hidden w-full h-8 md:flex md:space-x-3">
            <div className="flex gap-6 text-spanish text-t14 font-product_sans">
              <p className="block lg:min-w-fit">
                {!seller ? (
                  <span>Seller: {data?.product?.storeName}</span>
                ) : (
                  <span>Order by: {data?.buyer?.buyerName}</span>
                )}
              </p>
              <p>
                Delivery Location: {data?.buyer?.shippingAddress?.address},{" "}
                {data?.buyer?.shippingAddress?.state},{" "}
                {data?.buyer?.shippingAddress?.country}.{" "}
                {data?.buyer?.shippingAddress?.postalCode}
              </p>
            </div>
            <div className="flex gap-x-3 text-t14">
              <div className="w-[113px]">
                <Link
                  href={
                    seller
                      ? `/seller/orders/${data?._id}`
                      : `/orders/${data?._id}`
                  }
                  className="text-white text-center font-roboto block w-full px-[0.71rem] font-medium bg-tangerine py-[0.45rem] rounded-xs"
                >
                  View Details
                </Link>
              </div>
              {state !== "closed" && (
                <>
                  {status === "pending" &&
                    ((seller && !data?.sellerCancel) ||
                      (!seller && !data?.buyerCancel)) && (
                      <div className="w-[79px]">
                        <button
                          title="Request Cancel"
                          onClick={() => {
                            if (seller) {
                              sellerCancel();
                              return;
                            }
                            buyerCancel();
                          }}
                          disabled={sellerCancelling || buyerCancelling}
                          className="text-[#F84007] border border-[#F84007] disabled:opacity-50 font-roboto w-full px-[0.71rem] font-medium bg-white py-[0.45rem] rounded-xs"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* MOBILE VIEW */}
      <div className="flex flex-col w-full h-full font-product_sans md:hidden">
        <div className="flex gap-6 text-t12 md:text-t16 text-spanish">
          <p>
            {" "}
            {!seller ? (
              <span>Seller: {data?.product?.storeName}</span>
            ) : (
              <span>Order by: {data?.buyer?.buyerName}</span>
            )}
          </p>
          <p>Delivery Location: Ikeja GRA</p>
        </div>
        <div className="flex flex-col items-center mt-3 space-y-3 md:flex-row md:space-y-0 md:justify-between">
          <div className="flex w-full text-t12 md:text-base gap-x-4">
            {data?.product?.size && (
              <p className="px-2 py-1 capitalize border rounded-lg bg-tangerine/20 text-tangerine">
                Size: {data?.product?.size}
              </p>
            )}
            <p className="px-2 py-1 rounded-lg bg-tangerine/20 text-tangerine">
              Quantity: {data?.product?.purchaseQuantity}pcs
            </p>
            {data?.product?.color && (
              <p
                style={{
                  background:
                    data?.product?.color?.toLowerCase() !== "white"
                      ? data?.product?.color?.toLowerCase()
                      : "black" || "black",
                }}
                className="px-2 py-1 text-white capitalize rounded-lg "
              >
                Color: {data?.product?.color}
              </p>
            )}
          </div>
          <div className="flex w-full ml-auto mr-0 gap-x-3 text-t12 md:text-base md:w-fit">
            <div className="w-full">
              <Link
                href={
                  seller
                    ? `/seller/orders/${data?._id}`
                    : `/orders/${data?._id}`
                }
                className="text-white text-center whitespace-nowrap font-roboto block w-full px-[0.71rem] font-medium bg-tangerine py-[0.5rem] rounded-xs"
              >
                View Details
              </Link>
            </div>
            {state !== "closed" && (
              <>
                {status === "pending" &&
                  ((seller && !data?.sellerCancel) ||
                    (!seller && !data?.buyerCancel)) && (
                    <div className="w-full">
                      <button
                        title="Request Cancel"
                        onClick={() => {
                          if (seller) {
                            sellerCancel();
                            return;
                          }
                          buyerCancel();
                        }}
                        disabled={sellerCancelling || buyerCancelling}
                        className="text-[#F84007] border border-[#F84007] disabled:opacity-50 font-roboto w-full px-[0.71rem] font-medium bg-white py-[0.5rem] rounded-xs"
                      >
                        Cancel
                      </button>
                    </div>
                  )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrderCard;
