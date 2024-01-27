import AddReply from "@components/Modals/AddReply";
import React, { useState } from "react";
import { ReviewProps } from "types/product";
import Rating from "./Rating";

function ReviewCard({
  review,
  owner,
}: {
  review: ReviewProps;
  owner?: boolean;
}) {
  const [showingReply, setSellerReply] = useState(false);
  const [replyComment, setReplyComment] = useState(false);

  return (
    <>
      <div>
        <h4 className="text-t18 lg:text-t20 font-roboto font-medium text-black">
          {review?.title || review?._id}
        </h4>
        <span className="flex items-center mt-[0.24rem] space-x-[0.95rem]">
          <span className="text-tangerine font-product_sans text-t14 font-normal first-letter:capitalize">
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
        {owner && !review?.sellerReply && (
          <button
            type="button"
            onClick={() => setReplyComment(true)}
            className="mt-[1rem] font-medium font-product_sans text-[0.875rem] underline leading-[1.25rem] text-blueberry"
          >
            Reply
          </button>
        )}
        {review?.sellerReply &&
          (showingReply ? (
            <span className="block w-full bg-[#F7F7FC] py-[0.5625rem] px-[0.625rem] mt-[1rem]">
              <p className="text-spanish_gray text-[1rem] text-justify font-product_sans mb-[1rem]">
                {review?.sellerReply}
              </p>
              <button
                type="button"
                onClick={() => setSellerReply(false)}
                className="font-medium font-product_sans text-[0.875rem] underline leading-[1.25rem] text-blueberry"
              >
                hide vendor&apos;s reply
              </button>
            </span>
          ) : (
            <button
              type="button"
              onClick={() => setSellerReply(true)}
              className="font-medium font-product_sans text-[0.875rem] mt-[1rem] underline leading-[1.25rem] text-blueberry"
            >
              show 1 reply from vendor
            </button>
          ))}
      </div>
      {replyComment && (
        <AddReply review={review} close={() => setReplyComment(false)} />
      )}
    </>
  );
}

export default ReviewCard;
