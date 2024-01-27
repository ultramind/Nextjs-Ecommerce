import { useGetUser } from "@api/authentication";
import UnverifiedIllustration from "@assets/illustrations/unverified.svg";
import { sellerBusinessState } from "@atoms/seller/business";
import { PrimaryButton } from "@components/Common/Buttons";
import AppLayout from "@layouts/AppLayout";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { useRecoilValue } from "recoil";

function Unverified() {
  const router = useRouter();
  useGetUser();

  const business = useRecoilValue(sellerBusinessState);

  useEffect(() => {
    if (business && business?.adminAction === "approved") {
      router.push("/seller/");
      return;
    }
    if (business && business?.adminAction === "disapproved") {
      router.push("/unverified");
      return;
    }
  }, [business]);

  return (
    <AppLayout>
      <div className="min-h-screen pt-[7.19rem] pb-[20rem] px-[0.95rem]">
        <div className="max-w-[26.9rem] mx-auto">
          <span className="block w-fit mx-auto relative max-w-full mb-[0.95rem]">
            <Image
              src={UnverifiedIllustration}
              alt="unverified"
              //   width={500}
              //   height={500}
            />
          </span>
          <p className="text-center mx-auto lg:max-w-full font-product_sans text-spanish_gray text-t14 lg:text-t16 mb-[1.90rem] lg:mb-[0.95rem]">
            Your profile is being reviewed by the admin and you will be notified
            when it has been approved.
          </p>
          <span className="lg:max-w-[18.20rem] block mx-auto">
            <PrimaryButton
              text="Return to Shop"
              onClick={() => router.push("/shop")}
            />
          </span>
        </div>
      </div>
    </AppLayout>
  );
}

export default Unverified;
