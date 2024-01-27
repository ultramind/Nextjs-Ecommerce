import { useEffect, useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const Star = ({
  id,
  rating,
  setRating,
}: {
  id: number;
  setRating: any;
  rating: number[];
}) => {
  const [clicked, setClicked] = useState(false);

  useEffect(() => {
    const res = rating.includes(id);
    if (res) {
      setClicked(true);
    } else {
      setClicked(false);
    }
  }, [rating, clicked]);

  const handleSelect = () => {
    const rate = [];
    setClicked(true);

    for (let i = id; i > 0; i--) {
      rate.push(i);
    }
    setRating([...rate]);
  };

  const handleUnSelect = () => {
    setClicked(false);
    const unRate = [...rating].reverse();
    const startIndex = unRate.indexOf(id);
    if (startIndex !== -1) {
      // Remove the numbers from the array
      unRate.splice(startIndex);
    }

    setRating([...unRate]);
  };

  return clicked ? (
    <AiFillStar
      onClick={handleUnSelect}
      role="button"
      className="rating_star active_star w-[2.08rem] h-[1.90rem] text-sunglow"
    />
  ) : (
    <AiOutlineStar
      onClick={handleSelect}
      role="button"
      className="rating_star w-[2.08rem] h-[1.90rem] text-sunglow"
    />
  );
};

const Rate = ({
  rating,
  setRating,
}: {
  rating: number[];
  setRating: React.Dispatch<React.SetStateAction<number[]>>;
}) => {
  // console.log(rating);
  return (
    <span className="flex items-center w-fit mx-auto">
      {Array(5)
        .fill("")
        .map((d, i) => (
          <Star id={i + 1} key={i} rating={rating} setRating={setRating} />
        ))}
    </span>
  );
};

export default Rate;
