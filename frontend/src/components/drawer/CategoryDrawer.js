import React, { Fragment, useContext, useState } from "react";
import dynamic from "next/dynamic";
import Drawer from "rc-drawer";

import Category from "@components/category/Category";
import { SidebarContext } from "@context/SidebarContext";
import { Popover, Transition } from "@headlessui/react";
import useGetSetting from "@hooks/useGetSetting";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { ChevronDownIcon } from "@heroicons/react/outline";
import Link from "next/link";
import { getUserSession } from "@lib/auth";
import { FiUser } from "react-icons/fi";
import { signOut } from "next-auth/react";
import Cookies from "js-cookie";
import { useRouter } from "next/router";
import { IoChevronDown, IoChevronUp, IoClose } from "react-icons/io5";
import Image from "next/image";
import CategoryServices from "@services/CategoryServices";
import DepartmentServices from "@services/DepartmentServices";
import useAsync from "@hooks/useAsync";
import CategoryCard from "@components/category/CategoryCard";
import DUMMY_IMAGE from "@components/constants";
import { FiHome, FiShoppingCart, FiAlignLeft, FiSearch, FiX } from "react-icons/fi";
import useTranslation from "next-translate/useTranslation";
import {
  FacebookIcon,
  LinkedinIcon,
  PinterestIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import { FaInstagram, FaYoutube } from 'react-icons/fa';

const CategoryDrawer = () => {
  const { categoryDrawerOpen, closeCategoryDrawer, setIsLoading, isLoading } =
    useContext(SidebarContext);

  const { lang, storeCustomizationSetting } = useGetSetting();
  const { showingTranslateValue } = useUtilsFunction();
  const userInfo = getUserSession();
  const router = useRouter();
  const { t } = useTranslation();


  const handleLogOut = () => {
    signOut();
    Cookies.remove("couponInfo");
    router.push("/");
  };



  const { data, loading, error } = useAsync(() =>
    CategoryServices.getShowingCategory()
  );

  const { data: departments } = useAsync(() =>
    DepartmentServices.getCategoriesFromDepartments()
  );

  const [dropdownOpen, setDropdownOpen] = useState({ department: false, category: true });

  const toggleDropdown = (dropdown) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [dropdown]: !prev[dropdown],
    }));
  };

  const handleLinkClick = (url) => {
    closeCategoryDrawer(); // Close the drawer
    router.push(url); // Navigate to the clicked link's route
  };

  const [expanded, setExpanded] = useState({}); // Track expanded state for each department

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <Drawer
      open={categoryDrawerOpen}
      onClose={closeCategoryDrawer}
      parent={null}
      level={null}
      placement={"left"}
    >
      <div className="flex flex-col w-full h-full bg-white cursor-pointer scrollbar-hide">
        {/* Header Section */}
        <div className="w-full flex justify-between items-center h-16 px-6 py-4 bg-black text-white border-b border-gray-100">
          <h2 className="font-semibold font-serif text-lg m-0 text-heading flex align-center">
            <Link href="/" className="mr-10">
              <Image
                width={100}
                height={50}
                src="/logo1.png"
                className="w-full h-auto"
                alt="logo"
              />
            </Link>
          </h2>
          <button
            onClick={closeCategoryDrawer}
            className="flex text-xl items-center justify-center w-8 h-8 rounded-full bg-gray-50 text-red-500 p-2 focus:outline-none transition-opacity hover:text-red-600"
            aria-label="close"
          >
            <IoClose />
          </button>
        </div>

        {/* Scrollable Content Section */}
        <div className="flex-grow overflow-y-auto m-4">
          {/* Placeholder for some content */}
          <div className="flex-grow w-full overflow-y-auto mb-4 border-b border-gray-200 px-4 py-2 rounded-xl">
            <Link
              onClick={() => {
                setIsLoading(!isLoading);
                closeCategoryDrawer();
              }}
              href="/"
              className="w-full text-start font-bold"
            >
              Home
            </Link>
          </div>

          <div className="flex-grow w-full mb-4">
            {/* Three Links Aligned in a Column */}
            <div className="w-full flex flex-col gap-3 mt-3">
              {storeCustomizationSetting?.home?.quick_delivery_subtitle?.en && (
                <>
                  <Link
                    onClick={() => {
                      setIsLoading(!isLoading);
                      closeCategoryDrawer();
                    }}
                    href="/search?query=latest"
                    className="w-full text-start font-bold transition-all focus:outline-none border-b border-gray-200 px-4 py-2 rounded-xl"
                  >
                    {storeCustomizationSetting?.home?.quick_delivery_subtitle?.en}
                  </Link>
                </>
              )}
              {storeCustomizationSetting?.home?.quick_delivery_description?.en && (
                <>
                  <Link
                    onClick={() => {
                      setIsLoading(!isLoading);
                      closeCategoryDrawer();
                    }}
                    href="/search"
                    className="w-full text-start font-bold transition-all focus:outline-none border-b border-gray-200 px-4 py-2 rounded-xl"
                  >
                    {storeCustomizationSetting?.home?.quick_delivery_description?.en}
                  </Link>
                </>
              )}

              {userInfo && storeCustomizationSetting?.navbar?.offers_menu_status && (
                <>
                  <Link
                    onClick={() => {
                      setIsLoading(!isLoading);
                      closeCategoryDrawer();
                    }}
                    href="/offer"
                    className="text-white bg-emerald-500 font-serif w-full text-start font-bold transition-all focus:outline-none border border-2 border-emerald-300 px-4 py-2 rounded-xl"
                  >
                    {showingTranslateValue(storeCustomizationSetting?.navbar?.offers)} <span>%</span>
                  </Link>
                </>
              )}
            </div>

            {/* Category Menu Toggle */}

            {storeCustomizationSetting?.navbar?.categories_menu_status && (
              <div className="my-3">
                <button
                  onClick={() => toggleDropdown("category")}
                  className="w-full text-start font-bold transition-all focus:outline-none border-b border-gray-200 px-4 py-2 rounded-xl"
                >
                  {showingTranslateValue(
                    storeCustomizationSetting?.navbar?.categories
                  )}
                </button>
                {dropdownOpen.category && data[0]?.children?.map((category) => (
                  <CategoryCard
                    key={category._id}
                    id={category._id}
                    icon={category.icon}
                    nested={category.children}
                    title={showingTranslateValue(category?.name)}
                  />
                ))}
              </div>
            )}

            <div className="flex-grow w-full mt-4 overflow-y-auto mb-4 border-b border-gray-200 px-4 py-2 rounded-xl">
              <Link
                onClick={() => {
                  setIsLoading(!isLoading);
                  closeCategoryDrawer();
                }}
                href="/contact-us"
                className="w-full text-start font-bold transition-all focus:outline-none"
              >
                Buy In Bulk
              </Link>
            </div>
          </div>

        </div>

        {/* Sticky Footer Section for User Authentication */}
        <div className="w-full px-4 py-3 text-center">
          {userInfo?.email ? (
            <button
              onClick={handleLogOut}
              className="w-full text-center py-2 rounded-full bg-black text-white"
            >
              {showingTranslateValue(storeCustomizationSetting?.navbar?.logout)}
            </button>
          ) : (
            <button
              className="w-full px-8 text-center py-3 bg-black rounded-sm text-white hover:bg-black transition-all focus:outline-none"
              onClick={e => handleLinkClick("/auth/login")}
            >
              {showingTranslateValue(storeCustomizationSetting?.navbar?.login)}
            </button>
          )}
        </div>

        {/* Social Links */}
        <div className="grid grid-cols-1 md:grid-cols-3 xl:grid-cols-3 gap-5 sm:gap-9 px-4 lg:gap-11 xl:gap-7 py-2 items-center text-center justify-center">
          {storeCustomizationSetting?.footer?.social_links_status && (
            <div>
              {/* <ul className="text-sm flex">
                {storeCustomizationSetting?.footer?.social_facebook && (
                  <li className="flex items-center mr-3 transition ease-in-out duration-500">
                    <Link
                      href={`${storeCustomizationSetting?.footer?.social_facebook}`}
                      aria-label="Social Link"
                      rel="noreferrer"
                      target="_blank"
                      className="block text-center mx-auto text-gray-500 hover:text-white"
                    >
                      <FacebookIcon size={34} round />
                    </Link>
                  </li>
                )}
                {storeCustomizationSetting?.footer?.social_twitter && (
                  <li className="flex items-center  mr-3 transition ease-in-out duration-500">
                    <Link
                      href={`${storeCustomizationSetting?.footer?.social_twitter}`}
                      aria-label="Social Link"
                      rel="noreferrer"
                      target="_blank"
                      className="block text-center mx-auto text-gray-500 hover:text-white"
                    >
                      <FaInstagram size={34} round className="text-red-700" />
                    </Link>
                  </li>
                )}
                {storeCustomizationSetting?.footer?.social_pinterest && (
                  <li className="flex items-center mr-3 transition ease-in-out duration-500">
                    <Link
                      href={`${storeCustomizationSetting?.footer?.social_pinterest}`}
                      aria-label="Social Link"
                      rel="noreferrer"
                      target="_blank"
                      className="block text-center mx-auto text-gray-500 hover:text-white"
                    >
                      <FaYoutube size={34} round className="text-red-600" />
                    </Link>
                  </li>
                )}
                {storeCustomizationSetting?.footer?.social_linkedin && (
                  <li className="flex items-center  mr-3 transition ease-in-out duration-500">
                    <Link
                      href={`${storeCustomizationSetting?.footer?.social_linkedin}`}
                      aria-label="Social Link"
                      rel="noreferrer"
                      target="_blank"
                      className="block text-center mx-auto text-gray-500 hover:text-white"
                    >
                      <LinkedinIcon size={34} round />
                    </Link>
                  </li>
                )}
                {storeCustomizationSetting?.footer?.social_whatsapp && (
                  <li className="flex items-center  mr-3 transition ease-in-out duration-500">
                    <Link
                      href={`${storeCustomizationSetting?.footer?.social_whatsapp}`}
                      aria-label="Social Link"
                      rel="noreferrer"
                      target="_blank"
                      className="block text-center mx-auto text-gray-500 hover:text-white"
                    >
                      <WhatsappIcon size={34} round />
                    </Link>
                  </li>
                )}
              </ul> */}
              <div className="flex gap-4">
                {storeCustomizationSetting?.footer?.social_facebook && (
                  <Link
                    href={`${storeCustomizationSetting?.footer?.social_facebook}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-gray-800 p-2 rounded-full hover:bg-white hover:text-gray-800 transition-all hover:scale-110 text-white"
                    aria-label="Facebook"
                  >
                    <FacebookIcon size={20} round bgStyle={{ fill: "transparent" }} iconFillColor="currentColor" />
                  </Link>
                )}
                {storeCustomizationSetting?.footer?.social_twitter && (
                  <Link
                    href={`${storeCustomizationSetting?.footer?.social_twitter}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-gray-800 p-2 rounded-full hover:bg-white hover:text-gray-800 transition-all hover:scale-110 text-white"
                    aria-label="Twitter"
                  >
                    <TwitterIcon size={20} round bgStyle={{ fill: "transparent" }} iconFillColor="currentColor" />
                  </Link>
                )}
                {storeCustomizationSetting?.footer?.social_pinterest && (
                  <Link
                    href={`${storeCustomizationSetting?.footer?.social_pinterest}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-gray-800 p-2 rounded-full hover:bg-white hover:text-gray-800 transition-all hover:scale-110 text-white"
                    aria-label="Pinterest"
                  >
                    <PinterestIcon size={20} round bgStyle={{ fill: "transparent" }} iconFillColor="currentColor" />
                  </Link>
                )}
                {storeCustomizationSetting?.footer?.social_linkedin && (
                  <Link
                    href={`${storeCustomizationSetting?.footer?.social_linkedin}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-gray-800 p-2 rounded-full hover:bg-white hover:text-gray-800 transition-all hover:scale-110 text-white"
                    aria-label="LinkedIn"
                  >
                    <LinkedinIcon size={20} round bgStyle={{ fill: "transparent" }} iconFillColor="currentColor" />
                  </Link>
                )}
                {storeCustomizationSetting?.footer?.social_whatsapp && (
                  <Link
                    href={`${storeCustomizationSetting?.footer?.social_whatsapp}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-gray-800 p-2 rounded-full hover:bg-white hover:text-gray-800 transition-all hover:scale-110 text-white"
                    aria-label="WhatsApp"
                  >
                    <WhatsappIcon size={20} round bgStyle={{ fill: "transparent" }} iconFillColor="currentColor" />
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {/* <Category /> */}

    </Drawer>
  );
};
export default dynamic(() => Promise.resolve(CategoryDrawer), { ssr: false });
