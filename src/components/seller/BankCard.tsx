import { useDeleteBank } from "@api/wallet/bank";
import AddBankInfo from "@components/Modals/AddBankInfo";
import useDisclosure from "@hooks/useDisclosure";
import React, { useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { HiOutlineDotsVertical } from "react-icons/hi";
import { BankCardProps } from "types/seller";

function BankCard({ data }: { data: BankCardProps }) {
  const { isOpen, toggleModal, modalRef } = useDisclosure();

  const [editBankInfo, showBankInfoModal] = useState(false);

  const { isLoading: deletingBank, mutate: deleteBank } = useDeleteBank(
    data?._id,
  );

  return (
    <>
      <div
        style={{
          opacity: deletingBank ? "0.5" : "1",
        }}
        className="flex justify-between px-2 md:px-7 py-6 w-full border rounded-lg"
      >
        <div>
          <p>{data?.name}</p>
          <p className="text-spanish_gray">{data?.accountName}</p>
        </div>
        <div className="flex items-center">
          <p className="font-roboto font-medium">{data?.accountNumber}</p>
          <span ref={modalRef} className="relative block">
            <HiOutlineDotsVertical
              onClick={() => toggleModal()}
              className="mt-1 cursor-pointer ml-2"
            />
            {isOpen && (
              <div className="absolute top-6 right-0 bg-white z-50 rounded-xs shadow-card p-3 space-y-1 w-[5rem] min-h-[4rem]">
                <button
                  onClick={() => showBankInfoModal(true)}
                  className="text-sm capitalize w-full text-left text-blueberry"
                >
                  Edit
                </button>
                <button
                  disabled={deletingBank}
                  onClick={() => deleteBank()}
                  className="text-sm capitalize w-full text-left text-coral_red flex items-center space-x-1"
                >
                  {deletingBank && (
                    <BiLoaderAlt className="w-[0.8rem] h-[0.8rem] animate-spin" />
                  )}
                  <span>Delete</span>
                </button>
              </div>
            )}
          </span>
        </div>
      </div>
      {editBankInfo && (
        <AddBankInfo
          edit
          bankInfo={data}
          close={() => showBankInfoModal(false)}
        />
      )}
    </>
  );
}

export default BankCard;
