import React from "react";

function ModalContainer({
  children,
}: {
  children: JSX.Element | JSX.Element[];
}) {
  return (
    <div className="fixed top-0 left-0 z-50 w-screen overflow-auto no-scrollbar h-screen bg-cetacean_blue/40">
      <div className="pb-32 relative h-full">{children}</div>
    </div>
  );
}

export default ModalContainer;
