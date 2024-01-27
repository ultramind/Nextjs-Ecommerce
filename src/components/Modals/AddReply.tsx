import { useSendComment } from "@api/product";
import { sellerBusinessState } from "@atoms/seller/business";
import { PrimaryButton } from "@components/Common/Buttons";
import { TextArea } from "@components/Common/Input";
import Rating from "@components/products/Rating";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import { IoIosClose } from "react-icons/io";
import { useRecoilValue } from "recoil";
import { replyValidationSchema } from "src/schemas/addReview";
import { ReviewProps } from "types/product";
import ModalContainer from "./ModalContainer";

function AddReply({
  review,
  close,
}: {
  close: () => void;
  review: ReviewProps;
}) {
  const router = useRouter();
  const data = useRecoilValue(sellerBusinessState);

  const { isLoading, mutate, isSuccess } = useSendComment(
    data?._id as string,
    router?.query?.slug as string,
  );

  useEffect(() => {
    if (isSuccess) {
      close();
    }
  }, [isSuccess]);

  return (
    <ModalContainer>
      <span
        onClick={close}
        className="absolute top-0 left-0 z-30 block w-screen h-screen cursor-pointer"
      ></span>
      <div className="bg-white w-[19.21rem] lg:w-[28.7rem] max-w-full min-h-[25.02rem] z-50 relative left-1/2 -translate-x-1/2 top-[5.81rem] lg:top-1/2 lg:-translate-y-1/2 lg:absolute p-[0.71rem] lg:py-[3.20rem] lg:px-[3.32rem]">
        <IoIosClose
          size={32}
          role="button"
          onClick={close}
          className="absolute top-2 right-3 lg:right-[1.5rem] lg:top-[1.42rem]"
        />
        <h2 className="text-t20 text-center lg:text-t24 font-roboto text-black font-medium mb-[1.90rem]">
          Reply Comment
        </h2>
        <div className="my-[2rem]">
          <h4 className="font-medium text-black text-t18 lg:text-t20 font-roboto">
            {review?.title || review?._id}
          </h4>
          <span className="flex items-center mt-[0.24rem] space-x-[0.95rem]">
            <span className="font-normal text-tangerine font-product_sans text-t14 first-letter:capitalize">
              {review?.username || review?.userId}
            </span>
            <Rating
              filled={review?.productRating}
              unfilled={5 - review?.productRating}
            />
          </span>
          <p className="text-justify font-product_sans font-normal text-t14 lg:text-t16 text-spanish_gray mt-[0.95rem]">
            {review?.comment}
          </p>
        </div>
        <Formik
          initialValues={{
            reply: "",
          }}
          validationSchema={replyValidationSchema}
          onSubmit={(values, { setSubmitting }) => {
            mutate({
              reply: values.reply,
              reviewId: review?._id,
            });
            setSubmitting(false);
          }}
        >
          {({ isValid }) => (
            <Form>
              <TextArea
                name="reply"
                placeholder="Type your response here"
                classNameContainer="block font-product_sans font-normal text-t14 mb-[2rem]"
                className="w-full border-platinum border-xs pt-4 outline-none min-h-[9.60rem] lg:pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs lg:min-h-[7rem] resize-none"
              />

              <PrimaryButton
                disabled={isLoading || !isValid}
                text="Post Reply"
                type="submit"
              />
            </Form>
          )}
        </Formik>
      </div>
    </ModalContainer>
  );
}

export default AddReply;
