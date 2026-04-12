import DUMMY_IMAGE from "@components/constants";
import React from "react";

const PageHeader = ({ title, headerBg }) => {
  return (
    <div
      style={{ backgroundImage: `url(${headerBg || DUMMY_IMAGE})` }}
      className={`flex justify-center  bg-indigo-100 w-full h-[300px] bg-cover bg-no-repeat bg-bottom relative`}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="flex mx-auto w-full max-w-screen-2xl px-3 sm:px-10">
        <div className="w-full flex justify-center flex-col relative">
          <h2 className="text-xl md:text-3xl lg:text-4xl text-white font-bold font-serif text-center">
            {title}
          </h2>
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
