import Niteon from "@assets/icons/Niteon-White.svg";
import { userState } from "@atoms/userState";
import MoreLinks from "@components/Footer/MoreLinks";
import Image from "next/image";
import React from "react";
import { useRecoilValue } from "recoil";
interface FooterProps {
  sellerDashboard?: boolean;
}

function Footer({ sellerDashboard }: FooterProps) {
  const sellerFooterStyle = sellerDashboard ? "z-20" : "";
  const { role } = useRecoilValue(userState);

  return (
    <footer
      className={`${sellerFooterStyle} w-full text-white min-h-[20.16rem] bg-black pt-[4.09rem] px-[1.84rem] lg:pt-[3.26rem] lg:pl-[6.82rem] lg:pr-[6.05rem] pb-[4.15rem]`}
    >
      <div className="max-w-[1400px] mx-auto">
        <span className="block relative w-[3.20rem] h-[3.20rem] mb-[1.01rem]">
          <Image
            // sizes="25vw"
            width={54}
            height={53}
            src={Niteon}
            alt="Niteon"
            // fill
            loading="lazy"
          />
        </span>
        <div className="flex items-start flex-col md:flex-row md:flex-wrap md:gap-[1.90rem] xl:justify-between xl:gap-0 space-y-[1.90rem] md:space-y-0 justify-stretch">
          <p className="text-t14 font-roboto max-w-[22rem] mb-[4.21rem] lg:mb-0">
            NITEON is a B2B marketplace focused on connecting emerging African
            businesses to the globalized world economy.
          </p>
          <MoreLinks
            heading="About NITEON"
            links={[
              {
                title:
                  role?.toLowerCase() === "seller"
                    ? "Seller Dashboard"
                    : "Become a Seller",
                link:
                  role?.toLowerCase() === "seller"
                    ? "/seller"
                    : role?.toLowerCase() === "buyer"
                    ? "/auth/seller/profile"
                    : "/auth/seller",
              },
              // { title: "Categories", link: "/categories" },
            ]}
          />
          <MoreLinks
            heading="Useful Links"
            links={[
              { title: "Privacy Policy", link: "/privacy-policy" },
              { title: "Terms and conditions", link: "/terms-of-service" },
            ]}
          />
          <MoreLinks
            heading="FAQs"
            links={[
              { title: "For Buyer", link: "/faqs/buyer" },
              { title: "For Seller", link: "/faqs/seller" },
            ]}
          />
          <MoreLinks
            heading="Contact Us"
            links={[
              { title: "care@niteon.co", email: true },
              { title: "+2348108035894", tel: true },
            ]}
          />
        </div>
        <span className="mt-[1.19rem] block text-t14 font-roboto">
          &copy; {new Date().getFullYear().toString()} NITEON all rights
          reserved
        </span>
      </div>
    </footer>
  );
}

export default Footer;
