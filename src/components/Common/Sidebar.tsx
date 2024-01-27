import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";

interface SideBarProps {
  Links: { linkName: string; href: string }[];
  className?: string;
}

function Sidebar({
  Links,
  className = "hidden md:flex flex-col h-screen flex-initial shadow bg-white min-w-[14rem] pt-24 md:pt-36 px-8",
}: SideBarProps) {
  const { pathname } = useRouter();
  return (
    <div className={className}>
      {Links.map((link) => (
        <Link
          key={link.linkName}
          href={link.href}
          className={`pt-[1rem] px-[1rem] pb-[0.47rem] lg:py-[1rem] lg:first-of-type:pt-0 lg:last-of-type:pb-0 ${
            pathname === link.href
              ? "border-b-tangerine lg:border-b-transparent lg:border-l-tangerine text-tangerine"
              : "border-b-gray-[#F5F5F5] lg:border-b-transparent lg:border-l-gray-[#F5F5F5]"
          } border-b-2 lg:border-b-0 lg:border-l-2 flex-1 w-auto lg:px-[14px] text-center lg:text-left`}
        >
          {link.linkName}
        </Link>
      ))}
    </div>
  );
}

export default Sidebar;
