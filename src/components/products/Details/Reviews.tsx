import React from "react";
import { ReviewProps } from "types/product";
import Rating from "../Rating";
import ReviewCard from "../ReviewCard";
import { useRecoilValue } from "recoil";
import { userState } from "@atoms/userState";

function Reviews({
  addReview,
  totalReview,
  reviews,
  fromSeller,
  ownerId,
}: {
  addReview?: () => void;
  totalReview?: number;
  reviews: ReviewProps[];
  fromSeller?: boolean;
  ownerId?: string;
}) {
  const { id } = useRecoilValue(userState);

  let one = false;
  let two = false;
  let three = false;
  let four = false;
  let five = false;

  if (reviews?.length > 0) {
    one =
      reviews?.filter((review) => review?.productRating === 1)?.length > 0
        ? true
        : false;
    two =
      reviews?.filter((review) => review?.productRating === 2)?.length > 0
        ? true
        : false;
    three =
      reviews?.filter((review) => review?.productRating === 3)?.length > 0
        ? true
        : false;
    four =
      reviews?.filter((review) => review?.productRating === 4)?.length > 0
        ? true
        : false;
    five =
      reviews?.filter((review) => review?.productRating === 5)?.length > 0
        ? true
        : false;
  }

  return (
    <section className="px-[0.95rem] lg:pl-[7.23rem] lg:pr-[5.51rem] mb-[4.98rem]">
      <h3 className="text-black font-roboto text-t18 lg:text-t24 font-medium mb-[1.90rem]">
        Reviews
      </h3>
      <div className="grid lg:grid-cols-[9.43rem,1fr] gap-[1.90rem] lg:gap-[2.37rem]">
        <div>
          {reviews?.length > 0 && (
            <h5 className="text-black text-t20 font-roboto font-medium mb-[0.47rem]">
              {totalReview}
            </h5>
          )}
          <div className="space-y-[0.47rem]">
            <Rating filled={five ? 5 : 0} unfilled={five ? 0 : 5} number={5} />
            <Rating filled={four ? 5 : 0} unfilled={four ? 0 : 5} number={4} />
            <Rating
              filled={three ? 5 : 0}
              unfilled={three ? 0 : 5}
              number={3}
            />
            <Rating filled={two ? 5 : 0} unfilled={two ? 0 : 5} number={2} />
            <Rating filled={one ? 5 : 0} unfilled={one ? 0 : 5} number={1} />
          </div>
          {!fromSeller && (
            <button
              onClick={addReview}
              aria-label="add review"
              className="text-t16 lg:text-t18 font-product_sans font-medium underline underline-offset-4 mt-[1.42rem] text-blueberry"
            >
              Add a review
            </button>
          )}
        </div>
        {reviews.length > 0 ? (
          <div className="grid lg:grid-cols-2 gap-[1.90rem] xl:max-w-[63.5rem] lg:gap-x-[1.96rem] lg:gap-y-[4.03rem]">
            {reviews.map((review: ReviewProps) => (
              <ReviewCard
                key={review?._id}
                review={review}
                owner={id === ownerId && id !== null}
              />
            ))}
          </div>
        ) : (
          <p className="text-t12 lg:text-t14 text-spanish_gray">
            No review available
          </p>
        )}
      </div>
    </section>
  );
}

export default Reviews;
