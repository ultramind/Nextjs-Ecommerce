import { PrimaryButton } from "@components/Common/Buttons";
import { BalanceCard } from "@components/seller/SummaryCard";
import SellerLayout from "@layouts/SellerLayout";
import React, { useState } from "react";
import { useGetWallet } from "@api/wallet";
import { useGetBanks } from "@api/wallet/bank";
import { useGetTransactions } from "@api/wallet/transaction";
import Pagination from "@components/Common/Pagination";
import AddBankInfo from "@components/Modals/AddBankInfo";
import WithdrawalModal from "@components/Modals/WithdrawalModal";
import BankCard from "@components/seller/BankCard";
import TransactionHistory from "@components/seller/tables/TransactionHistory";
import { useCalculatePrice } from "@hooks/useCalculatePrice";
import useDisclosure from "@hooks/useDisclosure";
import toast from "react-hot-toast";
import { BsPlus } from "react-icons/bs";
import { IoIosClose } from "react-icons/io";
import { BankCardProps } from "types/seller";
import { TransactionProps } from "types/transaction";

function Wallet() {
  const { toggleModal, isOpen: modalShown, modalRef } = useDisclosure();
  const { data: banks, isLoading } = useGetBanks();
  //add bank info
  const [addBankInfo, setAddBankInfo] = useState(false);

  const { rates } = useCalculatePrice();
  const NGN_exchange_rate = rates?.NGN || 1;

  const { data } = useGetWallet();

  const { data: transactions } = useGetTransactions();

  return (
    <SellerLayout>
      <section className="flex flex-col gap-5 font-product_sans pr-[1.11rem]">
        {/* INTRO */}
        <div className="flex items-center justify-between pl-4 mt-8 lg:mt-0 mb-11">
          <div>
            <p className="mb-2 text-sm text-ash">Hi, Seller</p>
            <h2 className="font-medium">Wallet</h2>
          </div>
          <div className="block min-w-[183px]">
            <PrimaryButton
              text="Withdraw Money"
              onClick={() => {
                if (banks?.length === 0) {
                  toast.error("Please add a bank info");
                  return;
                }
                toggleModal();
              }}
              disabled={data?.available === 0}
            />
          </div>
        </div>

        {/* BALANCE CARDS */}
        <div className="pl-4 -mt-10 md:mt-0">
          <div className="grid w-full gap-x-[0.95rem] gap-y-[1.20rem]  xs:grid-cols-[200px, 3fr] md:grid-cols-3">
            <BalanceCard
              title="Total Wallet Balance"
              amount={data?.available || 0}
              dropDown
              rate={NGN_exchange_rate || 0}
            />
            <div className="hidden md:block">
              <BalanceCard
                title="USD Balance"
                amount={data?.available / NGN_exchange_rate}
                currencyX={"USD"}
                subtitle="USD"
              />
            </div>
            <div className="hidden md:block">
              <BalanceCard
                title="NGN Balance"
                amount={data?.available || 0}
                subtitle="NGN"
              />
            </div>

            <div className="flex justify-between gap-5 md:hidden">
              <BalanceCard
                title="USD Balance"
                amount={data?.available / NGN_exchange_rate || 0}
                currencyX={"USD"}
              />
              <BalanceCard title="NGN Balance" amount={data?.available || 0} />
            </div>
          </div>
          {/* <div className="md:hidden max-w-[190px] ml-auto my-6">
            <PrimaryButton
              text="Withdraw Money"
              disabled={data?.available === 0}
              onClick={toggleModal}
            />
          </div> */}
        </div>

        <div className="w-full min-h-[150px] pl-4 mt-6">
          <div className="flex items-center justify-between w-full">
            <h2 className="font-medium text-t20 font-roboto">Bank Info</h2>
            <button
              onClick={() => setAddBankInfo(true)}
              className="flex items-center text-tangerine"
            >
              <BsPlus className="inline-block text-tangerine" size={20} />
              <span>Add</span>
            </button>
          </div>

          {((Array.isArray(banks) && banks.length === 0) ||
            typeof banks === "string") && (
            <p className="mt-3 text-sm text-granite_gray">No bank info</p>
          )}
          {Array.isArray(banks) && banks?.length > 0 && (
            <div className="w-full grid mt-10 md:grid-cols-2 text-sm md:text-base gap-y-4 gap-x-10 min-h-[86px]">
              {banks.map((bank: BankCardProps) => (
                <BankCard key={bank?._id} data={bank} />
              ))}
            </div>
          )}
        </div>

        {/* TRANSACTION TABLES */}
        <div className="pl-4 mt-12">
          <h2 className="text-xl font-semibold">Transaction History</h2>
          {Array.isArray(transactions?.data) && transactions?.data ? (
            <TransactionHistory
              data={transactions?.data as TransactionProps[]}
            />
          ) : (
            <p className="mt-3 text-sm text-granite_gray">
              No transaction history
            </p>
          )}
        </div>
        {transactions?.data?.totalPages > 1 && (
          <div className="mx-auto w-fit lg:mr-0 lg:ml-auto">
            <Pagination
              currentPage={transactions?.data?.currentPage}
              totalPages={transactions?.data?.totalPages}
            />
          </div>
        )}
      </section>

      {/* MODAL */}
      {modalShown && (
        <div className="fixed top-0 px-4 left-0 w-full h-screen bg-black/30 z-[100] flex justify-center items-center">
          <div
            ref={modalRef}
            className="w-full relative flex flex-col gap-y-[2rem] max-w-[34.75rem] bg-white rounded-md px-6 py-8 md:px-14 md:py-[3.38rem]"
          >
            <IoIosClose
              size={32}
              role="button"
              onClick={() => toggleModal()}
              className="absolute top-2 right-3 lg:right-[1.5rem] lg:top-[1.42rem]"
            />
            <h2 className="text-2xl font-medium text-center font-roboto">
              Withdrawal Money
            </h2>
            <WithdrawalModal
              closeModal={toggleModal}
              banks={banks}
              gettingBanks={isLoading}
            />
          </div>
        </div>
      )}
      {addBankInfo && <AddBankInfo close={() => setAddBankInfo(false)} />}
    </SellerLayout>
  );
}

Wallet.requireAuth = true;
export default Wallet;
