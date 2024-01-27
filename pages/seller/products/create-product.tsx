import { useGetUser } from "@api/authentication";
import { useGetUserBusiness } from "@api/seller";
import getBusiness from "@api/services/getBusiness";
import SuccessImage from "@assets/illustrations/Success.svg";
import { AuthState } from "@atoms/authenticationState";
import { productTypeState } from "@atoms/productTypeState";
import { userState } from "@atoms/userState";
import { PrimaryButton } from "@components/Common/Buttons";
import Footer from "@components/Common/Footer";
import Navbar from "@components/Common/Navbar";
import CreateProductForm from "@components/seller/forms/CreateProductForm";
import { QueryClient, dehydrate } from "@tanstack/react-query";
import { GetServerSideProps } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useRecoilValue, useSetRecoilState } from "recoil";

function CreateProduct() {
  const router = useRouter();
  const productType = useRecoilValue(productTypeState);
  const setProductType = useSetRecoilState(productTypeState);
  const [showModal, setShowModal] = useState(false);
  const displayModal = showModal ? "block" : "hidden";
  const { role } = useRecoilValue(userState);

  const setUser = useSetRecoilState(userState);
  const setAuth = useSetRecoilState(AuthState);
  const { data } = useGetUser();
  const { isLoggedIn } = useRecoilValue(AuthState);
  const { data: business } = useGetUserBusiness();

  useEffect(() => {
    if (
      business &&
      business?.adminAction === "pending" &&
      isLoggedIn &&
      role === "seller"
    ) {
      router.push("/unverified");
    }
  }, [business]);

  useEffect(() => {
    if (data?.isVerified) {
      setUser(data);
      setAuth({ isLoggedIn: true, emailVerified: true });
    }
  }, [data]);

  if (!data) {
    return (
      <div className="grid w-full h-screen place-items-center">
        <BiLoaderAlt className="w-[2.5rem] lg:w-[3rem] h-[2.5rem] lg:h-[3rem] animate-spin text-tangerine" />
      </div>
    );
  }

  return (
    <>
      <main
        className={`${
          showModal ? "overflow-y-hidden" : "overflow-y-auto"
        } w-full min-h-screen`}
      >
        <div className="px-4 lg:px-8">
          <Navbar />
        </div>
        <section className="mt-[44px] pb-[3.75rem]">
          <Link
            href={`/seller/products`}
            className="hidden lg:flex text-sm ml-[127px] items-center"
          >
            <span className="text-[32px] mt-1">
              <MdKeyboardArrowLeft />
            </span>
            Back to Products
          </Link>
          <h1 className="text-2xl font-medium text-center">
            Create a new {productType.toLocaleLowerCase()} product
          </h1>

          {/* FORMS */}
          <div className="max-w-[27.375rem] px-4 lg:px-0 mx-auto mt-[2.13rem]">
            <CreateProductForm setShowModal={setShowModal} />
          </div>
        </section>

        <div
          className={`${displayModal} fixed px-[26px] top-0 left-0 w-full h-screen bg-black/30 z-50 flex justify-center items-center`}
        >
          <div className="w-full flex flex-col font-roboto justify-center items-center max-w-[34.375rem] bg-white rounded-md px-14 py-[3.38rem]">
            <div className="relative w-[7.5rem] h-[6.75rem] md:w-[15.063rem] md:h-[13.5rem]">
              <Image src={SuccessImage} alt="Successful" fill />
            </div>
            <h3 className="pb-4 mt-6 text-2xl font-medium">Success!</h3>
            <p className="pb-8 text-sm text-center text-spanish_gray md:text-base">
              You have successfully created a new product.
            </p>
            <PrimaryButton
              text="Proceed to Products"
              onClick={() => {
                setProductType("");
                router.push("/seller/products");
              }}
            />
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}

CreateProduct.requireAuth = true;
export default CreateProduct;

export const runtime = "experimental-edge";

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const token = req.cookies.access_token as string;
  const queryClient = new QueryClient();

  const business = await queryClient.fetchQuery(["getUserBusiness"], () =>
    getBusiness(token),
  );

  // if (!business) {
  //   queryClient.invalidateQueries(["getUserBusiness"]);
  //   return {
  //     redirect: {
  //       destination: "/",
  //       permanent: false,
  //     },
  //   };
  // }

  if (business?.adminAction === "pending") {
    return {
      redirect: {
        destination: "/unverified",
        permanent: false,
      },
    };
  }

  if (business?.adminAction === "disapproved") {
    return {
      redirect: {
        destination: "/blocked",
        permanent: false,
      },
    };
  }

  return { props: { dehydratedState: dehydrate(queryClient) } };
};
