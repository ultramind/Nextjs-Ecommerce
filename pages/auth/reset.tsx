import ResetPassword from "@components/Auth/ResetPassword";
import AuthLayout from "@layouts/AuthLayout";
import React from "react";

function Reset() {
  return (
    <AuthLayout>
      <section className="pt-[1.33rem] lg:pt-[11.58rem]">
        <div className="w-full lg:max-w-[30.56rem] mx-auto">
          <ResetPassword />
        </div>
      </section>
    </AuthLayout>
  );
}

export default Reset;
