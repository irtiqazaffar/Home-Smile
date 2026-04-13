import Image from "next/image";
import { useRouter } from "next/router";
import { useContext } from "react";
import { IoChevronForwardSharp } from "react-icons/io5";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import SwiperCore, { Navigation, Pagination } from 'swiper';

SwiperCore.use([Navigation, Pagination]);

//internal import

import useAsync from "@hooks/useAsync";
import CategoryServices from "@services/CategoryServices";
import CMSkeleton from "@components/preloader/CMSkeleton";
import { SidebarContext } from "@context/SidebarContext";
import useUtilsFunction from "@hooks/useUtilsFunction";
import ClipLoader from "react-spinners/ClipLoader";
import DUMMY_IMAGE from "@components/constants";
import useGetSetting from "@hooks/useGetSetting";

const FeatureCat = () => {
  const router = useRouter();
  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const { showingTranslateValue } = useUtilsFunction();
  const { lang, storeCustomizationSetting } = useGetSetting();

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

  const buyInBulk = async () => {
    router.push("/contact-us");
    setIsLoading(!isLoading);
  }

  const bestSelling = async () => {
    router.push("/search");
    setIsLoading(!isLoading);
  }

  const newArrivals = async () => {
    router.push("/search?query=latest");
    setIsLoading(!isLoading);
  }

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
        <div className="px-4 md:px-8 lg:px-12 mt-20 pb-2 hidden">
          <Swiper
            slidesPerView={4}
            spaceBetween={10}
            // navigation
            // pagination={{ clickable: true }}
            className="mySwiper"
          >
            <SwiperSlide>
              <div
                className="flex flex-col cursor-pointer overflow-hidden transition-transform duration-200 ease-in-out"
                onClick={newArrivals}
              >
                <div className="relative w-[60px] h-[60px] overflow-hidden group">
                  <Image
                    src="https://homesmile.com/_next/image?url=https%3A%2F%2Fres.cloudinary.com%2Fdjrbdgtzr%2Fimage%2Fupload%2Fv1734705340%2Fproduct%2F46468468.png&w=640&q=75"
                    alt="New Arrivals"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="w-full h-full rounded-full transition-transform duration-[1000ms] ease-in-out transform group-hover:scale-105"
                    sizes="60px"
                  />
                </div>
                <div className="text-xs mt-2 text-center">New Arrivals</div>
              </div>
            </SwiperSlide>

            <SwiperSlide>
              <div
                className="flex flex-col cursor-pointer overflow-hidden transition-transform duration-200 ease-in-out"
                onClick={bestSelling}
              >
                <div className="relative w-[60px] h-[60px] overflow-hidden group">
                  <Image
                    src={storeCustomizationSetting?.home?.quick_delivery_img}
                    alt="Best Selling"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="w-full h-full rounded-full transition-transform duration-[1000ms] ease-in-out transform group-hover:scale-105"
                    sizes="60px"
                  />
                </div>
                <div className="text-xs mt-2 text-center">Best Selling</div>
              </div>
            </SwiperSlide>

            {data[0]?.children?.slice(0, 12)?.map((category, i) => (
              <SwiperSlide key={i}>
                <div
                  className="flex flex-col cursor-pointer overflow-hidden transition-transform duration-200 ease-in-out"
                  onClick={() =>
                    handleCategoryClick(category._id, showingTranslateValue(category?.name))
                  }
                >
                  <div className="relative w-[60px] h-[60px] overflow-hidden group">
                    <Image
                      src={category?.icon || DUMMY_IMAGE}
                      alt={category?.name?.en}
                      fill
                      style={{ objectFit: 'cover' }}
                      className="w-full h-full rounded-full transition-transform duration-[1000ms] ease-in-out transform group-hover:scale-105"
                      sizes="60px"
                    />
                  </div>
                  <div className="text-xs mt-2 text-center">
                    {category?.name?.en.toLowerCase()}
                  </div>
                </div>
              </SwiperSlide>
            ))}

            <SwiperSlide>
              <div
                className="flex flex-col cursor-pointer overflow-hidden transition-transform duration-200 ease-in-out"
                onClick={buyInBulk}
              >
                <div className="relative w-[60px] h-[60px] overflow-hidden group">
                  <Image
                    src="https://webkul.com/blog/wp-content/uploads/2014/06/Bulk-Buy-Banner.png"
                    alt="Buy In Bulk"
                    fill
                    style={{ objectFit: 'cover' }}
                    className="w-full h-full rounded-full transition-transform duration-[1000ms] ease-in-out transform group-hover:scale-105"
                    sizes="60px"
                  />
                </div>
                <div className="text-xs mt-2 text-center">Buy In Bulk</div>
              </div>
            </SwiperSlide>
          </Swiper>
        </div>
      )}
    </>
  );
};

export default FeatureCat;
