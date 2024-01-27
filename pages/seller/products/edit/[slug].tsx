import { useGetUser } from "@api/authentication";
import { useGetProduct, useGetUserBusiness } from "@api/seller";
import getBusiness from "@api/services/getBusiness";
import { getSellerProduct } from "@api/services/seller";
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
import { NextSeo } from "next-seo";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiLoaderAlt } from "react-icons/bi";
import { MdKeyboardArrowLeft } from "react-icons/md";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";

function EditProduct() {
  const router = useRouter();
  const { isLoggedIn } = useRecoilValue(AuthState);
  const { data: business } = useGetUserBusiness();
  const { role } = useRecoilValue(userState);

  useEffect(() => {
    if (
      business &&
      business?.adminAction === "pending" &&
      isLoggedIn &&
      role === "seller"
    ) {
      router.push("/unverified");
      return;
    }

    if (
      business &&
      isLoggedIn &&
      role === "seller" &&
      business?.adminAction === "disapproved"
    ) {
      router.push("/blocked");
      return;
    }
  }, [business]);

  const [productType, setProductType] = useRecoilState(productTypeState);
  const [showModal, setShowModal] = useState(false);
  const displayModal = showModal ? "block" : "hidden";

  const setUser = useSetRecoilState(userState);
  const setAuth = useSetRecoilState(AuthState);
  const { data } = useGetUser();

  useEffect(() => {
    if (data?.isVerified) {
      setUser(data);
      setAuth({ isLoggedIn: true, emailVerified: true });
    }
  }, [data]);

  const { data: product } = useGetProduct(router?.query?.slug as string);

  if (!product) {
    return (
      <div className="grid w-full h-screen place-items-center">
        <BiLoaderAlt className="w-[2.5rem] lg:w-[3rem] h-[2.5rem] lg:h-[3rem] animate-spin text-tangerine" />
      </div>
    );
  }

  return (
    <>
      <NextSeo title={product?.name} description={product?.description} />
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
          {productType !== "" && (
            <h1 className="text-2xl font-medium text-center">
              Edit {product?.name}
            </h1>
          )}

          {/* FORMS */}
          <div className="max-w-[27.375rem] px-4 lg:px-0 mx-auto mt-[2.13rem]">
            <CreateProductForm setShowModal={setShowModal} edit />
          </div>
        </section>

        <div
          className={`${displayModal} fixed px-[26px] top-0 left-0 w-full h-screen bg-black/30 z-40 flex justify-center items-center`}
        >
          <div className="w-full flex flex-col font-roboto justify-center items-center max-w-[34.375rem] bg-white rounded-md px-14 py-[3.38rem]">
            <div className="relative w-[7.5rem] h-[6.75rem] md:w-[15.063rem] md:h-[13.5rem]">
              <Image src={SuccessImage} alt="Successful" fill />
            </div>
            <h3 className="pb-4 mt-6 text-2xl font-medium">Success!</h3>
            <p className="pb-8 text-sm text-center text-spanish_gray md:text-base">
              You have successfully updated this product.
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

EditProduct.requireAuth = true;
export default EditProduct;

export const runtime = "experimental-edge";

export const getServerSideProps: GetServerSideProps = async ({
  params,
  req,
}) => {
  const token = req.cookies.access_token as string;
  const queryClient = new QueryClient();

  if (token) {
    const business = await queryClient.fetchQuery(["getUserBusiness"], () =>
      getBusiness(token),
    );

    console.log({ token });

    console.log({ business });

    if (!business) {
      queryClient.invalidateQueries(["getUserBusiness"]);
      return {
        redirect: {
          destination: "/",
          permanent: false,
        },
      };
    }

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

    const slug = params?.slug;
    await queryClient.prefetchQuery(["getBusinessProduct", slug], () =>
      getSellerProduct(token, slug as string),
    );
  } else {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: { dehydratedState: dehydrate(queryClient) } };
};
