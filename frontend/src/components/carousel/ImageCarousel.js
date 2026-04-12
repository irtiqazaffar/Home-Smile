import dynamic from "next/dynamic";
import Image from "next/image";
import { useRef } from "react";
import { IoChevronBackOutline, IoChevronForward } from "react-icons/io5"; // requires a loader
import { Navigation } from "swiper";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";

const ImageCarousel = ({ images, setImg, handleChangeImage, activeImage }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <>
      <Swiper
        spaceBetween={1}
        navigation={false}
        allowTouchMove={false}
        loop={true}
        slidesPerView={4}
        modules={[Navigation]}
        className="mySwiper image-carousel"
      >
        {images?.map((img, i) => (
          <SwiperSlide key={i} className="mt-5 p-2 group">
            {/*
              mark active thumbnail when its src equals activeImage.
              adjust classes as you prefer (ring, border, scale, etc).
            */}
            <button
              onClick={() => handleChangeImage(img)}
              className={`inline-block p-1 rounded transition-transform duration-150 p-4 ${
                activeImage === img
                  ? "bg-black/10 scale-105"
                  : "ring-0 hover:scale-105"
              }`}
            >
              <Image
                className="w-12 lg:w-20 h-12 lg:h-20 object-cover rounded"
                src={img}
                alt={`Thumbnail ${i + 1}`}
                width={100}
                height={100}
              />
            </button>
          </SwiperSlide>
        ))}
        <button ref={prevRef} className="prev">
          <IoChevronBackOutline />
        </button>
        <button ref={nextRef} className="next">
          <IoChevronForward />
        </button>
      </Swiper>
    </>
  );
};

export default dynamic(() => Promise.resolve(ImageCarousel), { ssr: false });
