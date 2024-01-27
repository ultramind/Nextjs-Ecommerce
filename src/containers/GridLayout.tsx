// import Link from "next/link";
import React, { useEffect } from "react";
import { Events, Link, scrollSpy } from "react-scroll";

interface GridLayoutProps {
  tabs: string[];
  heading: string;
  // contents: ContentProps[];
  children: React.ReactNode;
}

function GridLayout({ tabs, heading, children }: GridLayoutProps) {
  useEffect(() => {
    // Registering the 'begin' event and logging it to the console when triggered.
    Events.scrollEvent.register("begin", () => {
      //   console.log("begin", to, element);
    });

    // Registering the 'end' event and logging it to the console when triggered.
    Events.scrollEvent.register("end", () => {
      //   console.log("end", to, element);
    });

    // Updating scrollSpy when the component mounts.
    scrollSpy.update();

    // Returning a cleanup function to remove the registered events when the component unmounts.
    return () => {
      Events.scrollEvent.remove("begin");
      Events.scrollEvent.remove("end");
    };
  }, []);

  return (
    <div className="pt-[2rem] lg:pt-[4.06rem] relative pl-[1.25rem] lg:pl-[6.5rem] pr-[1.69rem] lg:pr-[8rem]">
      <h1 className="font-roboto mb-[2rem] lg:mb-[3.75rem] font-extrabold lg:font-semibold text-t20 lg:text-t32 lg:text-[3.5rem] text-tangerine">
        {heading}
      </h1>
      <div className="grid lg:grid-cols-[13rem,1fr] relative gap-[1.56rem] mb-12">
        <ul className="text-t14 self-start lg:text-[1rem] leading-normal lg:sticky lg:pb-[10rem] lg:h-screen lg:overflow-auto bg-white lg:top-32 font-product_sans text-spanish_gray">
          {tabs.map((tab, index) => (
            <li
              key={tab}
              className="block border-b-[0.5px] border-[#D6D6D6] first:pt-0 py-[1rem]"
            >
              <Link
                to={`${index}`}
                spy={true}
                smooth={true}
                offset={-130}
                isDynamic
                duration={100}
                activeClass="text-tangerine"
                className="cursor-pointer"
              >
                {tab}
              </Link>
            </li>
          ))}
        </ul>
        <main className="space-y-[3.7rem] pb-[10.38rem] overflow-y-scroll no-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}

export default GridLayout;
