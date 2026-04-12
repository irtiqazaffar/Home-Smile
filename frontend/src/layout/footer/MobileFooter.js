import React, { useContext, useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { useCart } from "react-use-cart";
import { IoSearchOutline } from "react-icons/io5";
import { FiHome, FiUser, FiShoppingCart, FiAlignLeft, FiSearch, FiX, FiMapPin } from "react-icons/fi";
//internal imports
import { getUserSession } from "@lib/auth";
import { SidebarContext } from "@context/SidebarContext";
import CategoryDrawer from "@components/drawer/CategoryDrawer";
import useTranslation from "next-translate/useTranslation";
import { useRouter } from "next/router";
import { handleLogEvent } from "src/lib/analytics";
import useGetSetting from "@hooks/useGetSetting";
import ProductServices from "@services/ProductServices";
import useUtilsFunction from "@hooks/useUtilsFunction";

const MobileFooter = () => {
  const [modalOpen, setModalOpen] = useState(false);
  const { toggleCartDrawer, toggleCategoryDrawer } = useContext(SidebarContext);
  const { totalItems } = useCart();
  const userInfo = getUserSession();
  const router = useRouter();
  const { lang, storeCustomizationSetting } = useGetSetting();

  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);
  const { showingTranslateValue } = useUtilsFunction();

  // Function to toggle the search bar
  const toggleSearchBar = () => {
    setIsSearchVisible(prev => {
      if (!prev) {
        // When setting to visible, focus the input
        setTimeout(() => inputRef.current?.focus(), 0);
      }
      return !prev;
    });
  };

  const { t } = useTranslation();
  const [searchText, setSearchText] = useState("");
  const [location, setLocation] = useState("Gurgaon, India");

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
            );
            const data = await response.json();
            const address = data.address;
            const city =
              address.city ||
              address.town ||
              address.village ||
              address.county ||
              address.state_district;
            const country = address.country;
            if (city && country) {
              setLocation(`${city}, ${country}`);
            }
          } catch (error) {
            console.error("Error fetching location:", error);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
        }
      );
    }
  }, []);

  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(() => {
    // Call the API when the page loads
    const fetchProducts = async () => {
      try {
        const response = await ProductServices.getShowingStoreAllProducts();
        setProducts(response?.products);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []); // Empty dependency array ensures it only runs on page load

  const searchTerm = (data) => {
    setSearchText(data);
    if (data.trim() === "") {
      setFilteredProducts([]); // Clear suggestions if input is empty
    } else {
      const matches = products.filter((product) =>
        product?.title?.en.toLowerCase().includes(data.toLowerCase())
      );
      setFilteredProducts(matches);
    }
  };

  const handleClickOutside = (e) => {
    // Check if click is outside both input and dropdown
    if (
      inputRef.current &&
      dropdownRef.current &&
      !inputRef.current.contains(e.target) &&
      !dropdownRef.current.contains(e.target)
    ) {
      setFilteredProducts([]); // Clear suggestions if click is outside
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSubmit = (e, searchTerm) => {
    // Check if `e` exists before calling `preventDefault`
    if (e) {
      e.preventDefault();
    }

    // return;
    if (searchTerm) {
      router.push(`/product/${searchTerm}`, null, { scroll: false });
      setSearchText("");
      setFilteredProducts([]);
      setIsSearchVisible(!isSearchVisible);
      handleLogEvent("search", `searched ${searchTerm}`);
    }
    else if (searchText) {
      router.push(`/search?query=${searchText}`, null, { scroll: false });
      setSearchText("");
      setFilteredProducts([]);
      setIsSearchVisible(!isSearchVisible);
      handleLogEvent("search", `searched ${searchText}`);
    } else {
      router.push(`/ `, null, { scroll: false });
      setSearchText("");
      setFilteredProducts([]);
    }
  };

  const handleSuggestionClick = (title) => {
    setSearchText(title);
    setFilteredProducts([]); // Clear suggestions after selection

    // Call handleSubmit with the title directly
    handleSubmit(null, title);
  };

  return (
    <>
      <div className="flex flex-col h-full justify-between align-middle bg-white rounded cursor-pointer overflow-y-scroll flex-grow scrollbar-hide w-full">
        <CategoryDrawer className="w-6 h-6 drop-shadow-xl" />
      </div>
      <footer className="">
        {/* <div className="lg:hidden fixed z-50 top-0 text-white bg-black flex justify-center items-center w-full text-xs h-8 px-1 py-2 sm:px-2">
          {showingTranslateValue(
            storeCustomizationSetting?.home?.promotion_title
          )}
        </div>
        <div className="lg:hidden fixed z-30 top-6 text-white bg-black flex justify-center items-center text-sm w-full h-8 px-6 py-1 sm:px-10">
          {showingTranslateValue(
            storeCustomizationSetting?.home?.promotion_description
          )}
        </div> */}
        <div className="lg:hidden fixed z-30 top-0 bg-white flex items-center justify-between w-full h-16 px-3 sm:px-10">

          {/* Left Side: Profile & Location */}
          <div className="flex items-center">
            <button
              aria-label="User"
              type="button"
              className="flex-shrink-0"
            >
              {userInfo?.image ? (
                <Link href="/user/dashboard" className="relative top-1 w-8 h-8">
                  <Image
                    width={32}
                    height={32}
                    src={userInfo.image}
                    alt="user"
                    className="rounded-full"
                  />
                </Link>
              ) : userInfo?.name ? (
                <Link href="/user/dashboard" className="leading-none font-bold font-serif block text-white bg-black rounded-full w-8 h-8 flex items-center justify-center">
                  {userInfo?.name[0]}
                </Link>
              ) : (
                <Link href="/auth/login">
                  <FiUser className="w-6 h-6 text-black" />
                </Link>
              )}
            </button>
            {userInfo?.name && (
              <div className="ml-2 flex flex-col justify-center">
                <span className="text-sm font-bold text-black leading-none">{userInfo?.name}</span>
                <span className="text-xs text-gray-500 flex items-center mt-0.5">
                  <FiMapPin className="mr-1 w-3 h-3" /> {location}
                </span>
              </div>
            )}
          </div>

          {/* Right Side: Cart & Menu */}
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleCartDrawer}
              className="h-9 w-9 relative whitespace-nowrap inline-flex items-center justify-center text-black text-lg"
            >
              <span className="absolute z-10 top-0 right-0 inline-flex items-center justify-center p-1 h-5 w-5 text-xs font-bold leading-none text-red-100 transform translate-x-1/2 bg-red-500 rounded-full">
                {totalItems}
              </span>
              <FiShoppingCart className="w-6 h-6 drop-shadow-xl" />
            </button>

            <button
              aria-label="Bar"
              onClick={toggleCategoryDrawer}
              className="flex items-center justify-center flex-shrink-0 h-auto relative focus:outline-none"
            >
              <span className="text-xl text-black">
                <FiAlignLeft className="w-6 h-6 drop-shadow-xl" />
              </span>
            </button>
          </div>
        </div>
      </footer>
      {/* Conditional rendering for the search bar */}
      {isSearchVisible && (
        <div className="fixed top-32 w-full bg-white p-4 shadow-lg z-50"> {/* Ensure higher z-index */}
          <div className="w-full transition-all duration-200 ease-in-out lg:flex lg:max-w-[520px] xl:max-w-[750px] 2xl:max-w-[900px] md:mx-12 lg:mx-4 xl:mx-0">
            <div className="w-full flex flex-col justify-center flex-shrink-0 relative z-30">
              <div className="flex flex-col mx-auto w-full">
                <form
                  onSubmit={handleSubmit}
                  className="relative pr-12 md:pr-14 bg-white overflow-hidden shadow-sm rounded-md w-full"
                >
                  <label className="flex items-center py-0.5">
                    <input
                      ref={inputRef}
                      onChange={(e) => searchTerm(e.target.value)}
                      value={searchText}
                      className="form-input w-full pl-5 appearance-none transition ease-in-out border text-input text-sm font-sans rounded-md min-h-10 h-10 duration-200 bg-white focus:ring-0 outline-none border-none focus:outline-none placeholder-gray-500 placeholder-opacity-75"
                      placeholder={t(`common:search-placeholder`)}
                    />
                  </label>
                  <button
                    aria-label="Search"
                    type="submit"
                    className="outline-none text-xl text-gray-400 absolute top-0 right-0 end-0 w-12 md:w-14 h-full flex items-center justify-center transition duration-200 ease-in-out hover:text-heading focus:outline-none"
                  >
                    <IoSearchOutline />
                  </button>
                </form>
                {/* Auto-suggestion dropdown */}
                {filteredProducts?.length > 0 && (
                  <ul ref={dropdownRef} className="absolute w-full bg-white shadow-md rounded-md mt-12 max-h-60 overflow-y-auto z-20">
                    {filteredProducts.map((item, index) => (
                      <li
                        key={index}
                        onClick={() => handleSuggestionClick(item?.slug)}
                        className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                      >
                        {item?.title?.en}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default dynamic(() => Promise.resolve(MobileFooter), { ssr: false });
