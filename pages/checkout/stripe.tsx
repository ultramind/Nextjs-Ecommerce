import { paymentOptions } from "@atoms/summaryState";
import { CheckoutElement } from "@components/Checkout/StripeCheckoutForm";
import { Elements } from "@stripe/react-stripe-js";
import { Stripe, loadStripe } from "@stripe/stripe-js";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { useRecoilValue } from "recoil";

// Make sure to call `loadStripe` outside of a component’s render to avoid
// recreating the `Stripe` object on every render.
const stripe_promise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLIC_ID as string,
);

function StripePage() {
  const { id, client_secret } = useRecoilValue(paymentOptions);
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [stripePromise, setStripePromise] =
    useState<Promise<Stripe | null> | null>(null);

  useEffect(() => {
    if (!id && !client_secret) {
      router.push("/checkout");
    } else {
      setClientSecret(client_secret);
      setStripePromise(stripe_promise);
    }
  }, [id, client_secret]);

  if (!stripePromise && !clientSecret) {
    return (
      <div className="grid w-full h-screen place-items-center">
        <BiLoaderAlt className="w-[2.5rem] lg:w-[3rem] h-[2.5rem] lg:h-[3rem] animate-spin text-tangerine" />
      </div>
    );
  }

  return (
    <div className="p-[2rem] h-screen">
      <Link href="/" className="block w-fit">
        <Image
          src="/niteon.svg"
          width={100}
          height={100}
          alt="niteon"
          priority
        />
      </Link>
      <div className="max-w-xl mx-auto my-4">
        <span className="block relative max-w-full mx-auto mb-10 w-[10rem] lg:w-[13rem] h-[3rem] lg:h-[5rem]">
          <Image
            fill
            src="/images/stripe-4.svg"
            alt="pay later or full"
            className="object-cover object-center"
          />
        </span>
        {stripePromise && clientSecret && (
          <Elements
            stripe={stripePromise}
            options={{
              clientSecret,
              appearance: { theme: "stripe" },
            }}
          >
            <CheckoutElement />
          </Elements>
        )}
      </div>
    </div>
  );
}

StripePage.requireAuth = true;
export default StripePage;
