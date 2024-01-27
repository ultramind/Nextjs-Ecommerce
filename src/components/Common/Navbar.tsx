import { useLogout } from "@api/authentication";
import CartIcon from "@assets/icons/Cart.svg";
import CartIcon2 from "@assets/icons/Cart2.svg";
import Niteon from "@assets/icons/Niteon.svg";
// import Niteon from "@assets/images/niteon-logo.png";
import { AuthState } from "@atoms/authenticationState";
import { CartState } from "@atoms/cartState";
import { MobileNavigatorState } from "@atoms/mobileNavigator";
import { userState } from "@atoms/userState";
import { PrimaryButton } from "@components/Common/Buttons";
import useDisclosure from "@hooks/useDisclosure";
import Image from "next/image";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { BiMenu, BiSolidUser } from "react-icons/bi";
import { IoIosClose } from "react-icons/io";
import {
  MdOutlineKeyboardArrowDown,
  MdOutlineKeyboardArrowUp,
} from "react-icons/md";
import { useRecoilValue, useSetRecoilState } from "recoil";
import NavLink from "./NavLink";
import SearchField from "./SearchField";

interface MobileMenuProps {
  close: () => void;
  state: boolean;
  isLoading: boolean;
  Logout: () => void;
}

const MobileMenu = ({ close, state, isLoading, Logout }: MobileMenuProps) => {
  const { isLoggedIn } = useRecoilValue(AuthState);
  const { role, profilePicture } = useRecoilValue(userState);
  const setMobileNavigatorComponent = useSetRecoilState(MobileNavigatorState);
  const { pathname } = useRouter();
  const isActive = (href: string) => pathname.startsWith(href);

  const {
    isOpen: sellerDropdownOpened,
    toggleModal: setSellerDropdownState,
    modalRef,
  } = useDisclosure();

  const {
    isOpen: isModalOpened,
    toggleModal: toggleModalState,
    modalRef: modalRef2,
  } = useDisclosure();

  const [cartLength, setCartLength] = useState(0);

  const cartItems = useRecoilValue(CartState);

  useEffect(() => {
    if (cartItems) {
      setCartLength(+cartItems?.length);
    }
  }, [cartItems]);

  return (
    <div
      className={`${
        state ? "translate-x-0" : "-translate-x-[100%]"
      } transition-all duration-200 fixed lg:hidden top-0 left-0 z-50 w-screen h-screen bg-cetacean_blue/40`}
    >
      <div className="bg-white w-[14.82rem] max-w-full overflow-auto no-scrollbar h-full pt-[1rem]">
        <IoIosClose
          onClick={close}
          role="button"
          size={32}
          className="block mr-[0.75rem] ml-auto mb-[1.5rem] text-tangerine cursor-pointer"
        />
        <span className="block">
          <NavLink
            href="/cart"
            className="flex items-center space-x-[0.44rem] pl-[1.06rem] pb-[1.33rem] border-b-xs border-platinum"
          >
            <Image
              src={isActive("/cart") ? CartIcon : CartIcon2}
              alt="cart icon"
              sizes="25vw"
            />
            <span className="relative font-normal text-product_sans text-t16 placeholder:font-normal text-spanish">
              Cart
              <span className="absolute font-medium -top-[0.35rem] -right-[0.67rem] h-[0.77rem] w-[0.77rem] grid place-content-center text-[0.5rem] rounded-full font-product_sans text-white bg-tangerine">
                {cartLength}
              </span>
            </span>
          </NavLink>

          {isLoggedIn ? (
            <>
              {role?.toLowerCase() !== "seller" ? (
                <NavLink
                  href="/auth/seller/profile"
                  className="block text-t16 font-product_sans text-spanish pl-[1.06rem] py-[1.33rem] border-b-xs border-platinum"
                >
                  Become a Seller
                </NavLink>
              ) : (
                role && (
                  <span ref={modalRef} className="block">
                    <span className="block relative px-[1.06rem] py-[1.33rem] border-b-xs border-platinum">
                      <button
                        onClick={() => setSellerDropdownState()}
                        className={`flex text-t16 font-product_sans items-center ${
                          isActive("/seller")
                            ? "text-tangerine"
                            : "text-spanish"
                        }`}
                        type="button"
                      >
                        <span>Seller profile</span>

                        {sellerDropdownOpened ? (
                          <MdOutlineKeyboardArrowUp className="w-[1.4rem] h-[1.4rem]" />
                        ) : (
                          <MdOutlineKeyboardArrowDown className="w-[1.4rem] h-[1.4rem]" />
                        )}
                      </button>
                      <span
                        className={`block transition-all duration-150 overflow-hidden ${
                          sellerDropdownOpened ? "h-auto" : "h-0"
                        }`}
                      >
                        <ul className="text-t14 font-product_sans text-spanish">
                          <li className="block">
                            <NavLink
                              className="block relative pl-[1.11rem] lg:pl-0 pt-[1rem] pb-[0.89rem] border-b-xs border-platinum"
                              href="/seller"
                              index
                            >
                              Dashboard
                            </NavLink>
                          </li>
                          <li className="block">
                            <NavLink
                              className="block relative pl-[1.11rem] lg:pl-0 py-[0.89rem] border-b-xs border-platinum"
                              href="/seller/products"
                            >
                              Products
                            </NavLink>
                          </li>
                          <li className="block">
                            <NavLink
                              className="block relative pl-[1.11rem] lg:pl-0 py-[0.89rem] border-b-xs border-platinum"
                              href="/seller/orders"
                            >
                              Orders
                            </NavLink>
                          </li>
                          <li className="block">
                            <NavLink
                              className="block relative pl-[1.11rem] lg:pl-0 py-[0.89rem] border-b-xs border-platinum"
                              href="/seller/wallet"
                            >
                              Wallet
                            </NavLink>
                          </li>
                          <li className="block">
                            <NavLink
                              className="block relative pl-[1.11rem] lg:pl-0 pt-[0.89rem]"
                              href="/seller/profile"
                            >
                              View Profile
                            </NavLink>
                          </li>
                        </ul>
                      </span>
                    </span>
                  </span>
                )
              )}
              <span className="block" ref={modalRef2}>
                <span className="block relative px-[1.06rem] py-[1.33rem] border-b-xs border-platinum">
                  <button
                    onClick={toggleModalState}
                    className={`flex text-t16 font-product_sans items-center ${
                      isActive("/dashboard") ||
                      isActive("/profile") ||
                      isActive("/downloads") ||
                      isActive("/orders")
                        ? "text-tangerine"
                        : "text-spanish"
                    }`}
                    type="button"
                  >
                    {/* profile picture */}
                    <span className="grid place-items-center mr-[0.35rem] bg-american_silver h-8 w-8 overflow-hidden rounded-full">
                      {profilePicture ? (
                        <Image
                          width={96}
                          height={96}
                          src={profilePicture}
                          alt="profile picture"
                          className="object-cover object-center rounded-full"
                        />
                      ) : (
                        <BiSolidUser className="w-6 h-6" />
                      )}
                    </span>
                    <span>Account</span>
                    {isModalOpened ? (
                      <MdOutlineKeyboardArrowUp className="w-[1.4rem] h-[1.4rem]" />
                    ) : (
                      <MdOutlineKeyboardArrowDown className="w-[1.4rem] h-[1.4rem]" />
                    )}
                  </button>
                  <span
                    className={`block transition-all duration-150 overflow-hidden ${
                      isModalOpened ? "h-auto" : "h-0"
                    }`}
                  >
                    <ul className="text-t14 font-product_sans text-spanish">
                      <li className="block">
                        <NavLink
                          className="block relative pl-[1.11rem] lg:pl-0 pt-[1rem] pb-[0.89rem] border-b-xs border-platinum"
                          href="/profile"
                        >
                          View Profile
                        </NavLink>
                      </li>
                      {/* {role !== "seller" && (
                        <li className="block">
                          <NavLink
                            className="block relative pl-[1.11rem] lg:pl-0 py-[0.89rem] border-b-xs border-platinum"
                            href="/auth/seller/profile"
                          >
                            Create a Seller Profile
                          </NavLink>
                        </li>
                      )} */}
                      <li className="block">
                        <NavLink
                          className="block relative pl-[1.11rem] lg:pl-0 py-[0.89rem] border-b-xs border-platinum"
                          href="/dashboard"
                        >
                          Wishlist
                        </NavLink>
                      </li>
                      <li className="block">
                        <NavLink
                          className="block relative pl-[1.11rem] lg:pl-0 py-[0.89rem] border-b-xs border-platinum"
                          href="/orders"
                        >
                          My Orders
                        </NavLink>
                      </li>
                      <li className="block">
                        <NavLink
                          className="block relative pl-[1.11rem] lg:pl-0 py-[0.89rem] border-b-xs border-platinum"
                          href="/downloads"
                        >
                          Downloads
                        </NavLink>
                      </li>
                    </ul>
                    <span className="relative w-full pl-[1.11rem] lg:pl-0 h-full grid place-items-end pt-[0.89rem]">
                      <PrimaryButton
                        text="Logout"
                        type="button"
                        disabled={isLoading}
                        onClick={Logout}
                      />
                    </span>
                  </span>
                </span>
              </span>
            </>
          ) : (
            <>
              <NavLink
                href="/auth/seller/"
                className="block text-t16 font-product_sans text-spanish pl-[1.06rem] py-[1.33rem] border-b-xs border-platinum"
              >
                Become a Seller
              </NavLink>
              <span className="block w-full pl-[1.89rem] pr-[1.83rem] py-[1.33rem] border-b-xs border-platinum">
                <button
                  onClick={() => {
                    setMobileNavigatorComponent("login");
                    close();
                  }}
                  className="w-full block py-[0.94rem] text-center px-[1rem] font-medium font-roboto text-14 lg:text-t16 rounded-xs text-tangerine border border-tangerine"
                >
                  Login
                </button>
              </span>
              <span className="block pl-[1.89rem] pr-[1.83rem] py-[1.33rem]">
                <button
                  onClick={() => {
                    setMobileNavigatorComponent("chooseAccount");
                    close();
                  }}
                  className="w-full py-[0.94rem] block text-center px-[1rem] font-medium font-roboto text-14 lg:text-t16 rounded-xs text-white bg-tangerine"
                >
                  Create Account
                </button>
              </span>
            </>
          )}
        </span>
      </div>
    </div>
  );
};

