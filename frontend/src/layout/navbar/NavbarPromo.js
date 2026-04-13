import { Fragment, useState, useEffect, useContext } from "react";
import Link from "next/link";
import { Transition, Popover } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/outline";
import SettingServices from "@services/SettingServices";
import Cookies from "js-cookie";

//internal import
import { notifyError } from "@utils/toast";
import useGetSetting from "@hooks/useGetSetting";
import Category from "@components/category/Category";
import { SidebarContext } from "@context/SidebarContext";
import useUtilsFunction from "@hooks/useUtilsFunction";
import { getUserSession } from "@lib/auth";
import CategoryServices from "@services/CategoryServices";
import useAsync from "@hooks/useAsync";
import Image from "next/image";
import { useRouter } from "next/router";

const NavbarPromo = () => {
  const [languages, setLanguages] = useState([]);
  // const [currentLang, setCurrentLang] = useState({});
  const { lang, storeCustomizationSetting } = useGetSetting();
  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const router = useRouter();

  const { showingTranslateValue } = useUtilsFunction();
  const currentLanguage = Cookies.get("_curr_lang") || null;

  const { data, loading, error } = useAsync(() =>
    CategoryServices.getShowingCategory()
  );

  console.log("Category Log ", data);

  let currentLang = {};

  if (currentLanguage && currentLanguage !== "undefined") {
    try {
      currentLang = JSON.parse(currentLanguage);
    } catch (error) {
      console.error("Invalid JSON format:", error);
      currentLang = {}; // Fallback to an empty object
    }
  }

  const userInfo = getUserSession();

  const handleSubNestedCategory = (id, categoryName) => {
    const name = categoryName.toLowerCase().replace(/[^A-Z0-9]+/gi, "-");
    router.push(`/search?category=${name}&_id=${id}`);
    setIsLoading(!isLoading);
  };

  const handleSubCategory = (id, categoryName) => {
    const name = categoryName.toLowerCase().replace(/[^A-Z0-9]+/gi, "-");
    router.push(`/search?category=${name}&_id=${id}`);
    setIsLoading(!isLoading);
  };


  const handleLanguage = (lang) => {
    // setCurrentLang(lang);
    Cookies.set("_lang", lang?.iso_code, {
      sameSite: "None",
      secure: true,
    });
    Cookies.set("_curr_lang", JSON.stringify(lang), {
      sameSite: "None",
      secure: true,
    });
  };

  useEffect(() => {
    (async () => {
      {
        try {
          const res = await SettingServices.getShowingLanguage();
          setLanguages(res);
          const currentLanguage = Cookies.get("_curr_lang");
          if (!currentLanguage) {
            const result = res?.find((language) => language?.iso_code === lang);
            Cookies.set("_curr_lang", JSON.stringify(result || res[0]), {
              sameSite: "None",
              secure: true,
            });
            // console.log("result", result);
            // // setCurrentLang(currentLanguage);
          }
        } catch (err) {
          notifyError(err);
          // console.log("error on getting lang", err);
        }
      }
    })();
  }, []);

  return (
    <>
      <div className="hidden lg:block xl:block bg-gray-100 border-b">
        <div className="max-w-screen-2xl mx-auto px-3 sm:px-10 lg:px-24 h-28 pt-5 pb-2 flex justify-between items-center">
          <div>
            {/* <Image
                          src={"/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdjrbdgtzr%2Fimage%2Fupload%2Fv1734243800%2Fproduct%2FWhatsAppImage2024-12-15at11.18.45AM.jpg&w=640&q=75"} // Replace with your image path
                          alt="Home"
                          width={200} // Set width of the image
                          height={100} // Set height of the image
                          className="mx-auto rounded-lg h-16 w-20" // Center image and add margin bottom
                        /> */}
            <Link
              onClick={() => setIsLoading(!isLoading)}
              href="/"
              className="font-serif mx-4 py-2 text-sm text-black font-semibold hover:text-emerald-600"
            >
              Home
            </Link>
          </div>
          <div>
            {storeCustomizationSetting?.home?.quick_delivery_subtitle?.en && (
              <>
                <Link
                  onClick={() => setIsLoading(!isLoading)}
                  href="/search?query=latest"
                >
                  <Image
                    src={"https://shreyahomedecor.com/cdn/shop/files/1231.png?v=1743750553&width=1024"} // Replace with your image path
                    alt="Home"
                    width={200} // Set width of the image
                    height={100} // Set height of the image
                    className="mx-auto rounded-lg h-16 w-20 object-cover" // Center image and add margin bottom
                  />
                  <div
                    className="font-serif mx-4 py-2 text-sm text-black font-medium hover:text-emerald-600"
                  >
                    {storeCustomizationSetting?.home?.quick_delivery_subtitle?.en}
                  </div>
                </Link>
              </>
            )}
          </div>
          <div>
            {storeCustomizationSetting?.home?.quick_delivery_description?.en && (
              <>
                <Link
                  onClick={() => setIsLoading(!isLoading)}
                  href="/search"
                >
                  <Image
                    src={storeCustomizationSetting?.home?.quick_delivery_img} // Replace with your image path
                    alt="Home"
                    width={200} // Set width of the image
                    height={100} // Set height of the image
                    className="mx-auto rounded-lg h-16 w-20 object-cover" // Center image and add margin bottom
                  />
                  <div
                    className="font-serif mx-4 py-2 text-sm text-black font-medium hover:text-emerald-600"
                  >
                    {storeCustomizationSetting?.home?.quick_delivery_description?.en}
                  </div>
                </Link>
              </>
            )}
          </div>
          {data[0]?.children?.map((category, index) => {
            return (
              <div key={index} className="relative cursor-pointer group"
                onClick={() =>
                  handleSubCategory(
                    category?._id,
                    showingTranslateValue(category?.name)
                  )
                }
              >
                <Image
                  src={category?.icon} // Replace with your image path
                  alt="Home"
                  width={200} // Set width of the image
                  height={100} // Set height of the image
                  className="mx-auto rounded-lg h-16 w-20 object-cover" // Center image and add margin bottom
                />
                <div
                  className="font-serif mx-4 py-2 text-sm text-black font-medium hover:text-emerald-600 flex items-center"
                >
                  {category?.name?.en}
                  {category?.children && (
                    <div className="w-0 h-0 border-l-[6px] ms-2 border-r-[6px] border-t-[10px] border-transparent border-t-black"></div>
                  )}
                </div>

                {category?.children && (
                  <div className="absolute left-0 w-60 top-full rounded-lg hidden group-hover:block bg-white shadow-lg p-4">
                    {category?.children?.map((subCategory, subIndex) => (
                      <div
                        key={subIndex}
                        className="block px-2 py-1 text-sm text-gray-700 cursor-pointer hover:text-emerald-600"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleSubNestedCategory(
                            subCategory?._id,
                            showingTranslateValue(subCategory?.name)
                          )
                        }
                        }
                      >
                        {subCategory?.name?.en}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
          <div>
            <Link
              onClick={() => setIsLoading(!isLoading)}
              href="/contact-us"
            >
              {/* <Image
                        src={"https://webkul.com/blog/wp-content/uploads/2014/06/Bulk-Buy-Banner.png"} // Replace with your image path
                        alt="Home"
                        width={200} // Set width of the image
                        height={100} // Set height of the image
                        className="mx-auto rounded-lg h-16 w-20 object-cover" // Center image and add margin bottom
                      /> */}
              <div
                className="font-serif text-sm text-black font-semibold hover:text-emerald-600"
              >
                Buy In Bulk
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default NavbarPromo;
