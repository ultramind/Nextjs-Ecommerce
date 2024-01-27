import LoginComponent from "@components/Auth/Login";
import AuthLayout from "@layouts/AuthLayout";
import React from "react";

function Login() {
  return (
    <AuthLayout>
      <section className="pt-[1.33rem] lg:pt-[11.28rem]">
        <div className="w-full lg:max-w-[27rem] mx-auto">
          <LoginComponent />
        </div>
      </section>
    </AuthLayout>
  );
}

export default Login;
