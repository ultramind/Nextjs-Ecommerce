import { useGetShippingClasses, useVerifyCoupon } from "@api/checkout";
import { useCreateOrder } from "@api/orders/user";
import { useGetCart } from "@api/user/cart";
import { CartState } from "@atoms/cartState";
import { SummaryState } from "@atoms/summaryState";
import { userState } from "@atoms/userState";
import CartEmpty from "@components/Cart/CartEmpty";
import ItemCard from "@components/Checkout/ItemCard";
import { PrimaryButton, SecondaryButton } from "@components/Common/Buttons";
import CustomSelect from "@components/Common/CustomSelect";
import { InputField, Radio } from "@components/Common/Input";
import PhoneNumberSelect from "@components/Common/PhoneNumberSelect";
import ReportOnCheckoutModal from "@components/Modals/ReportModal";
import { useCalculatePrice } from "@hooks/useCalculatePrice";
import AppLayout from "@layouts/AppLayout";
import { formatter } from "@utils/formatter";
import { Country, State } from "country-state-city";
import { ConnectedFocusError } from "focus-formik-error";
import { Form, Formik } from "formik";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineClose } from "react-icons/ai";
import { BiLoader, BiLoaderAlt } from "react-icons/bi";
import { IoIosArrowForward } from "react-icons/io";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { CheckoutValidationSchema } from "src/schemas/checkout";
import { CartItem } from "types/cart";
import { ShippingClass } from "types/shippingClass";

