import Image from "next/image";
import { useRouter } from "next/router";
import { useContext } from "react";
import { IoChevronForwardSharp } from "react-icons/io5";

//internal import

import useAsync from "@hooks/useAsync";
import CategoryServices from "@services/CategoryServices";
import CMSkeleton from "@components/preloader/CMSkeleton";
import { SidebarContext } from "@context/SidebarContext";
import useUtilsFunction from "@hooks/useUtilsFunction";
import ClipLoader from "react-spinners/ClipLoader";
import DUMMY_IMAGE from "@components/constants";

const FeatureCategory = () => {
  const router = useRouter();
  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const { showingTranslateValue } = useUtilsFunction();

  const { data, error, loading } = useAsync(
    CategoryServices.getShowingCategory
  );

  // console.log('category',data)

  const handleCategoryClick = (id, categoryName) => {
    const category_name = categoryName
      .toLowerCase()
      .replace(/[^A-Z0-9]+/gi, "-");
    const url = `/search?category=${category_name}&_id=${id}`;
    router.push(url);
    setIsLoading(!isLoading);
  };

  return (
    <>
      {loading ? (
        <div className="flex items-center justify-center h-screen">
            <div className="text-lg text-center py-6">
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
      ) : (
        <ul className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3">
  {data[0]?.children?.slice(0, 12)?.map((category, i) => (
    <li className="group" key={i + 1}>
      <div className="relative flex flex-col border h-[218px] lg:h-[400px] border-gray-300 cursor-pointer rounded-lg overflow-hidden transition-transform duration-200 ease-in-out" onClick={() => handleCategoryClick(category._id, showingTranslateValue(category?.name)) }>
        
        {/* Image */}
        <div className="relative w-full h-32 lg:h-80 overflow-hidden group">
          <Image
            src={category?.icon || DUMMY_IMAGE}
            alt="category"
            fill
            style={{ objectFit: 'cover' }}
            className="w-full h-full transition-transform duration-[1000ms] ease-in-out transform group-hover:scale-105"
            sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 250px"
          />
        </div>

        {/* Title below image */}
        <div className="p-4 text-start">
          <h3
            onClick={() =>
              handleCategoryClick(
                category._id,
                showingTranslateValue(category?.name)
              )
            }
            className="text-gray-800 text-sm font-medium leading-tight"
          >
            {showingTranslateValue(category?.name)}
            <span className="text-lg text-bold"> →</span>
          </h3>
        </div>
      </div>
    </li>
  ))}
</ul>

      )}
    </>
  );
};

export default FeatureCategory;
