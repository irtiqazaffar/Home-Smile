import Head from "next/head";
import { ToastContainer } from "react-toastify";

//internal import

import Navbar from "@layout/navbar/Navbar";
import Footer from "@layout/footer/Footer";
import NavBarTop from "./navbar/NavBarTop";
import FooterTop from "@layout/footer/FooterTop";
import MobileFooter from "@layout/footer/MobileFooter";
import FeatureCard from "@components/feature-card/FeatureCard";
import { FaWhatsapp, FaArrowUp } from "react-icons/fa";
import useGetSetting from "@hooks/useGetSetting";
import { useEffect, useState } from "react";
const Layout = ({ title, description, children }) => {
  const { storeCustomizationSetting } = useGetSetting();
  const [isVisible, setIsVisible] = useState(false);

  // Scroll visibility logic for the back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      setIsVisible(scrollTop > 100); // Show button after scrolling 100px
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Scroll to the top function
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const [iconSize, setIconSize] = useState(20); // Default to desktop size

  useEffect(() => {
    const updateIconSize = () => {
      if (window.innerWidth <= 768) { // Mobile view (adjust breakpoint as needed)
        setIconSize(10);
      } else {
        setIconSize(20);
      }
    };

    updateIconSize(); // Initial size setting
    window.addEventListener('resize', updateIconSize); // Update on window resize

    return () => {
      window.removeEventListener('resize', updateIconSize); // Cleanup
    };
  }, []);

  return (
    <>
      <ToastContainer />

      <div className="font-sans">
        <Head>
          <title>
            {title
              ? `Home Smile | ${title}`
              : "Home Smile | Decore your Home with Home Smile"}
          </title>
          <meta name="description" content={description || "Decore your Home with Home Smile"} />
          <link rel="icon" href="/favicon1.png" />
        </Head>
        <NavBarTop />
        <Navbar />
        <div className="bg-gray-50 md:mt-0 mt-16">{children}</div>
        <MobileFooter />
        <div className="w-full">
          <div className="w-full">
            <Footer />
          </div>
        </div>
      </div>

      {isVisible && (
        <div
          className="fixed bottom-14 right-5 bg-gray-800 text-white rounded-full p-4 cursor-pointer shadow-lg hover:bg-gray-800 transition duration-300"
          style={{ zIndex: 1000 }} // Ensures it's on top of other content
          onClick={scrollToTop} // Scroll to top on click
        >
          <FaArrowUp size={iconSize} /> {/* Back to Top Icon */}
        </div>
      )}
    </>
  );
};

export default Layout;
