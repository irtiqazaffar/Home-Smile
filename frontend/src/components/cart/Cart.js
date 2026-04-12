import { useRouter } from "next/router";
import React, { useContext } from "react";
import { useCart } from "react-use-cart";
import { IoBagCheckOutline, IoClose, IoBagHandle } from "react-icons/io5";

//internal import
import { getUserSession } from "@lib/auth";
import CartItem from "@components/cart/CartItem";
import { SidebarContext } from "@context/SidebarContext";
import useUtilsFunction from "@hooks/useUtilsFunction";

const Cart = () => {
  const router = useRouter();
  const { isEmpty, items, cartTotal } = useCart();
  const { closeCartDrawer } = useContext(SidebarContext);
  const { currency } = useUtilsFunction();
  const userInfo = getUserSession();

  // console.log("userInfo", userInfo);

  const handleCheckout = () => {
    if (items?.length <= 0) {
      closeCartDrawer();
    } else {
      if (!userInfo) {
        // console.log("userInfo::", userInfo, "history");

        // Redirect to login page with returnUrl query parameter
        router.push(`/auth/login?redirectUrl=checkout`);
        closeCartDrawer();
      } else {
        router.push("/checkout");
        closeCartDrawer();
      }
    }
  };

  return (
    <>
      <div className="flex flex-col w-full h-full justify-between items-middle bg-white rounded cursor-pointer">
        <div className="w-full flex justify-between items-center relative px-5 py-4 bg-black text-white">
          <h2 className="font-semibold font-serif text-lg m-0 text-heading flex items-center">
            <span className="text-xl mr-2 mb-1">
              <IoBagCheckOutline />
            </span>
            Shopping Cart
          </h2>
          <button
            onClick={closeCartDrawer}
            className="flex text-xl items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-red-500 p-2 focus:outline-none transition-opacity hover:text-red-600"
          >
            <IoClose />
          </button>
        </div>
        <div className="overflow-y-scroll flex-grow scrollbar-hide w-full max-h-full">
          {isEmpty && (
            <div className="flex flex-col h-full justify-center">
              <div className="flex flex-col items-center">
                <div className="flex justify-center items-center w-20 h-20 rounded-full bg-gray-300">
                  <span className="text-black text-4xl block">
                    <IoBagHandle />
                  </span>
                </div>
                <h3 className="font-serif font-semibold text-gray-800 text-lg pt-5">
                  Your cart is empty
                </h3>
                <p className="px-12 text-center text-md text-gray-700 pt-2">
                  No items added in your cart. Please add product to your cart
                  list.
                </p>
              </div>
            </div>
          )}

          {items.map((item, i) => (
            <CartItem key={i + 1} item={item} />
          ))}
        </div>
        <div className="mx-5 my-3">
          <div className="w-full flex justify-between items-center px-0 md:px-2 lg:px-4">
            <span className="rounded-lg text-lg font-bold py-2 px-3 text-black">
              Subtotal:
            </span>
            <span className="rounded-lg text-end text-lg font-bold py-2 px-3 text-black">
              {currency}
              {cartTotal.toFixed(2)}
            </span>
          </div>
          <button
            onClick={handleCheckout}
            className="w-full flex justify-center items-center text-center py-3 mt-4 rounded-full bg-black hover:bg-gray-800 text-lg lg:text-xl text-white focus:outline-none transition duration-300"
          >
            Proceed To Checkout
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;
