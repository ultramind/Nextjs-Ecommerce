import Isolation from "@assets/illustrations/Isolation_Mode.svg";
import Isolation2 from "@assets/illustrations/Isolation_Mode2.svg";
import { PrimaryButton } from "@components/Common/Buttons";
import Footer from "@components/Common/Footer";
import Navbar from "@components/Common/Navbar";
import Image from "next/image";
import { useRouter } from "next/router";
import React from "react";

function Not_found() {
  const router = useRouter();
  return (
    <div>
      <span className="max-w-[1440px] sticky top-0 z-50 mx-auto block pl-[1.39rem] pr-[1.11rem] lg:pl-[3.89rem] lg:pr-[2.33rem] lg:py-[0.2rem] bg-white">
        <Navbar />
      </span>
      <main className="w-full relative min-h-screen max-w-[1440px] mx-auto">
        <div className="lg:absolute top-0 left-0 w-full">
          <Image src={Isolation} alt="not found" className="hidden lg:block" />
          <Image src={Isolation2} alt="not found" className="block lg:hidden" />
        </div>
        <div className="px-[0.95rem] lg:px-0 lg:max-w-[25.49rem] mt-[2.61rem] lg:mt-0 lg:pt-[13.64rem] lg:mx-auto text-center">
          <h1 className="text-t24 lg:text-t40 font-medium lg:font-semibold mb-[0.95rem] text-black font-roboto">
            404 Error
          </h1>
          <p className="max-w-[17.19rem] mx-auto lg:max-w-full font-product_sans text-spanish_gray text-t14 lg:text-t16 mb-[1.90rem] lg:mb-[0.95rem]">
            The page you&apos;re looking for cannot be found, or does not exist.
          </p>
          <span className="lg:max-w-[18.20rem] mx-auto block">
            <PrimaryButton
              text="Return to Shop"
              onClick={() => router.push("/shop")}
            />
          </span>
        </div>
      </main>
      <div className="hidden lg:block">
        <Footer />
      </div>
    </div>
  );
}

export default Not_found;
