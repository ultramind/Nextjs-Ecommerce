import { paymentOptions } from "@atoms/summaryState";
import { PrimaryButton } from "@components/Common/Buttons";
import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRecoilValue } from "recoil";

export const CheckoutElement = () => {
  const stripe = useStripe();
  const elements = useElements();
  const { client_secret: clientSecret, id } = useRecoilValue(paymentOptions);
  const [isLoading, setLoadingState] = useState(false);
  const [loadingPaymentComponent, setPaymentComponentLoadingState] =
    useState(true);

  const handleSubmit = async (event: React.ChangeEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (elements == null) {
      return;
    }

    // Trigger form validation and wallet collection
    const { error: submitError } = await elements.submit();
    if (submitError) {
      // Show error to your customer
      toast.error(submitError?.message as string);
      return;
    }

    if (stripe) {
      setLoadingState(true);
      const { error } = await stripe.confirmPayment({
        //`Elements` instance that was used to create the Payment Element
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${
            window.location.origin ?? ""
          }/checkout/receipt?payment_id=${id}`,
        },
      });

      if (error) {
        // This point will only be reached if there is an immediate error when
        // confirming the payment. Show error to your customer (for example, payment
        // details incomplete)
        toast.error(error?.message || "");
        setLoadingState(false);
      } else {
        // Your customer will be redirected to your `return_url`. For some payment
        // methods like iDEAL, your customer will be redirected to an intermediate
        // site first to authorize the payment, then redirected to the `return_url`.
      }
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <PaymentElement onReady={() => setPaymentComponentLoadingState(false)} />
      {loadingPaymentComponent && (
        <div className="bg-american_silver w-full h-52 rounded-md animate-pulse shadow-card"></div>
      )}
      {!loadingPaymentComponent && (
        <PrimaryButton
          text="Pay"
          disabled={!stripe || !elements || isLoading}
          style={{
            marginTop: "2rem",
          }}
        />
      )}
    </form>
  );
};
