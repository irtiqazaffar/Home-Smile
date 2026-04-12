import React from "react";

const Main = ({ children }) => {
  return (
    <main className="h-full overflow-y-auto">
      <div className="sm:container grid lg:px-6 sm:px-4 px-2 mx-5 md:mx-0">
        {children}
      </div>
    </main>
  );
};

export default Main;
