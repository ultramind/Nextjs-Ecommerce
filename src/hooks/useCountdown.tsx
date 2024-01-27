import { useEffect, useState } from "react";

const useCountdown = () => {
  const [countdown, setCountdown] = useState(60);

  useEffect(() => {
    if (countdown > 0) {
      const interval = setInterval(() => {
        setCountdown((prevCountdown) => prevCountdown - 1);
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [countdown]);

  if (countdown !== 0 && countdown < 10)
    return { countdown: `0${countdown}`, setCountdown };
  return { countdown, setCountdown };
};

export default useCountdown;
