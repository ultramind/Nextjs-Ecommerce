import VerifyOtp from '@components/Auth/VerifyOtp';
import AuthLayout from '@layouts/AuthLayout';
import React from 'react';

function Verify() {
  return (
    <AuthLayout>
      <section className="w-full pt-[1.33rem] lg:pt-[13.89rem]">
        <VerifyOtp />
      </section>

      {/* <section className="pt-[1.33rem] lg:pt-[13.89rem]">
        <div className="w-full lg:max-w-[30.56rem] mx-auto">
          <VerifyOtpWithModal />
        </div>
      </section> */}
    </AuthLayout>
  );
}

export default Verify;
