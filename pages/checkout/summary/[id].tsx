import { useCheckout, useGetOrderSummary } from "@api/checkout";
import { SummaryState, paymentMethodState } from "@atoms/summaryState";
import OrderCardItem from "@components/Checkout/OrderCardItem";
import { PrimaryButton } from "@components/Common/Buttons";
import { Radio } from "@components/Common/Input";
import { useCalculatePrice } from "@hooks/useCalculatePrice";
import AppLayout from "@layouts/AppLayout";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { IoIosArrowForward } from "react-icons/io";
import { useRecoilState } from "recoil";
import { Order } from "types/orderReceipt";

function CheckoutSummary() {
  const [paymentMethod, setPaymentMethod] = useRecoilState(paymentMethodState);
  const [changePaymentMethod, setCPMState] = useState(true);
  const router = useRouter();
  const { calculatePrice } = useCalculatePrice();
  const [summary, setSummary] = useRecoilState(SummaryState);

  const { isFetching, isSuccess, data, isError } = useGetOrderSummary(
    summary?._id === undefined,
    (router?.query?.id as string) || "",
  );

  useEffect(() => {
    if (data?._id) {
      setSummary(data);
      // router.push("/checkout");
    }
  }, [isSuccess]);

  useEffect(() => {
    if (isError && router?.query?.id) {
      router.push("/checkout");
    }
  }, [isError]);

  const { isLoading, mutate } = useCheckout(paymentMethod);

  if (isFetching || !summary?._id) {
    return (
      <div className="grid w-full h-screen place-items-center">
        <BiLoaderAlt className="w-[2.5rem] lg:w-[3rem] h-[2.5rem] lg:h-[3rem] animate-spin text-tangerine" />
      </div>
    );
  }

  return (
    <>
      <AppLayout>
        <div className="px-[0.95rem] lg:mb-[6.34rem] lg:pl-[7.23rem] pt-[1.30rem] lg:pt-[2.79rem] lg:pr-[5.34rem]">
          <h1 className="pl-[1.30rem] pr-[0.59rem] lg:px-0 font-roboto font-medium text-black text-t20 lg:text-t24 mb-[0.95rem] lg:mb-[2.37rem]">
            Checkout Summary
          </h1>
          <section className="lg:grid max-w-full lg:grid-cols-3 lg:gap-[2.96rem]">
            <div className="w-full max-w-full lg:col-span-2">
              <div className="pl-[1.30rem] pr-[0.65rem] lg:px-0">
                <span className="flex justify-between items-center mb-[0.95rem] lg:mb-[2.37rem]">
                  <h2 className="font-medium text-black text-t18 lg:text-t20 font-roboto">
                    Delivery Address
                  </h2>
                </span>
                {/**address */}

                <div className="mb-[3.32rem]">
                  <h3 className="text-t18 lg:text-t20 font-roboto text-black lg:font-medium mb-[0.47rem] lg:mb-[0.95rem]">
                    {summary?.buyer?.buyerName}
                  </h3>
                  <div className="flex flex-col md:flex-row lg:items-center space-y-[0.47rem] md:space-y-0 text-t14 lg:text-t16 font-product_sans text-spanish_gray">
                    <span className="flex items-center">
                      <span className="inline-block pr-[1.07rem] border-r-xs py-[0.47rem] border-platinum">
                        {summary?.buyer?.shippingAddress?.address}
                      </span>
                      <span className="inline-block pl-[1.07rem] md:px-[1.07rem] py-[0.47rem] md:border-r-xs md:border-platinum">
                        {`${summary?.buyer?.shippingAddress?.state}, `}
                        {`${summary?.buyer?.shippingAddress?.country}.`}{" "}
                        {summary?.buyer?.shippingAddress?.postalCode}
                      </span>
                    </span>

                    <span className="flex items-center">
                      <span className="inline-block pr-[1.07rem] md:px-[1.07rem] py-[0.47rem] border-r-xs border-platinum">
                        {summary?.buyer?.hotline}
                      </span>
                      <span className="inline-block pl-[1.07rem] py-[0.47rem]">
                        {summary?.buyer?.email}
                      </span>
                    </span>
                  </div>
                </div>
              </div>
              <div className="pl-[1.30rem] lg:pl-0 w-full">
                <span className="pr-[1.30rem] lg:pr-0 flex items-center justify-between mb-[0.95rem] lg:mb-[2.37rem]">
                  <h4 className="font-medium text-black font-roboto text-t18 lg:text-t20">
                    Items Ordered
                  </h4>
                </span>
                <div className="w-full max-w-full">
                  <div className="max-w-full overflow-auto no-scrollbar">
                    <div className="space-y-[1.42rem]">
                      {summary?.orders?.map((order: Order) => (
                        <OrderCardItem
                          key={order?.product?.itemId}
                          data={order?.product}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              {/**payment method */}
              <div className="px-[1.30rem] lg:px-0 w-full mt-[3rem]">
                <span className="flex items-center justify-between mb-[1.07rem] lg:mb-[2.37rem]">
                  <h4 className="font-medium text-black font-roboto text-t18 lg:text-t20">
                    Payment Method
                  </h4>
                  {!changePaymentMethod && (
                    <button
                      onClick={() => {
                        setCPMState(true);
                      }}
                      className="flex items-center text-t14 lg:text-t16 font-product_sans text-tangerine"
                    >
                      <span>Change</span>
                      <IoIosArrowForward className="w-[1rem] h-[1rem]" />
                    </button>
                  )}
                </span>
                <div className="grid gap-[1.07rem] lg:gap-0 lg:grid-cols-3">
                  <span
                    style={{
                      display:
                        !changePaymentMethod && paymentMethod !== "paystack"
                          ? "none"
                          : "block",
                    }}
                    className="block space-y-[0.95rem] lg:space-y-[1.07rem]"
                  >
                    <Radio
                      label="Paystack"
                      value="paystack"
                      name="payment_method"
                      selected={paymentMethod === "paystack"}
                      handleSelect={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPaymentMethod(e.target.value)
                      }
                    />
                    <span className="block relative max-w-full w-[8.06rem] lg:w-[11.56rem] h-[2.37rem] lg:h-[3.38rem]">
                      <Image
                        fill
                        src="/images/image2.svg"
                        alt="paystack"
                        className="object-cover object-center"
                      />
                    </span>
                  </span>
                  <span
                    style={{
                      display:
                        !changePaymentMethod && paymentMethod !== "flutterwave"
                          ? "none"
                          : "block",
                    }}
                    className="block space-y-[0.95rem] lg:space-y-[1.07rem]"
                  >
                    <Radio
                      label="Flutterwave"
                      value="flutterwave"
                      name="payment_method"
                      selected={paymentMethod === "flutterwave"}
                      handleSelect={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPaymentMethod(e.target.value)
                      }
                    />
                    <span className="block relative max-w-full w-[8.06rem] lg:w-[11.56rem] h-[2.37rem] lg:h-[3.38rem]">
                      <Image
                        fill
                        src="/images/image4.svg"
                        alt="Flutterwave"
                        className="object-cover object-center"
                      />
                    </span>
                  </span>
                  <span
                    style={{
                      display:
                        !changePaymentMethod && paymentMethod !== "stripe"
                          ? "none"
                          : "block",
                    }}
                    className="block space-y-[0.95rem] lg:space-y-[1.07rem]"
                  >
                    <Radio
                      label="Stripe"
                      value="stripe"
                      name="payment_method"
                      selected={paymentMethod === "stripe"}
                      handleSelect={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPaymentMethod(e.target.value)
                      }
                    />
                    <span className="block relative max-w-full w-[8.06rem] lg:w-[10rem] h-[2.37rem] lg:h-[4rem]">
                      <Image
                        fill
                        src="/images/stripe-4.svg"
                        alt="pay later or full"
                        className="object-cover object-center"
                      />
                    </span>
                  </span>
                </div>
              </div>
            </div>

            <div className="p-[0.95rem] pt-0 my-[3rem] lg:mt-0 lg:p-[1.42rem]">
              <div>
                <h4 className="text-t18 lg:text-t20 font-roboto font-medium mb-[0.95rem]">
                  Order summary
                </h4>
                <div className="text-t16 font-product_sans text-spanish_gray space-y-[0.95rem] border-b-xs border-platinum pb-[0.95rem]">
                  <span className="flex items-center justify-between">
                    <span>Item&apos;s total</span>
                    <span>
                      {summary?.orderBreakdown?.subTotal === 0
                        ? "--"
                        : calculatePrice(
                            summary?.orderBreakdown?.currency,
                            summary?.orderBreakdown?.subTotal || 0,
                          )}
                    </span>
                  </span>
                  <span className="flex items-center justify-between">
                    <span>Delivery Fees</span>
                    <span>
                      {calculatePrice(
                        summary?.orderBreakdown?.currency,
                        summary?.orderBreakdown?.shippingFee || 0,
                      )}
                    </span>
                  </span>
                  <span className="flex items-center justify-between">
                    <span>Service Fees</span>
                    <span>
                      {calculatePrice(
                        summary?.orderBreakdown?.currency,
                        summary?.orderBreakdown?.serviceCharge || 0,
                      )}
                    </span>
                  </span>
                  <span className="flex items-center justify-between">
                    <span>VAT</span>
                    <span>
                      {summary?.orderBreakdown?.VAT === 0
                        ? "--"
                        : calculatePrice(
                            summary?.orderBreakdown?.currency,
                            summary?.orderBreakdown?.VAT || 0,
                          )}
                    </span>
                  </span>
                </div>
                <span className="text-black flex my-[0.95rem] text-t18 lg:text-t20 font-medium font-roboto justify-between items-center">
                  <h4>Total</h4>
                  <h4>
                    {summary?.orderBreakdown?.grandTotal === 0
                      ? "--"
                      : calculatePrice(
                          summary?.orderBreakdown?.currency,
                          summary?.orderBreakdown?.grandTotal || 0,
                        )}
                  </h4>
                </span>
                <span className="flex max-w-full items-center mb-[0.95rem] space-x-[1.07rem]"></span>
                <PrimaryButton
                  type="submit"
                  text={"Make Payment"}
                  className="w-full"
                  disabled={isLoading}
                  onClick={() =>
                    mutate({
                      orderSummaryId: summary?._id || "",
                      type: paymentMethod,
                    })
                  }
                />
              </div>
            </div>
          </section>
        </div>
      </AppLayout>
    </>
  );
}

CheckoutSummary.requireAuth = true;
export default CheckoutSummary;
