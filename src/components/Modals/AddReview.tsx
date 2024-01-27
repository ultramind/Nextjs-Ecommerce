import { useSendReview } from "@api/product";
import { PrimaryButton } from "@components/Common/Buttons";
import { InputField, TextArea } from "@components/Common/Input";
import Rate from "@components/products/Rate";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { IoIosClose } from "react-icons/io";
import { addReviewValidationSchema } from "src/schemas/addReview";
import ModalContainer from "./ModalContainer";

function AddReview({ close }: { close: () => void }) {
  const router = useRouter();
  const [rating, setRating] = useState<number[]>([]);
  const { isLoading, mutate, isSuccess } = useSendReview(
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
        className="block absolute top-0 z-30 left-0 w-screen h-screen cursor-pointer"
      ></span>
      <div className="bg-white w-[19.21rem] rounded-md lg:w-[25.7rem] max-w-full min-h-[25.02rem] z-50 relative left-1/2 -translate-x-1/2 top-[5.81rem] lg:top-1/2 lg:-translate-y-1/2 lg:absolute px-[1rem] py-[1.5rem] lg:py-[3.20rem] lg:px-[3.32rem]">
        <IoIosClose
          size={32}
          role="button"
          onClick={close}
          className="absolute top-2 right-3 lg:right-[1.5rem] lg:top-[1.42rem]"
        />
        <h2 className="text-t20 text-center lg:text-t24 font-roboto text-black font-medium mb-[1.90rem]">
          Add a Review
        </h2>
        <Rate rating={rating} setRating={setRating} />
        <Formik
          initialValues={{
            title: "",
            comment: "",
          }}
          validationSchema={addReviewValidationSchema}
          onSubmit={(values, { setSubmitting }) => {
            mutate({
              ...values,
              productRating: rating.length,
              productId: router?.query?.slug as string,
            });
            setSubmitting(false);
          }}
        >
          {({ isValid }) => (
            <Form className="mt-[1.90rem]">
              <InputField
                name="title"
                type="text"
                placeholder="Add a Title"
                classNameContainer="block font-product_sans font-normal text-t14 mb-[0.95rem]"
                className="w-full border-platinum border-xs pt-4 outline-none pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs"
              />
              <TextArea
                name="comment"
                placeholder="Review Comment"
                classNameContainer="block font-product_sans font-normal text-t14 mb-[1.90rem]"
                className="w-full border-platinum border-xs pt-4 outline-none min-h-[9.60rem] lg:pb-[1.17rem] placeholder:text-light_silver pl-[1.50rem] rounded-xs lg:min-h-[7rem] resize-none"
              />

              <PrimaryButton
                disabled={isLoading || !isValid || rating.length === 0}
                text="Submit Review"
                type="submit"
              />
            </Form>
          )}
        </Formik>
      </div>
    </ModalContainer>
  );
}

export default AddReview;
