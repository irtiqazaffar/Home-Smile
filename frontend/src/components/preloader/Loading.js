import React from "react";
import Image from "next/image";
import ClipLoader from "react-spinners/ClipLoader";
import PulseLoader from "react-spinners/PulseLoader";
import useGetSetting from "@hooks/useGetSetting";
import NavBarTop from "@layout/navbar/NavBarTop";
import Navbar from "@layout/navbar/Navbar";
import MobileFooter from "@layout/footer/MobileFooter";

const Loading = ({ loading }) => {
  const { storeCustomizationSetting } = useGetSetting();
  return (
    <>
      <MobileFooter />
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-center py-6">
          <Image
            width={150}
            height={130}
            src="/logo.png"
            alt="logo"
            className="mb-4"
          />
          <ClipLoader
            color="#34D399"
            loading={loading}
            height={30}
            width={3}
            radius={3}
            margin={2}
          />
        </div>
      </div>
    </>
  );
};

export default Loading;
