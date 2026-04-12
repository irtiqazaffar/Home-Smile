import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import useTranslation from "next-translate/useTranslation";
import {
  FacebookIcon,
  LinkedinIcon,
  PinterestIcon,
  TwitterIcon,
  WhatsappIcon,
} from "react-share";
import { FaInstagram, FaYoutube } from "react-icons/fa";

//internal import
import { getUserSession } from "@lib/auth";
import useGetSetting from "@hooks/useGetSetting";
import CMSkeleton from "@components/preloader/CMSkeleton";
import useUtilsFunction from "@hooks/useUtilsFunction";
import logo from "../../../public/logo/logo-color.png";

const Footer = () => {
  const { t } = useTranslation();
  const userInfo = getUserSession();

  const { showingTranslateValue } = useUtilsFunction();
  const { loading, storeCustomizationSetting } = useGetSetting();

  return (
    <footer className="bg-black border-t border-gray-800">
      <div className="mx-auto max-w-screen-2xl px-4 sm:px-10 pt-16 pb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-12 gap-8 lg:gap-10 pb-10">
          {/* Section 1: Brand / Logo / Content (spans 4 cols) */}
          {storeCustomizationSetting?.footer?.block4_status && (
            <div className="lg:col-span-4">
              <Link href="/" className="inline-block mb-6 relative">
                <div className="md:w-full w-auto md:h-auto h-full relative">
                  <Image
                    width="0"
                    height="0"
                    sizes="100vw"
                    className="md:w-full w-auto md:h-auto h-full object-contain"
                    src="/logo1.png"
                    alt="logo"
                  />
                </div>
              </Link>

              {/* <div className="leading-relaxed text-gray-400 text-sm mb-6 max-w-sm">
                <CMSkeleton
                  count={1}
                  height={15}
                  loading={loading}
                  data={
                    storeCustomizationSetting?.footer?.company_description ||
                    storeCustomizationSetting?.footer?.block4_description ||
                    ""
                  }
                />
              </div> */}

              {/* <address className="not-italic text-sm text-gray-400 space-y-3">
                <div className="flex items-start">
                  <CMSkeleton
                    count={1}
                    height={15}
                    loading={loading}
                    data={storeCustomizationSetting?.footer?.block4_address}
                  />
                </div>
                {storeCustomizationSetting?.footer?.block4_phone && (
                  <div className="block">
                    <span className="text-gray-500 mr-2">Tel:</span>
                    <p className="hover:text-white transition-colors">+91 8904056999</p>
                  </div>
                )}
                {storeCustomizationSetting?.footer?.block4_email && (
                  <div className="block">
                    <span className="text-gray-500 mr-2">Email:</span>
                    <p className="hover:text-white transition-colors">irtiqazaffari@gmail.com@gmail.com</p>
                  </div>
                )}
              </address> */}

              <div className="leading-relaxed text-gray-400 text-sm mb-6">
                <p>
                  {" "}
                  Home Smile is an online home decoration brand offering
                  stylish, affordable décor items to enhance modern living
                  spaces effortlessly worldwide.
                </p>
              </div>
            </div>
          )}

          {/* Section 2: INFORMATION (Block 2) (spans 2-3 cols) */}
          {storeCustomizationSetting?.footer?.block2_status && (
            <div className="lg:col-span-2">
              <h3 className="text-lg font-bold text-gray-100 mb-6 tracking-wide">
                <CMSkeleton
                  count={1}
                  height={20}
                  loading={loading}
                  data={storeCustomizationSetting?.footer?.block2_title}
                />
              </h3>
              <ul className="space-y-3 text-sm text-gray-400">
                {[
                  {
                    link: storeCustomizationSetting?.footer?.block2_sub_link1,
                    title: storeCustomizationSetting?.footer?.block2_sub_title1,
                  },
                  {
                    link: storeCustomizationSetting?.footer?.block2_sub_link2,
                    title: storeCustomizationSetting?.footer?.block2_sub_title2,
                  },
                  {
                    link: storeCustomizationSetting?.footer?.block2_sub_link3,
                    title: storeCustomizationSetting?.footer?.block2_sub_title3,
                  },
                  {
                    link: storeCustomizationSetting?.footer?.block2_sub_link4,
                    title: storeCustomizationSetting?.footer?.block2_sub_title4,
                  },
                ].map(
                  (item, idx) =>
                    item.title && (
                      <li key={idx}>
                        <Link
                          href={`${item.link}`}
                          className="hover:text-white transition-colors duration-200"
                        >
                          <CMSkeleton
                            count={1}
                            height={10}
                            loading={loading}
                            data={item.title}
                          />
                        </Link>
                      </li>
                    ),
                )}
              </ul>
            </div>
          )}

          {/* Section 3: GET IN TOUCH (Block 1) (spans 2-3 cols) */}
          {storeCustomizationSetting?.footer?.block1_status && (
            <div className="lg:col-span-3">
              <h3 className="text-lg font-bold text-gray-100 mb-6 tracking-wide uppercase">
                <CMSkeleton
                  count={1}
                  height={20}
                  loading={loading}
                  data={storeCustomizationSetting?.footer?.block1_title}
                />
              </h3>
              <ul className="space-y-4 text-sm text-gray-400">
                <li className="block">
                  <span className="block text-gray-500 font-medium mb-1 uppercase text-xs tracking-wider">
                    Address
                  </span>
                  <p className="leading-relaxed">
                    123 Innovation Drive, Tech Park,
                    <br />
                    Sector 45, Gurgaon, Haryana - 122003
                  </p>
                </li>
                <li className="block">
                  <span className="block text-gray-500 font-medium mb-1 uppercase text-xs tracking-wider">
                    Email
                  </span>
                  <a
                    href="mailto:irtiqazaffari@gmail.com@gmail.com"
                    className="hover:text-white transition-colors"
                  >
                    irtiqazaffari@gmail.com@gmail.com
                  </a>
                </li>
                <li className="block">
                  <span className="block text-gray-500 font-medium mb-1 uppercase text-xs tracking-wider">
                    Phone
                  </span>
                  <a
                    href="tel:+918904056999"
                    className="hover:text-white transition-colors"
                  >
                    +91 8904056999
                  </a>
                </li>
              </ul>
            </div>
          )}

          {/* Section 4: POLICIES (spans 3 cols) */}
          <div className="lg:col-span-3">
            {storeCustomizationSetting?.footer?.block3_status && (
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-100 mb-6 tracking-wide">
                  <CMSkeleton
                    count={1}
                    height={20}
                    loading={loading}
                    data={storeCustomizationSetting?.footer?.block3_title}
                  />
                </h3>
                <ul className="space-y-3 text-sm text-gray-400">
                  <li className="flex items-center">
                    <Link
                      href={`${
                        userInfo?.email
                          ? storeCustomizationSetting?.footer?.block3_sub_link1
                          : "/terms-and-conditions"
                      }`}
                      className="hover:text-white transition-colors duration-200"
                    >
                      <CMSkeleton
                        count={1}
                        height={10}
                        loading={loading}
                        data={
                          storeCustomizationSetting?.footer?.block3_sub_title1
                        }
                      />
                    </Link>
                  </li>
                  <li className="flex items-center">
                    <Link
                      href={`${
                        userInfo?.email
                          ? storeCustomizationSetting?.footer?.block3_sub_link2
                          : "/privacy-policy"
                      }`}
                      className="hover:text-white transition-colors duration-200"
                    >
                      <CMSkeleton
                        count={1}
                        height={10}
                        loading={loading}
                        data={
                          storeCustomizationSetting?.footer?.block3_sub_title2
                        }
                      />
                    </Link>
                  </li>
                </ul>
              </div>
            )}

            {/* Socials */}
            {storeCustomizationSetting?.footer?.social_links_status && (
              <div>
                <h4 className="text-sm font-medium text-gray-300 mb-4">
                  {t("common:footer-follow-us")}
                </h4>
                <div className="flex gap-4">
                  {storeCustomizationSetting?.footer?.social_facebook && (
                    <Link
                      href={`${storeCustomizationSetting?.footer?.social_facebook}`}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-gray-800 p-2 rounded-full hover:bg-white hover:text-gray-800 transition-all hover:scale-110 text-white"
                      aria-label="Facebook"
                    >
                      <FacebookIcon
                        size={20}
                        round
                        bgStyle={{ fill: "transparent" }}
                        iconFillColor="currentColor"
                      />
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
                      <TwitterIcon
                        size={20}
                        round
                        bgStyle={{ fill: "transparent" }}
                        iconFillColor="currentColor"
                      />
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
                      <PinterestIcon
                        size={20}
                        round
                        bgStyle={{ fill: "transparent" }}
                        iconFillColor="currentColor"
                      />
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
                      <LinkedinIcon
                        size={20}
                        round
                        bgStyle={{ fill: "transparent" }}
                        iconFillColor="currentColor"
                      />
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
                      <WhatsappIcon
                        size={20}
                        round
                        bgStyle={{ fill: "transparent" }}
                        iconFillColor="currentColor"
                      />
                    </Link>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Area */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-gray-500">
          <div className="flex-1">
            <p className="text-center md:text-left">
              &copy; {new Date().getFullYear()} All rights reserved. Designed &
              Developed by{" "}
              <a
                href="https://irtiqazaffari@gmail.com@gmail.com"
                target="_blank"
                rel="noreferrer"
                className="text-white"
              >
                Krishanu Rastogi
              </a>
            </p>
          </div>

          {storeCustomizationSetting?.footer?.payment_method_status && (
            <div className="flex items-center gap-3 justify-center md:justify-end">
              <span className="text-xs text-gray-500 font-medium tracking-wider uppercase hidden sm:block">
                We Accept
              </span>
              <div className="bg-white/90 px-3 py-1.5 rounded shadow-sm border border-gray-200/20 backdrop-blur-sm transition-transform hover:scale-105 duration-300">
                <Image
                  width={274}
                  height={45}
                  className="w-auto h-24 lg:h-7 object-contain"
                  src={
                    storeCustomizationSetting?.footer?.payment_method_img ||
                    "/payment-method/payment-logo.png"
                  }
                  alt="payment method"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default dynamic(() => Promise.resolve(Footer), { ssr: false });
