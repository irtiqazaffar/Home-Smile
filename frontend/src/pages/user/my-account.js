import Link from "next/link";
import React from "react";
import { FiPlus } from "react-icons/fi";

//internal imports

import useAsync from "@hooks/useAsync";
import { getUserSession } from "@lib/auth";
import Dashboard from "@pages/user/dashboard";
import CustomerServices from "@services/CustomerServices";

const MyAccount = () => {
  const userInfo = getUserSession();
  const { data, loading, error } = useAsync(() =>
    CustomerServices.getShippingAddress({
      userId: userInfo?.id,
    })
  );

  const hasShippingAddress =
    data?.shippingAddress && Object.keys(data.shippingAddress).length > 0;

  // console.log("data", data?.shippingAddress);

  return (
    <Dashboard title="my-account" description="This is my account page">
      <div className="overflow-hidden">
        <div className="grid gap-4 mb-8 sm:grid-cols-2 grid-cols-1">
          {/* User Info Card */}
          <div className="relative p-6 bg-white border-2 border-black shadow-lg shadow-black w-full max-w-lg mx-auto">
              <Link
                href="/user/update-profile"
                className="absolute top-4 right-4 border-2 border-black text-black bg-gray-200 px-3 py-1 lg:px-8 lg:py-2 rounded-sm hover:bg-black hover:text-white text-sm"
              >
                Edit
              </Link>
              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24">
                  {userInfo?.image ? (
                    <img
                      src={userInfo.image}
                      className="w-24 h-24 rounded-full object-cover bg-gray-50"
                      alt={userInfo?.name}
                    />
                  ) : (
                    <div className="flex items-center justify-center w-24 h-24 rounded-full bg-gray-200 text-2xl font-bold text-gray-700">
                      {userInfo?.name?.charAt(0)}
                    </div>
                  )}
                </div>

                <div className="text-center">
                  <h5 className="text-xl font-semibold text-black mb-1">
                    {userInfo?.name}
                  </h5>
                  <p className="text-sm text-black">{userInfo?.email}</p>
                  <p className="text-sm text-black">{userInfo?.phone}</p>
                </div>
              </div>
          </div>

          {/* Shipping Address Card */}
          {hasShippingAddress ? (
            <div className="relative p-6 bg-white border-2 border-black shadow-lg shadow-black w-full max-w-xl mx-auto">
                <Link
                  href={`/user/add-shipping-address?id=${userInfo?.id}`}
                  className="absolute top-4 right-4 border-2 border-black text-black bg-gray-200 px-3 py-1 lg:px-8 lg:py-2 rounded-sm hover:bg-black hover:text-white text-sm"
                >
                  Edit
                </Link>
                <div className="flex flex-col space-y-4">
                  {!loading && error ? (
                    <Error errorName={error} />
                  ) : (
                    <div className="text-left pt-4 lg:pt-0">
                      <h5 className="text-lg font-semibold text-black mb-2">
                        {data?.shippingAddress?.name}
                        <span className="ml-2 text-sm text-gray-800">
                          (Default Shipping Address)
                        </span>
                      </h5>
                      <p className="text-sm text-black">
                        <strong>Contact:</strong> {data?.shippingAddress?.contact}
                      </p>
                      <p className="text-sm text-black">
                        <strong>Address:</strong> {data?.shippingAddress?.address}
                      </p>
                      <p className="text-sm text-black">
                        <strong>Location:</strong> {data?.shippingAddress?.country}, {data?.shippingAddress?.city}, {data?.shippingAddress?.area} - {data?.shippingAddress?.zipCode}
                      </p>
                    </div>
                  )}
                </div>
            </div>          
          ) : (
            <div className="flex h-full relative">
              <Link
                href="/user/add-shipping-address"
                className="flex items-center bg-cyan-600 text-white hover:bg-cyan-700 w-full rounded-lg py-3 px-4 text-center relative"
              >
                <FiPlus className="text-xl font-bold text-center mr-4" /> Add
                Default Shipping Address
              </Link>
            </div>
          )}
        </div>
      </div>
    </Dashboard>
  );
};

export default MyAccount;
