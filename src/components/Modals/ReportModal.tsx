import {
  useReportWeightRangeIssue,
  useReportWeightRangeIssueProps,
} from "@api/checkout";
import { PrimaryButton, SecondaryButton } from "@components/Common/Buttons";
import React, { useEffect } from "react";
import ModalContainer from "./ModalContainer";

interface Props {
  modalCloseHandler: () => void;
  data: useReportWeightRangeIssueProps;
}

function ReportOnCheckoutModal({ modalCloseHandler, data }: Props) {
  const { mutate, isLoading, isSuccess } = useReportWeightRangeIssue();

  useEffect(() => {
    if (isSuccess) modalCloseHandler();
  }, [isSuccess]);

  return (
    <ModalContainer>
      <div className="bg-white w-[19.21rem] lg:w-[28rem] max-w-full rounded-md min-h-[20rem] md:min-h-[26rem] relative left-1/2 -translate-x-1/2 top-[5.81rem] lg:top-[8rem] p-[0.85rem] pt-[2rem] lg:py-[2.5rem] lg:px-[2rem]">
        <h2 className="text-t20 lg:text-t24 mb-4 font-roboto text-black font-medium">
          Do you want to report the weight range error?
        </h2>
        <p className="text-t14 lg:text-t16 text-gray_400 mb-3">
          Reporting serves as a valuable tool for the platform&apos;s
          administrators to address issues swiftly, fostering a more reliable
          and efficient environment for all users. Therefore, reporting the
          weight range error not only benefits you but also contributes to the
          collective effort of maintaining a high standard of quality across the
          platform.
        </p>
        <span className="flex flex-col absolute w-full bottom-0 left-0 md:flex-row items-center space-y-[0.47rem] md:space-y-0 md:space-x-[0.47rem] p-[0.85rem] lg:pb-[1rem] lg:px-[2rem]">
          <SecondaryButton
            text="Cancel"
            onClick={modalCloseHandler}
            disabled={isLoading}
          />
          <PrimaryButton
            text="Report Issue"
            disabled={isLoading}
            onClick={() => mutate(data)}
          />
        </span>
      </div>
    </ModalContainer>
  );
}

export default ReportOnCheckoutModal;
