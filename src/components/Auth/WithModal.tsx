import React from "react";
import { IoIosClose } from "react-icons/io";

function WithModal({
  children,
  close,
}: {
  children: React.ReactNode;
  close: () => void;
}) {
  return (
    <>
      <span className="fixed top-0 left-0 z-50 block w-screen h-screen lg:hidden bg-cetacean_blue/40"></span>
      <div className="fixed w-screen z-[60] h-fit max-h-[30rem] overflow-auto no-scrollbar bottom-0 left-0 lg:hidden bg-white px-[0.89rem] lg:px-0 pt-[1.17rem] lg:pt-0 rounded-tl-[1.78rem] rounded-tr-[1.78rem] lg:rounded-none pb-[1.33rem] lg:pb-[5.50rem]">
        <IoIosClose
          role="button"
          onClick={close}
          className="block mr-0 ml-auto w-[1.5rem] h-[1.5rem] mb-[0.44rem] cursor-pointer lg:hidden"
        />
        {children}
      </div>
    </>
  );
}

export default WithModal;
