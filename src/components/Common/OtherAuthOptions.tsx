import { useGoogle } from "@api/authentication";
import React from "react";
// import { FaFacebook } from "react-icons/fa";
import { useGoogleLogin } from "@react-oauth/google";
import toast from "react-hot-toast";
import { FcGoogle } from "react-icons/fc";

function OtherAuthOptions({ className }: React.ComponentProps<"div">) {
  const { mutate } = useGoogle();

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      mutate({ code: tokenResponse.code });
    },
    onError: (err) => {
      toast.error(err.error_description as string);
    },
    flow: "auth-code",
    ux_mode: "popup",
    select_account: true,
  });
  return (
    <div className={className}>
      <fieldset className="block w-full mb-4 font-normal text-center border-t font-product_sans text-dark_charcoal text-t12 lg:text-t14 border-platinum">
        <legend className="px-4">Or continue using</legend>
      </fieldset>
      {/* max-w-[6.5rem] lg:max-w-[11.2rem]  */}
      <div className="flex items-center justify-between mx-auto w-fit">
        <button
          name="google"
          aria-label="signin with google"
          onClick={() => login()}
          className="grid place-content-center border-xs border-platinum py-[0.75rem] lg:py-[1.33rem] px-4 lg:px-[1.78rem] rounded-xs"
        >
          <FcGoogle className="w-5 h-5 lg:w-6 lg:h-6" />
        </button>
        {/* <button
          name="facebook"
          aria-label="signin with facebook"
          className="grid place-content-center border-xs border-platinum py-[0.67rem] lg:py-[1.33rem] px-4 lg:px-[1.78rem] rounded-xs"
        >
          <FaFacebook className="text-[#1877F2] w-4 h-4 lg:w-6 lg:h-6" />
        </button> */}
      </div>
    </div>
  );
}

export default OtherAuthOptions;
