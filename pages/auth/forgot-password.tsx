import ForgotPasswordComponent from "@components/Auth/ForgotPassword";
import AuthLayout from "@layouts/AuthLayout";
import React from "react";

function ForgotPassword() {
  return (
    <AuthLayout>
      <section className="pt-[1.33rem] lg:pt-[14.58rem]">
        <div className="w-full lg:max-w-[27rem] mx-auto">
          <ForgotPasswordComponent />
        </div>
      </section>
    </AuthLayout>
  );
}

export default ForgotPassword;
