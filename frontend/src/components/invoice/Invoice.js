import dayjs from "dayjs";
import React from "react";
import Link from "next/link";
import Image from "next/image";
//internal import
import OrderTable from "@components/order/OrderTable";
import useUtilsFunction from "@hooks/useUtilsFunction";

const Invoice = ({ data, printRef, globalSetting, currency }) => {
  // console.log('invoice data',data)

  const { getNumberTwo, numberToWords, capitalizeFirstLetter } =
    useUtilsFunction();

  return (
    <div ref={printRef}>
      <div className="bg-indigo-50 p-8 rounded-t-xl">
        <div className="flex lg:flex-row md:flex-row flex-col lg:items-center justify-between pb-4 border-b border-gray-50">
          {/* Order Info Section */}
          <div>
            <h2 className="text-2xl">
              <Link href="/">
                <Image width={210} height={210} src="/logo2.png" alt="logo" />
              </Link>
            </h2>
            <h1 className="mt-2 font-bold font-serif text-2xl uppercase">
              Invoice
            </h1>
            <h6 className="text-gray-700">
              Status :{" "}
              {data.status === "Delivered" && (
                <span className="text-emerald-500">{data.status}</span>
              )}
              {data.status === "POS-Completed" && (
                <span className="text-emerald-500">{data.status}</span>
              )}
              {data.status === "Pending" && (
                <span className="text-orange-500">{data.status}</span>
              )}
              {data.status === "Cancel" && (
                <span className="text-red-500">{data.status}</span>
              )}
              {data.status === "Processing" && (
                <span className="text-indigo-500">{data.status}</span>
              )}
              {data.status === "Deleted" && (
                <span className="text-red-700">{data.status}</span>
              )}
            </h6>
          </div>

          {/* Shop Info Section */}
          <div className="sm:text-right lg:text-right text-left">
            <p className="text-sm text-gray-500">
              Home Smile <br />
              123 Innovation Drive, Tech Park, Sector 45, Gurgaon, Haryana -
              122003
              <br />
              Phone: +91 8904056999
              <br />
              Email: irtiqazaffari@gmail.com
            </p>
          </div>
        </div>
        <div className="flex lg:flex-row md:flex-row flex-col justify-between pt-4">
          <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col">
            <span className="font-bold font-serif text-sm uppercase text-gray-600 block">
              Date
            </span>
            <span className="text-sm text-gray-500 block">
              {data.createdAt !== undefined && (
                <span>{dayjs(data?.createdAt).format("MMMM D, YYYY")}</span>
              )}
            </span>
          </div>
          <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col">
            <span className="font-bold font-serif text-sm uppercase text-gray-600 block">
              Delivery Date
            </span>
            <span className="text-sm text-gray-500 block">
              {data.deliveryDate !== undefined && (
                <span>{dayjs(data?.deliveryDate).format("MMMM D, YYYY")}</span>
              )}
            </span>
          </div>
          <div className="mb-3 md:mb-0 lg:mb-0 flex flex-col">
            <span className="font-bold font-serif text-sm uppercase text-gray-600 block">
              Invoice No.
            </span>
            <span className="text-sm text-gray-500 block">
              #{data?.invoice}
            </span>
          </div>
          <div className="flex flex-col sm:text-right lg:text-right text-left">
            <span className="font-bold font-serif text-sm uppercase text-gray-600 block">
              Customer Name.
            </span>
            <span className="text-sm text-gray-500 block">
              {"Mr./Mrs. "}
              {data?.user_info?.name} <br />
              {data?.user_info?.email}
              <br />
              <span className="ml-2">{data?.user_info?.contact}</span>
              <br />
              {data?.user_info?.address}
              <br />
              {data?.city} {data?.country} {data?.zipCode}
            </span>
          </div>
        </div>
      </div>
      <div className="s">
        <div className="overflow-hidden lg:overflow-visible px-8 my-10">
          <div className="-my-2 overflow-x-auto">
            <table className="table-auto min-w-full border border-gray-100 divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr className="text-xs bg-gray-100">
                  <th
                    scope="col"
                    className="font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider text-left"
                  >
                    Sr.
                  </th>
                  <th
                    scope="col"
                    className="font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider text-center"
                  >
                    HSN
                  </th>
                  <th
                    scope="col"
                    className="font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider text-center"
                  >
                    Refrence No
                  </th>
                  <th
                    scope="col"
                    className="font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider text-center"
                  >
                    Product Name
                  </th>
                  <th
                    scope="col"
                    className="font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider text-center"
                  >
                    Quantity
                  </th>
                  <th
                    scope="col"
                    className="font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider text-center"
                  >
                    Item Price
                  </th>

                  <th
                    scope="col"
                    className="font-serif font-semibold px-6 py-2 text-gray-700 uppercase tracking-wider text-right"
                  >
                    Amount
                  </th>
                </tr>
              </thead>
              <OrderTable data={data} currency={currency} />
            </table>
          </div>
        </div>
      </div>

      <div className="border-t border-b border-gray-100 p-10 bg-emerald-50">
        <div className="flex lg:flex-row md:flex-row flex-col justify-between pt-4">
          <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
            <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600 block">
              Payment Method
            </span>
            <span className="text-sm text-gray-500 font-semibold font-serif block">
              {data?.paymentMethod}
            </span>
          </div>
          <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
            <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600 block">
              Shipping Cost
            </span>
            <span className="text-sm text-gray-500 font-semibold font-serif block">
              {currency}
              {getNumberTwo(data.shippingCost)}
            </span>
          </div>
          <div className="mb-3 md:mb-0 lg:mb-0  flex flex-col sm:flex-wrap">
            <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600 block">
              Discount
            </span>
            <span className="text-sm text-gray-500 font-semibold font-serif block">
              {currency}
              {getNumberTwo(data.discount)}
            </span>
          </div>
          <div className="flex flex-col sm:flex-wrap">
            <span className="mb-1 font-bold font-serif text-sm uppercase text-gray-600 block">
              Total Amount
            </span>
            <span className="text-2xl font-serif font-bold text-red-500 block">
              {currency}
              {getNumberTwo(data.total)}
            </span>
          </div>
        </div>
        <div className="w-full text-right text-gray-500 font-semibold font-serif mt-2">
          {capitalizeFirstLetter(numberToWords(getNumberTwo(data.total)))}
          {" Only"}
        </div>
      </div>
    </div>
  );
};

export default Invoice;