function Checkout() {
  const router = useRouter();
  // const [paymentMethod, setPaymentMethod] = useState("Paystack");
  const [changeDeliveryDetails, setCDDState] = useState(false);
  // const [changePaymentMethod, setCPMState] = useState(true);
  const [inSummary, setSummaryState] = useState(true);
  const [couponCode, setCouponCode] = useState("");
  const [shippingClassId, setShippingClassId] = useState("");
  const user = useRecoilValue(userState);

  //report modal
  const [showReportModal, setReportModalState] = useState(false);

  //weight range
  const [weightRange, setWeightRange] = useState("");

  //country, state, city
  const [countryCode, setCountryCode] = useState("");
  const [state, setState] = useState("");
  const [country, setCountry] = useState("");

  useEffect(() => {
    if (user?.address?.country) {
      setCountry(user?.address?.country);
      setState(user?.address?.state);
    }
  }, [user]);

  const { isFetching: gettingShippingClasses, data: shippingClasses } =
    useGetShippingClasses(country, state);

  const { isLoading } = useGetCart();

  const summaryState = useSetRecoilState(SummaryState);
  const { currency, calculatePriceWithoutFormatting } = useCalculatePrice();

  const [totalPrice, setTotalPrice] = useState(0);

  const [cartItemsAfterHydration, setCartItemsAfterHydration] = useState<
    CartItem[]
  >([]);

  const cartItems = useRecoilValue(CartState);

  useEffect(() => {
    if (cartItems) {
      setCartItemsAfterHydration([...cartItems]);
    }
  }, [cartItems]);

  const {
    isLoading: verifyingCoupon,
    mutate: verifyCoupon,
    data: verifiedCoupon,
    isSuccess: couponVerified,
    reset: removeCoupon,
  } = useVerifyCoupon();

  useEffect(() => {
    if (couponVerified) {
      setCouponCode("");
    }
  }, [couponVerified]);

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

  const calculateDiscountedPrice = useMemo(() => {
    if (verifiedCoupon) {
      return totalPrice * (verifiedCoupon?.discount / 100);
    }
    return 0;
  }, [verifiedCoupon, totalPrice]);

  const NextHandler = () => {
    setCDDState(false);
    setSummaryState(true);
  };

  const {
    isLoading: creatingOrder,
    mutate,
    isSuccess,
    data,
    isError,
    error,
  } = useCreateOrder();

  useEffect(() => {
    if (isSuccess && data) {
      summaryState(data);
      router.push(`/checkout/summary/${data?._id}`, undefined, {
        shallow: true,
      });
    }
  }, [isSuccess, data]);

  useEffect(() => {
    if (
      isError &&
      error?.includes("Weight bracket not found for this product")
    ) {
      const message = error?.split(":");
      setWeightRange(message[1] ?? "");
      setReportModalState(true);
    }
  }, [isError, error]);

  if (!user) {
    return (
      <div className="grid w-full h-screen place-items-center">
        <BiLoaderAlt className="w-[2.5rem] lg:w-[3rem] h-[2.5rem] lg:h-[3rem] animate-spin text-tangerine" />
      </div>
    );
  }

  return (
    <>
      <AppLayout>
        <div className="px-[0.95rem] lg:mb-[6.34rem] max-w-full lg:pl-[7.23rem] pt-[1.30rem] lg:pt-[2.79rem] lg:pr-[5.34rem]">
          <Formik
            enableReinitialize
            validateOnMount
            initialValues={{
              firstName: user?.firstName || "",
              lastName: user?.lastName || "",
              phone: user?.phoneNumber || "",
              email: user?.email || "",
              country: user?.address?.country || "",
              state: user?.address?.state || "",
              postalCode: user?.address?.postalCode || "",
              address: user?.address?.address || "",
            }}
            validationSchema={CheckoutValidationSchema}
            onSubmit={(values, { setSubmitting }) => {
              const data = {
                cart: user?.id as string,
                country: values.country,
                state: values.state,
                postalCode: values.postalCode,
                address: values.address,
                hotline: values.phone,
                email: values.email,
                coupon: verifiedCoupon?.code || "",
                classId: shippingClassId || "",
              };

              mutate(data);
              setSubmitting(false);
            }}
          >
            {({
              setFieldValue,
              setFieldError,
              handleSubmit,
              values,
              isValid,
            }) => (
              <>
                <h1 className="pl-[1.30rem] pr-[0.59rem] lg:px-0 font-roboto font-medium text-black text-t20 lg:text-t24 mb-[0.95rem] lg:mb-[2.37rem]">
                  Checkout
                </h1>
                <section className="lg:grid max-w-full lg:grid-cols-3 lg:gap-[2.96rem]">
                  {!isLoading && cartItemsAfterHydration?.length > 0 && (
                    <div className="w-full max-w-full lg:col-span-2">
                      <div className="pl-[1.30rem] pr-[0.65rem] lg:px-0">
                        <span className="flex justify-between items-center mb-[0.95rem] lg:mb-[2.37rem]">
                          <h2 className="font-medium text-black text-t18 lg:text-t20 font-roboto">
                            Delivery Address
                          </h2>
                          {changeDeliveryDetails ? (
                            <button
                              onClick={() => {
                                setCDDState(false);
                                setSummaryState(true);
                              }}
                              type="button"
                              className="flex items-center text-t14 lg:text-t16 disabled:opacity-50 font-product_sans text-tangerine"
                            >
                              <span>Save</span>

                              <IoIosArrowForward className="w-[1rem] h-[1rem]" />
                            </button>
                          ) : (
                            <span
                              onClick={() => {
                                setCDDState(true);
                                setSummaryState(false);
                              }}
                              className="flex items-center cursor-pointer text-t14 lg:text-t16 font-product_sans disabled:text-spanish_gray text-tangerine"
                            >
                              <span>Change</span>
                              <IoIosArrowForward className="w-[1rem] h-[1rem]" />
                            </span>
                          )}
                        </span>
                        {/**address */}
                        {!changeDeliveryDetails ? (
                          values?.firstName && (
                            <div className="mb-[3.32rem]">
                              <h3 className="text-t18 lg:text-t20 font-roboto text-black lg:font-medium mb-[0.47rem] lg:mb-[0.95rem]">
                                {values?.firstName} {values?.lastName}
                              </h3>
                              <div className="flex flex-col md:flex-row lg:items-center space-y-[0.47rem] md:space-y-0 text-t14 lg:text-t16 font-product_sans text-spanish_gray">
                                {values?.address && (
                                  <span className="flex items-center">
                                    <span className="inline-block pr-[1.07rem] border-r-xs py-[0.47rem] border-platinum">
                                      {values?.address}
                                    </span>
                                    <span className="inline-block pl-[1.07rem] md:px-[1.07rem] py-[0.47rem] md:border-r-xs md:border-platinum">
                                      {`${values?.state}, `}
                                      {`${values?.country}.`}{" "}
                                      {values?.postalCode}
                                    </span>
                                  </span>
                                )}
                                <span className="flex items-start">
                                  <span className="inline-block pr-[1.07rem] md:px-[1.07rem] py-[0.47rem] border-r-xs border-platinum">
                                    {values?.phone}
                                  </span>
                                  <span className="inline-block pl-[1.07rem] py-[0.47rem]">
                                    {values?.email}
                                  </span>
                                </span>
                              </div>
                            </div>
                          )
                        ) : (
                          <Form className="w-full grid lg:grid-cols-2 gap-[0.95rem] lg:gap-[1.90rem] mb-[2.25rem] lg:mb-[2.37rem]">
                            <ConnectedFocusError />
                            <InputField
                              name="firstName"
                              type="text"
                              placeholder="First Name"
                              classNameContainer="block font-product_sans font-normal text-t14"
                              className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                            />
                            <InputField
                              name="lastName"
                              type="text"
                              placeholder="Last Name"
                              classNameContainer="block font-product_sans font-normal text-t14"
                              className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                            />

                            <div>
                              <PhoneNumberSelect
                                value={values?.phone || ""}
                                inputProps={{
                                  name: "phone",
                                  placeholder: "Phone Number",
                                  required: true,
                                  className:
                                    "w-full border-platinum border-xs py-[0.9rem] outline-none placeholder:text-light_silver pl-[3rem] rounded-xs",
                                }}
                                onChange={(value) => {
                                  setFieldValue("phone", value);
                                }}
                              />
                            </div>
                            <InputField
                              name="email"
                              type="email"
                              placeholder="E-mail Address"
                              classNameContainer="block font-product_sans font-normal text-t14"
                              className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                            />
                            <CustomSelect
                              name="country"
                              placeholder="Country"
                              value={values.country}
                              classNameContainer="block font-product_sans font-normal text-t14"
                              className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                              options={Country.getAllCountries().map(
                                (country) => ({
                                  value: country.name,
                                  label: country.name,
                                  code: country.isoCode,
                                }),
                              )}
                              onChange={(value, code) => {
                                setFieldValue("country", value);
                                setCountry(value);
                                setFieldValue("state", "");
                                setState("");
                                if (code) {
                                  setCountryCode(code);
                                }
                              }}
                            />
                            <CustomSelect
                              name="state"
                              placeholder="State"
                              value={values.state}
                              classNameContainer="block font-product_sans font-normal text-t14"
                              className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                              options={State.getStatesOfCountry(
                                countryCode,
                              ).map((state) => ({
                                value: state.name,
                                label: state.name,
                                code: state.isoCode,
                              }))}
                              onChange={(value) => {
                                setFieldValue("state", value);
                                setState(value);
                              }}
                              handleOnClick={(toggleFunc) => {
                                if (!countryCode) {
                                  setFieldError(
                                    "state",
                                    "A country must be selected first",
                                  );
                                  return;
                                }
                                toggleFunc();
                              }}
                            />
                            <InputField
                              name="postalCode"
                              type="text"
                              placeholder="Postal Code"
                              classNameContainer="block font-product_sans font-normal text-t14"
                              className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                            />
                            <InputField
                              name="address"
                              type="text"
                              placeholder="Address"
                              classNameContainer="block font-product_sans font-normal text-t14"
                              className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
                            />
                          </Form>
                        )}
                      </div>
                      <div className="px-[1.30rem] lg:px-0 w-full mt-[3.68rem]">
                        <span className="flex items-center justify-between mb-[1rem]">
                          <h4 className="font-medium text-black font-roboto text-t18 lg:text-t20">
                            Choose a Shipping Type
                          </h4>
                        </span>
                        <div className="min-h-[5rem] relative">
                          <div
                            style={{
                              opacity: gettingShippingClasses ? "0.5" : "1",
                            }}
                            className="grid gap-[1.07rem] lg:gap-0 lg:grid-cols-3"
                          >
                            {shippingClasses?.length > 0 &&
                              Array.isArray(shippingClasses) &&
                              shippingClasses?.map(
                                (shippingClass: ShippingClass) => (
                                  <span
                                    className="block opacity-80"
                                    key={shippingClass?._id}
                                  >
                                    <Radio
                                      label={shippingClass?.name}
                                      value={shippingClass?._id}
                                      name="classId"
                                      selected={
                                        shippingClassId === shippingClass?._id
                                      }
                                      handleSelect={(
                                        e: React.ChangeEvent<HTMLInputElement>,
                                      ) => setShippingClassId(e.target.value)}
                                    />
                                  </span>
                                ),
                              )}
                          </div>
                          {gettingShippingClasses ? (
                            <span className="absolute top-0 left-0 flex items-center justify-center w-full h-full rounded-md">
                              <BiLoader className="block w-8 h-8 mx-auto text-tangerine animate-spin" />
                            </span>
                          ) : (shippingClasses?.length === 0 ||
                              !shippingClasses) &&
                            !country ? (
                            <p className="text-sm text-spanish_gray">
                              Please select a country and state
                            </p>
                          ) : (shippingClasses?.length === 0 ||
                              !shippingClasses) &&
                            country ? (
                            <p className="text-sm text-spanish_gray">
                              No shipping for the selected country and state
                            </p>
                          ) : (
                            <></>
                          )}
                        </div>
                      </div>
                      <div className="w-full max-w-full">
                        <span className="pl-[1.30rem] lg:pl-0 pr-[1.30rem] lg:pr-0 flex items-center justify-between mb-[0.95rem] lg:mb-[2.37rem]">
                          <h4 className="font-medium text-black font-roboto text-t18 lg:text-t20">
                            Items to be delivered
                          </h4>
                          <Link
                            href="/cart"
                            className="flex items-center text-t14 lg:text-t16 font-product_sans text-tangerine"
                          >
                            <span>Modify cart</span>
                            <IoIosArrowForward className="w-[1rem] h-[1rem]" />
                          </Link>
                        </span>

                        <div className="relative w-full max-w-full overflow-x-auto no-scrollbar">
                          <div className="flex w-fit">
                            {cartItemsAfterHydration.map((item: CartItem) => (
                              <ItemCard
                                key={item?.itemId || item?.productId}
                                data={item}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                  {isLoading && cartItemsAfterHydration?.length === 0 && (
                    <div className="w-full max-w-full col-span-2"></div>
                  )}
                  {!isLoading && cartItemsAfterHydration?.length === 0 && (
                    <div className="w-full max-w-full col-span-2">
                      <CartEmpty />
                    </div>
                  )}
                  <div className="p-[0.95rem] max-w-full pt-0 mt-[3rem] lg:mt-0 lg:p-[1.42rem]">
                    <div>
                      <h4 className="text-t18 lg:text-t20 font-roboto font-medium mb-[0.95rem]">
                        Order summary
                      </h4>
                      <div className="text-t16 font-product_sans text-spanish_gray space-y-[0.95rem] border-b-xs border-platinum pb-[0.95rem]">
                        <span className="flex items-center justify-between">
                          <span>Item&apos;s total</span>
                          <span>
                            {totalPrice === 0
                              ? "--"
                              : formatter(currency).format(totalPrice)}
                          </span>
                        </span>

                        {couponVerified && (
                          <>
                            <span className="flex items-center justify-between">
                              <span>Discount</span>
                              <span>{verifiedCoupon?.discount}%off</span>
                            </span>
                            <span className="flex items-center justify-between">
                              <span>Coupon</span>
                              <span className="flex items-center space-x-2">
                                <span>{verifiedCoupon?.code}</span>
                                <AiOutlineClose
                                  className="w-5 h-5 cursor-pointer"
                                  onClick={removeCoupon}
                                />
                              </span>
                            </span>
                          </>
                        )}

                        <p className="font-normal text-t14 lg:text-t16 font-product_sans text-spanish_gray">
                          Delivery Fees not included yet
                        </p>
                      </div>
                      <span className="text-black flex my-[0.95rem] text-t18 lg:text-t20 font-medium font-roboto justify-between items-center">
                        <h4>Total</h4>
                        <h4>
                          {totalPrice === 0 ? (
                            "--"
                          ) : couponVerified ? (
                            <>
                              <span className="inline-block line-through text-t14">
                                {formatter(currency).format(totalPrice)}
                              </span>{" "}
                              {formatter(currency).format(
                                totalPrice - calculateDiscountedPrice,
                              )}
                            </>
                          ) : (
                            formatter(currency).format(totalPrice)
                          )}
                        </h4>
                      </span>

                      <span className="flex max-w-full items-center mb-[0.95rem] space-x-[1.07rem]">
                        <input
                          type="text"
                          placeholder="COUPON CODE"
                          value={couponCode}
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            setCouponCode(e.target.value);
                          }}
                          disabled={cartItemsAfterHydration?.length === 0}
                          className="outline-none py-[1.07rem] w-full max-w-full text-center px-[0.95rem] placeholder:text-denim_blue/50 text-t14 font-product_sans rounded-xs bg-denim_blue/5"
                        />
                        <SecondaryButton
                          text="APPLY"
                          onClick={() => {
                            if (couponCode) {
                              verifyCoupon(couponCode);
                            }
                          }}
                          disabled={
                            cartItemsAfterHydration?.length === 0 ||
                            !couponCode ||
                            verifyingCoupon
                          }
                        />
                      </span>

                      <PrimaryButton
                        type="submit"
                        onClick={() => {
                          if (!isValid) {
                            setCDDState(true);
                            return;
                          }

                          if (!shippingClassId) {
                            toast.error("Please select a shipping type");
                            return;
                          }

                          if (!inSummary && isValid) {
                            NextHandler();
                            // return;
                          }

                          handleSubmit();
                        }}
                        text={"Proceed to Payment"}
                        className="w-full"
                        disabled={
                          !shippingClassId ||
                          cartItemsAfterHydration?.length === 0 ||
                          creatingOrder ||
                          isSuccess
                        }
                        style={{
                          background:
                            cartItemsAfterHydration?.length === 0
                              ? "#E6E6E6"
                              : "#F0860E",
                          opacity: creatingOrder || !shippingClassId ? 0.5 : 1,
                        }}
                      />
                    </div>
                    <span className="block mt-[4.39rem] lg:mt-[3.79rem] mb-[6.17rem] lg:mb-0">
                      <h5 className="font-medium text-black text-t18 lg:text-t20 font-roboto">
                        Privacy policy
                      </h5>
                      <p className="text-t14 lg:text-t16 font-normal font-product_sans text-spanish_gray mt-[0.95rem]">
                        Your personal data will be used to process your order,
                        support your experience throughout this website, and for
                        other purposes described in our{" "}
                        <Link href="#" className="text-denim_blue">
                          privacy policy
                        </Link>
                        .
                      </p>
                    </span>
                  </div>
                </section>
              </>
            )}
          </Formik>
        </div>
        {showReportModal ? (
          <ReportOnCheckoutModal
            modalCloseHandler={() => setReportModalState(false)}
            data={{
              username: `${user?.firstName} ${user?.lastName}`,
              email: user?.email || "",
              phoneNumber: user?.phoneNumber || "",
              country,
              state,
              classId: shippingClassId,
              weightRange,
            }}
          />
        ) : (
          <></>
        )}
      </AppLayout>
    </>
  );
}

Checkout.requireAuth = true;
export default Checkout;
