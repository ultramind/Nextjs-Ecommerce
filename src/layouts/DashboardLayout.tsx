import { userState } from "@atoms/userState";
import Sidebar from "@components/Common/Sidebar";
import { BiLoaderAlt } from "react-icons/bi";
import { useRecoilValue } from "recoil";
import AppLayout from "./AppLayout";

const sidebarLinks = [
  {
    linkName: "Wishlist",
    href: "/dashboard",
  },
  {
    linkName: "Downloads",
    href: "/downloads",
  },
  {
    linkName: "My Orders",
    href: "/orders",
  },
  {
    linkName: "Profile",
    href: "/profile",
  },
];

interface LayoutProps {
  children: React.ReactNode;
}

function DashboardLayout({ children }: LayoutProps) {
  const user = useRecoilValue(userState);

  if (!user?.id)
    return (
      <div className="grid w-full h-screen place-items-center">
        <BiLoaderAlt className="w-[2.5rem] lg:w-[3rem] h-[2.5rem] lg:h-[3rem] animate-spin text-tangerine" />
      </div>
    );

  return (
    <AppLayout>
      <div className="relative min-h-screen lg:pl-[5rem] 1xl:pl-[7rem] lg:grid lg:grid-cols-[auto,1fr]">
        <div className="lg:h-screen pb-[1.01rem] lg:pb-0 w-full overflow-auto no-scrollbar whitespace-nowrap bg-white px-[0.83rem] lg:px-0 fixed bottom-0 lg:bottom-[none] lg:sticky lg:top-24 lg:w-auto lg:pr-[2.91rem] block z-20 lg:pt-[3.32rem] lg:border-r lg:border-platinum">
          <Sidebar
            Links={sidebarLinks}
            className="flex flex-row bg-white lg:flex-col text-t16 text-spanish_gray"
          />
        </div>
        <div className="lg:pl-[2rem] w-full px-[0.5rem] lg:pt-[3.32rem] overflow-hidden">
          {children}
        </div>
      </div>
    </AppLayout>
  );
}

export default DashboardLayout;
