import ChooseAccountType from "@components/Auth/ChooseAccountType";
import AuthLayout from "@layouts/AuthLayout";
import React from "react";

function Account() {
  return (
    <AuthLayout>
      <section className="pt-[1.33rem] lg:pt-[11.28rem]">
        <div className="w-full lg:max-w-[30.56rem] mx-auto">
          <ChooseAccountType />
        </div>
      </section>
    </AuthLayout>
  );
}

export default Account;
