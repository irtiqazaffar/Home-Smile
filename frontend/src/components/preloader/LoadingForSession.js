import React from "react";
import CMSkeletonTwo from "./CmSkeletonTwo";
import ClipLoader from "react-spinners/ClipLoader";

const LoadingForSession = () => {
  return (
    <div className="mx-auto max-w-screen-2xl px-4 sm:px-10">
      <div className="flex items-center justify-center h-screen">
        <div className="text-lg text-center py-6">
          <img
            width={150}
            height={130}
            src="/logo.png"
            alt="logo"
            className="mb-4"
          />
          <ClipLoader
            color="#34D399"
            height={30}
            width={3}
            radius={3}
            margin={2}
          />
        </div>
      </div>
    </div>
  );
};

export default LoadingForSession;
