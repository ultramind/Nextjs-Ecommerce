import { useGetUserBusiness } from "@api/seller";
import { AuthState } from "@atoms/authenticationState";
import { sellerBusinessState } from "@atoms/seller/business";
import { userState } from "@atoms/userState";
import Sidebar from "@components/Common/Sidebar";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { useRecoilValue, useSetRecoilState } from "recoil";
import AppLayout from "./AppLayout";

interface SellerLayoutProps {
  children: React.ReactNode;
}

const sidebarLinks = [
  {
    linkName: "Dashboard",
    href: "/seller",
  },
  {
    linkName: "Products",
    href: "/seller/products",
  },
  {
    linkName: "Orders",
    href: "/seller/orders",
  },
  {
    linkName: "Wallet",
    href: "/seller/wallet",
  },
  {
    linkName: "Profile",
    href: "/seller/profile",
  },
];

function SellerLayout({ children }: SellerLayoutProps) {
  const { role } = useRecoilValue(userState);
  const { data: business, isError } = useGetUserBusiness();
  const setSellerBusiness = useSetRecoilState(sellerBusinessState);
  const { isLoggedIn } = useRecoilValue(AuthState);

  useEffect(() => {
    if (
      business &&
      business?.adminAction === "pending" &&
      isLoggedIn &&
      role === "seller"
    ) {
      router.push("/unverified");
      return;
    }

    if (
      business &&
      business?.adminAction === "disapproved" &&
      isLoggedIn &&
      role === "seller"
    ) {
      router.push("/blocked");
      return;
    }
  }, [business]);

  useEffect(() => {
    if (business) {
      setSellerBusiness(business);
    }
  }, [business]);

  const data = useRecoilValue(sellerBusinessState);
  const router = useRouter();

  useEffect(() => {
    if (role === "buyer" || isError) {
      router.push("/dashboard");
    }
  }, [role, isError]);

  if (
    role === "buyer" ||
    business?.adminAction === "pending" ||
    business?.adminAction === "disapproved" ||
    !isLoggedIn
  ) {
    return (
      <div className="grid w-full h-screen place-items-center">
        <BiLoaderAlt className="w-[2.5rem] lg:w-[3rem] h-[2.5rem] lg:h-[3rem] animate-spin text-tangerine" />
      </div>
    );
  }

  return (
    <AppLayout>
      <div className="relative min-h-screen lg:pl-[5rem] 1xl:pl-[7.17rem] lg:grid lg:grid-cols-[auto,1fr] pb-16 lg:pr-[2.33rem]">
        <div className="lg:h-screen pb-[1.01rem] lg:pb-0 w-full overflow-auto no-scrollbar whitespace-nowrap bg-white px-[0.83rem] lg:px-0 fixed bottom-0 lg:bottom-[none] lg:sticky lg:top-24 lg:w-auto lg:pr-[2.91rem] block z-20 lg:pt-[3.32rem] lg:border-r lg:border-platinum">
          <Sidebar
            Links={sidebarLinks}
            className="flex flex-row bg-white lg:flex-col text-t16 text-spanish_gray"
          />
        </div>
        <div className="w-full lg:pt-[3.32rem] px-[0.5rem] lg:pl-[2rem]">
          {!data ? (
            <BiLoaderAlt className="w-5 h-5 m-auto lg:w-8 lg:h-8 animate-spin text-tangerine" />
          ) : (
            children
          )}
        </div>
      </div>
    </AppLayout>
  );
}
export default SellerLayout;
