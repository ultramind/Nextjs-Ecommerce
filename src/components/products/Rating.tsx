import { AiFillStar, AiOutlineStar } from "react-icons/ai";

interface RatingProps {
  filled?: number;
  unfilled?: number;
  number?: number;
}

const Rating = ({ filled = 0, unfilled = 0, number }: RatingProps) => {
  return (
    <span className="flex items-center space-x-[1.19rem]">
      <span className="flex items-center">
        {Array(filled)
          .fill("")
          .map((d, i) => (
            <AiFillStar
              key={i}
              className="w-[1.54rem] h-[1.42rem] text-sunglow"
            />
          ))}
        {Array(unfilled)
          .fill("")
          .map((d, i) => (
            <AiOutlineStar
              key={i}
              className="w-[1.54rem] h-[1.42rem] text-sunglow"
            />
          ))}
      </span>
      {number && (
        <span className="text-t16 font-roboto text-black font-normal">
          {number}
        </span>
      )}
    </span>
  );
};

export default Rating;