function Navbar() {
  const { mutate, isLoading } = useLogout();
  const { isLoggedIn } = useRecoilValue(AuthState);
  const { role, profilePicture } = useRecoilValue(userState);
  // const [isModalOpened, setModalState] = useState(false);
  const { isOpen: isModalOpened, modalRef, toggleModal } = useDisclosure();
  const {
    isOpen: isModalOpened2,
    toggleModal: toggleModal2,
    modalRef: modalRef2,
  } = useDisclosure();
  const [showMobileMenu, setMobileMenuState] = useState(false);
  const { pathname } = useRouter();
  const isActive = (href: string) => pathname.startsWith(href);

  const [cartLength, setCartLength] = useState(0);

  const cartItems = useRecoilValue(CartState);

  useEffect(() => {
    if (cartItems) {
      setCartLength(+cartItems?.length);
    }
  }, [cartItems]);

  const toggleModalState = () => {
    toggleModal();
  };

  const toggleModalState2 = () => {
    toggleModal2();
  };

  const mobileMenuHandler = () => {
    setMobileMenuState(!showMobileMenu);
  };

  return (
    <nav className="flex items-center justify-between space-x-2 bg-white">
      <MobileMenu
        state={showMobileMenu}
        close={() => setMobileMenuState(false)}
        isLoading={isLoading}
        Logout={() => mutate()}
      />
      <span className="lg:hidden flex items-center space-x-[1.54rem]">
        <BiMenu
          size={24}
          className="text-tangerine"
          role="button"
          onClick={mobileMenuHandler}
        />
        <NavLink
          exact
          href="/"
          className="block relative w-[3.5rem] h-[3.5rem]"
        >
          <Image sizes="25vw" src="/niteon.svg" fill alt="niteon" priority />
        </NavLink>
      </span>
      <NavLink
        href="/"
        exact
        className="lg:block hidden relative w-[6.67rem] h-[4.94rem]"
      >
        <Image
          width={120}
          height={89}
          // sizes="25vw"
          src={Niteon}
          alt="niteon"
          // fill
          priority
        />
      </NavLink>
      <span className="flex items-center space-x-[0.71rem] lg:hidden">
        {/*<IoIosSearch
          role="button"
          className="h-[1.3rem] w-[1.3rem] text-tangerine"
      />*/}
        <NavLink
          href="/shop"
          className="font-normal text-t14 font-product_sans text-spanish placeholder:font-normal"
        >
          Shop
        </NavLink>

        <NavLink
          href="/cart"
          className="relative flex items-center space-x-[0.44rem]"
        >
          <Image src={CartIcon} alt="cart icon" sizes="25vw" />
          <span className="absolute -top-[0.35rem] -right-[0.4rem] h-[0.77rem] w-[0.77rem] grid place-content-center text-[0.5rem] font-medium rounded-full font-product_sans text-white bg-tangerine">
            {cartLength}
          </span>
          {/* <span className="font-normal text-product_sans text-t14 text-tangerine">
          Cart
        </span> */}
        </NavLink>
      </span>
      <span className="hidden lg:block w-fit">
        <SearchField />
      </span>
      <span className="items-center hidden lg:flex w-fit">
        <NavLink
          href="/cart"
          className="flex items-center space-x-[0.44rem] text-spanish"
        >
          <Image
            src={isActive("/cart") ? CartIcon : CartIcon2}
            alt="cart icon"
            sizes="25vw"
          />
          <span className="relative font-normal text-product_sans text-t16 placeholder:font-normal">
            Cart
            <span className="absolute -top-[0.35rem] font-medium -right-[0.67rem] h-[0.77rem] w-[0.77rem] grid place-content-center text-[0.5rem] rounded-full font-product_sans text-white bg-tangerine">
              {cartLength}
            </span>
          </span>
        </NavLink>
        {isLoggedIn ? (
          <span className="flex items-center ml-[2rem]">
            {role?.toLowerCase() !== "seller" ? (
              <NavLink
                href="/auth/seller/profile"
                className="mr-[2rem] block text-t16 font-product_sans text-spanish"
              >
                Become a Seller
              </NavLink>
            ) : (
              role && (
                <span ref={modalRef2} className="block relative mr-[1.5rem]">
                  <button
                    onClick={toggleModalState2}
                    className={`flex text-t16 font-product_sans items-center ${
                      isActive("/seller") ? "text-tangerine" : "text-spanish"
                    }`}
                    type="button"
                  >
                    <span>Seller profile</span>

                    {isModalOpened2 ? (
                      <MdOutlineKeyboardArrowUp className="w-[1.4rem] h-[1.4rem]" />
                    ) : (
                      <MdOutlineKeyboardArrowDown className="w-[1.4rem] h-[1.4rem]" />
                    )}
                  </button>

                  <span
                    className={`block w-40 z-40 bg-white absolute right-0 top-8 shadow-sm rounded-xs transition-all duration-150 overflow-hidden ${
                      isModalOpened2 ? "h-auto p-3" : "h-0"
                    }`}
                  >
                    <ul className="text-t14 font-product_sans text-spanish">
                      <li className="block">
                        <NavLink
                          className="block relative px-[1.06rem] py-[0.89rem] border-b-xs border-platinum"
                          href="/seller"
                          index
                        >
                          Dashboard
                        </NavLink>
                      </li>
                      <li className="block">
                        <NavLink
                          className="block relative px-[1.06rem] py-[0.89rem] border-b-xs border-platinum"
                          href="/seller/products"
                        >
                          Products
                        </NavLink>
                      </li>
                      <li className="block">
                        <NavLink
                          className="block relative px-[1.06rem] py-[0.89rem] border-b-xs border-platinum"
                          href="/seller/orders"
                        >
                          Orders
                        </NavLink>
                      </li>
                      <li className="block">
                        <NavLink
                          className="block relative px-[1.06rem] py-[0.89rem] border-b-xs border-platinum"
                          href="/seller/wallet"
                        >
                          Wallet
                        </NavLink>
                      </li>
                      <li className="block">
                        <NavLink
                          className="block relative px-[1.06rem] pt-[0.89rem]"
                          href="/seller/profile"
                        >
                          View Profile
                        </NavLink>
                      </li>
                    </ul>
                  </span>
                </span>
              )
            )}
            <span ref={modalRef} className="relative block">
              <button
                onClick={toggleModalState}
                className={`flex text-t16 font-product_sans items-center ${
                  isActive("/dashboard") ||
                  isActive("/profile") ||
                  isActive("/downloads") ||
                  isActive("/orders")
                    ? "text-tangerine"
                    : "text-spanish"
                }`}
                type="button"
                title="Account"
              >
                <span className="grid place-items-center mr-[0.35rem] bg-american_silver h-8 w-8  overflow-hidden rounded-full">
                  {profilePicture ? (
                    <Image
                      width={96}
                      height={96}
                      src={profilePicture}
                      alt="profile picture"
                      className="object-cover object-center rounded-full"
                    />
                  ) : (
                    <BiSolidUser className="w-6 h-6" />
                  )}
                </span>
                <span>Account</span>
                {isModalOpened ? (
                  <MdOutlineKeyboardArrowUp className="w-[1.4rem] h-[1.4rem]" />
                ) : (
                  <MdOutlineKeyboardArrowDown className="w-[1.4rem] h-[1.4rem]" />
                )}
              </button>

              <span
                className={`block w-40 z-40 bg-white absolute right-0 top-8 shadow-sm rounded-xs transition-all duration-150 overflow-hidden ${
                  isModalOpened ? "h-auto p-3" : "h-0"
                }`}
              >
                <ul className="text-t14 font-product_sans text-spanish">
                  <li className="block">
                    <NavLink
                      className="block relative px-[1.06rem] py-[0.89rem] border-b-xs border-platinum"
                      href="/profile"
                    >
                      View Profile
                    </NavLink>
                  </li>
                  <li className="block">
                    <NavLink
                      className="block relative px-[1.06rem] py-[0.89rem] border-b-xs border-platinum"
                      href="/dashboard"
                    >
                      Wishlist
                    </NavLink>
                  </li>
                  <li className="block">
                    <NavLink
                      className="block relative px-[1.06rem] py-[0.89rem] border-b-xs border-platinum"
                      href="/orders"
                    >
                      My Orders
                    </NavLink>
                  </li>
                  <li className="block">
                    <NavLink
                      className="block relative px-[1.06rem] py-[0.89rem] border-b-xs border-platinum"
                      href="/downloads"
                    >
                      Downloads
                    </NavLink>
                  </li>
                </ul>
                <span className="relative w-full h-full grid place-items-end pt-[0.89rem]">
                  <PrimaryButton
                    disabled={isLoading}
                    onClick={() => mutate()}
                    text="Logout"
                    type="button"
                  />
                </span>
              </span>
            </span>
          </span>
        ) : (
          <>
            <NavLink
              href="/auth/login"
              className="mr-[2rem] ml-[4rem] block font-medium text-t16 font-roboto text-tangerine"
            >
              Login
            </NavLink>
            <NavLink
              href="/auth/account"
              className="w-full py-[0.94rem] text-center px-[1rem] font-medium font-roboto text-14 lg:text-t16 rounded-xs text-white bg-tangerine"
            >
              Create Account
            </NavLink>
          </>
        )}
      </span>
    </nav>
  );
}

export default Navbar;
