import { useUpdateOrder } from "@api/orders/seller";
import React, { useMemo, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { MdKeyboardArrowDown, MdKeyboardArrowUp } from "react-icons/md";

interface ChangeOrderStatusProps {
  status: string;
  id: string;
  state: string;
  cancelled: boolean;
}

function ChangeOrderStatus({
  id,
  status,
  state,
  cancelled,
}: ChangeOrderStatusProps) {
  const [show, setShowState] = useState(false);
  const [orderState, setOrderStatus] = useState(status);

  const { isLoading, mutate } = useUpdateOrder(id);

  const getColor = (status: string) => {
    if (status == "pending") {
      return "text-tangerine";
    }
    if (status == "transit") {
      return "text-[#F0860E]";
    }
    if (status == "processing") {
      return "text-[#2644AE]";
    }
    if (
      status == "confirmed" ||
      status == "shipped" ||
      status === "delivered"
    ) {
      return "text-[#06882A]";
    }
  };

  const statuses = useMemo(() => {
    if (status == "confirmed") return ["processing"];
    return ["pending", "confirmed"];
  }, [status]);

  return (
    <div className="relative">
      <button
        onClick={() => {
          if (cancelled) {
            return;
          }
          setShowState(!show);
        }}
        disabled={isLoading}
        className={`${getColor(
          orderState,
        )} flex items-center py-2 px-4 capitalize`}
      >
        {isLoading && (
          <BiLoaderAlt className="w-[0.8rem] h-[0.8rem] mr-[0.45rem] animate-spin" />
        )}
        {orderState}
        {!cancelled && (
          <span className="inline">
            {!show ? (
              <MdKeyboardArrowDown className="ml-1" />
            ) : (
              <MdKeyboardArrowUp className="ml-1" />
            )}
          </span>
        )}
      </button>
      <div
        className={`${
          show ? "w-24 h-auto rounded-md shadow-card bg-white p-3" : "w-0 h-0"
        } overflow-hidden transition-all duration-100 absolute top-7 left-4`}
      >
        {statuses.map((d) => (
          <button
            onClick={() => {
              if (cancelled) {
                return;
              }
              setOrderStatus(d);
              setShowState(false);
              mutate({ state: state, status: orderState });
            }}
            disabled={isLoading}
            key={d}
            className={`${getColor(d)} flex items-center py-2 capitalize`}
          >
            {d}
          </button>
        ))}
      </div>
    </div>
  );
}

export default ChangeOrderStatus;
