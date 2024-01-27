import OrderCardItem from "@components/Checkout/OrderCardItem";
import { PrimaryButton } from "@components/Common/Buttons";
import { useCalculatePrice } from "@hooks/useCalculatePrice";
import moment from "moment";
import React, { useRef } from "react";
import { BsArrowRight } from "react-icons/bs";
import { useReactToPrint } from "react-to-print";
import { Root } from "types/orderReceipt";

interface Props {
  close: () => void;
  data: Partial<Root>;
}

function OrderReceipt({ close, data }: Props) {
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const { calculatePrice } = useCalculatePrice();

  return (
    <div className="bg-white w-full lg:w-[40rem] pt-[1rem] lg:pt-[3.20rem] max-w-full z-10 relative">
      <span className="block w-full lg:px-[3.32rem]">
        <button
          onClick={close}
          className="flex items-center ml-auto mr-0 space-x-2 underline transition-colors duration-100 hover:text-tangerine text-t14 w-fit"
        >
          <span>Go to orders</span>
          <BsArrowRight />
        </button>
      </span>
      <div
        className="mt-[1.5rem] px-[1.5rem] lg:px-[3.5rem]"
        ref={componentRef}
      >
        <h3 className="font-medium text-t24 font-roboto">Order Receipt</h3>
        <span className="flex items-center justify-between mt-[0.5rem]">
          <span className="text-center text-t14 font-product_sans text-granite_gray">
            {moment().format("LLLL")}
          </span>
          {/* <span className="block py-[0.47rem] px-[0.95rem] bg-honey_dew text-t12 font-product_sans text-north_texas_green rounded-xs mt-[0.47rem]">
              Order #167834
            </span> */}
        </span>
        <div className="mt-[2rem]">
          <h3 className="text-t18 lg:text-t20 mb-[0.95rem] font-roboto font-medium">
            Items Ordered
          </h3>
          <div className="space-y-[1.42rem]">
            {data?.orders?.map((order) => (
              <OrderCardItem
                key={order?.product?.itemId}
                data={order?.product}
              />
            ))}
          </div>
        </div>
        <div className="mt-[2.37rem]">
          <h4 className="text-t18 lg:text-t20 font-roboto font-medium mb-[0.95rem]">
            Order breakdown
          </h4>
          <div className="text-t16 font-product_sans text-spanish_gray space-y-[0.95rem] border-b-xs border-platinum pb-[0.95rem]">
            <span className="flex items-center justify-between">
              <span>Item&apos;s total</span>
              <span>
                {calculatePrice(data?.orderBreakdown?.currency || "NGN", data?.orderBreakdown?.subTotal || 0)}
              </span>
            </span>
            <span className="flex items-center justify-between">
              <span>Delivery Fees</span>
              <span>
                {calculatePrice(data?.orderBreakdown?.currency || "NGN", data?.orderBreakdown?.shippingFee || 0)}
              </span>
            </span>
            <span className="flex items-center justify-between">
              <span>Service Fees</span>
              <span>
                {calculatePrice(
                  data?.orderBreakdown?.currency || "NGN",
                  data?.orderBreakdown?.serviceCharge || 0,
                )}
              </span>
            </span>
            <span className="flex items-center justify-between">
              <span>VAT</span>
              <span>
                {calculatePrice(data?.orderBreakdown?.currency || "NGN", data?.orderBreakdown?.VAT || 0)}
              </span>
            </span>
          </div>
          <span className="text-black flex mt-[0.95rem] mb-[0.95rem] lg:mb-[2.37rem] text-t18 lg:text-t20 font-medium font-roboto justify-between items-center">
            <h4>Total</h4>
            <h4>
              {calculatePrice(data?.orderBreakdown?.currency || "NGN", data?.orderBreakdown?.grandTotal || 0)}
            </h4>
          </span>
        </div>
      </div>
      <span className="block pb-[0.71rem] lg:pb-[3.20rem] lg:px-[3.32rem]">
        <PrimaryButton text="Share" className="w-full" onClick={handlePrint} />
      </span>
    </div>
  );
}

export default OrderReceipt;
