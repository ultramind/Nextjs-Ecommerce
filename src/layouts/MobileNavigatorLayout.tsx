import { MobileNavigatorState } from "@atoms/mobileNavigator";
import ChooseAccountType from "@components/Auth/ChooseAccountType";
import ForgotPasswordComponent from "@components/Auth/ForgotPassword";
import LoginComponent from "@components/Auth/Login";
import ResetPassword from "@components/Auth/ResetPassword";
import VerifyOtp from "@components/Auth/VerifyOtp";
import WithModal from "@components/Auth/WithModal";
import React, { useMemo } from "react";
import { useRecoilState } from "recoil";

function MobileNavigatorLayout({ children }: { children: React.ReactNode }) {
  const [component, setComponentRoute] = useRecoilState(MobileNavigatorState);
  const Next = useMemo(() => {
    switch (component) {
      case "login":
        return <LoginComponent isFromModal={true} />;
      case "chooseAccount":
        return <ChooseAccountType isFromModal={true} />;
      case "verify":
        return <VerifyOtp isFromModal={true} />;
      case "forgotPassword":
        return <ForgotPasswordComponent isFromModal={true} />;
      case "resetPassword":
        return <ResetPassword isFromModal={true} />;
      default:
      // code block
    }
    return;
  }, [component]);
  return (
    <>
      {children}

      {component ? (
        <WithModal close={() => setComponentRoute("")}>
          <div className="lg:hidden">{Next}</div>
        </WithModal>
      ) : (
        <></>
      )}
    </>
  );
}

export default MobileNavigatorLayout;
