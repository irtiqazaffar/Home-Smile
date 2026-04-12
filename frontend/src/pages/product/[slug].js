import useTranslation from "next-translate/useTranslation";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import { FiChevronRight, FiMinus, FiPlus } from "react-icons/fi";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
//internal import

import Price from "@components/common/Price";
import Stock from "@components/common/Stock";
import Tags from "@components/common/Tags";
import Layout from "@layout/Layout";
import { notifyError } from "@utils/toast";
import Card from "@components/slug-card/Card";
import useAddToCart from "@hooks/useAddToCart";
import Loading from "@components/preloader/Loading";
import ProductCard from "@components/product/ProductCard";
import VariantList from "@components/variants/VariantList";
import { SidebarContext } from "@context/SidebarContext";
import AttributeServices from "@services/AttributeServices";
import ProductServices from "@services/ProductServices";
import useUtilsFunction from "@hooks/useUtilsFunction";
import Discount from "@components/common/Discount";
import ImageCarousel from "@components/carousel/ImageCarousel";
import Review from "@components/product/Review";
import ReviewList from "@components/product/ReviewList";
import { getUserSession } from "@lib/auth";
import RatingServices from "@services/RatingServices";
import DUMMY_IMAGE from "@components/constants";
import useGetSetting from "@hooks/useGetSetting";
import { useRef } from "react";

const ProductScreen = ({ product, ratings, attributes, relatedProducts }) => {
  const router = useRouter();

  const userInfo = getUserSession();
  // console.log("Product variants ", VariantList);

  const showProduct = relatedProducts.filter(product => product?.status === "show");

  const { loading, storeCustomizationSetting } = useGetSetting();

  const { lang, showingTranslateValue, getNumber, currency } =
    useUtilsFunction();


  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const { handleAddItem, item, setItem } = useAddToCart();

  // react hook

  const [value, setValue] = useState("");
  const [price, setPrice] = useState(0);
  const [img, setImg] = useState("");
  const [originalPrice, setOriginalPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [selectVariant, setSelectVariant] = useState({});
  const [isReadMore, setIsReadMore] = useState(true);
  const [selectVa, setSelectVa] = useState({});
  const [variantTitle, setVariantTitle] = useState([]);
  const [variants, setVariants] = useState([]);

  // console.log("variantTitle RRRRTTTTTT ", variantTitle);

  // console.log("setValue ", value);
  // console.log("setSelectVariant ", setSelectVariant);
  // console.log("setSelectVa ", setSelectVa);

  useEffect(() => {
    if (value) {
      const result = product?.variants?.filter((variant) =>
        Object.keys(selectVa).every((k) => selectVa[k] === variant[k])
      );

      //just check bellow code and make sure your code also same
      const res = result?.map(
        ({
          originalPrice,
          price,
          discount,
          quantity,
          barcode,
          sku,
          productId,
          image,
          ...rest
        }) => ({ ...rest })
      );
      // console.log("res", res);

      const filterKey = Object.keys(Object.assign({}, ...res));
      const selectVar = filterKey?.reduce(
        (obj, key) => ({ ...obj, [key]: selectVariant[key] }),
        {}
      );
      const newObj = Object.entries(selectVar).reduce(
        (a, [k, v]) => (v ? ((a[k] = v), a) : a),
        {}
      );

      const result2 = result?.find((v) =>
        Object.keys(newObj).every((k) => newObj[k] === v[k])
      );

      // console.log("result2", result2);
      if (result.length <= 0 || result2 === undefined) return setStock(0);

      setVariants(result);
      setSelectVariant(result2);
      setSelectVa(result2);
      setImg(result2?.image);
      setStock(result2?.quantity);
      const price = getNumber(result2?.price);
      const originalPrice = getNumber(result2?.originalPrice);
      const discountPercentage = getNumber(
        ((originalPrice - price) / originalPrice) * 100
      );
      setDiscount(getNumber(discountPercentage));
      setPrice(price);
      setOriginalPrice(originalPrice);
    } else if (product?.variants?.length > 0) {
      const result = product?.variants?.filter((variant) =>
        Object.keys(selectVa).every((k) => selectVa[k] === variant[k])
      );

      setVariants(result);
      setStock(product.variants[0]?.quantity);
      setSelectVariant(product.variants[0]);
      setSelectVa(product.variants[0]);
      setImg(product.variants[0]?.image);
      const price = getNumber(product.variants[0]?.price);
      const originalPrice = getNumber(product.variants[0]?.originalPrice);
      const discountPercentage = getNumber(
        ((originalPrice - price) / originalPrice) * 100
      );
      setDiscount(getNumber(discountPercentage));
      setPrice(price);
      setOriginalPrice(originalPrice);
    } else {
      setStock(product?.stock);
      setImg(product?.image[0]);
      const price = getNumber(product?.prices?.price);
      const originalPrice = getNumber(product?.prices?.originalPrice);
      const discountPercentage = getNumber(
        ((originalPrice - price) / originalPrice) * 100
      );
      setDiscount(getNumber(discountPercentage));
      setPrice(price);
      setOriginalPrice(originalPrice);
    }
  }, [
    product?.prices?.discount,
    product?.prices?.originalPrice,
    product?.prices?.price,
    product?.stock,
    product.variants,
    selectVa,
    selectVariant,
    value,
  ]);

  useEffect(() => {
    const res = Object.keys(Object.assign({}, ...product?.variants));
    const varTitle = attributes?.filter((att) => res.includes(att?._id));

    setVariantTitle(varTitle?.sort());
  }, [variants, attributes]);

  useEffect(() => {
    setIsLoading(false);
  }, [product]);


  const handleBuyNow = (p) => {
    if (item < p?.moq) {
      return notifyError(`Minimum order quantity is ${p?.moq}`);
    }
    if (p.variants.length === 1 && p.variants[0].quantity < 1)
      return notifyError("Insufficient stock");
    // if (notAvailable) return notifyError('This Variation Not Available Now!');
    if (stock <= 0) return notifyError("Insufficient stock");
    // console.log('selectVariant', selectVariant);

    if (
      product?.variants.map(
        (variant) =>
          Object.entries(variant).sort().toString() ===
          Object.entries(selectVariant).sort().toString()
      )
    ) {
      const { variants, categories, description, ...updatedProduct } = product;
      const newItem = {
        ...updatedProduct,
        id: `${p.variants.length <= 1
          ? p._id
          : p._id +
          variantTitle
            ?.map(
              // (att) => selectVariant[att.title.replace(/[^a-zA-Z0-9]/g, '')]
              (att) => selectVariant[att._id]
            )
            .join("-")
          }`,

        title: `${p.variants.length <= 1
          ? showingTranslateValue(product?.title)
          : showingTranslateValue(product?.title) +
          "-" +
          variantTitle
            ?.map(
              // (att) => selectVariant[att.title.replace(/[^a-zA-Z0-9]/g, '')]
              (att) =>
                att.variants?.find((v) => v._id === selectVariant[att._id])
            )
            .map((el) => showingTranslateValue(el?.name))
          }`,
        image: img,
        variant: selectVariant,
        price: price,
        originalPrice: originalPrice,
      };
      handleAddItem(newItem);
      router.push("/checkout");
    } else {
      return notifyError("Please select all variant first!");
    }
  };

  const handleAddToCart = (p) => {
    if (item < p?.moq) {
      return notifyError(`Minimum order quantity is ${p?.moq}`);
    }
    if (p.variants.length === 1 && p.variants[0].quantity < 1)
      return notifyError("Insufficient stock");
    // if (notAvailable) return notifyError('This Variation Not Available Now!');
    if (stock <= 0) return notifyError("Insufficient stock");
    // console.log('selectVariant', selectVariant);

    if (
      product?.variants.map(
        (variant) =>
          Object.entries(variant).sort().toString() ===
          Object.entries(selectVariant).sort().toString()
      )
    ) {
      const { variants, categories, description, ...updatedProduct } = product;
      const newItem = {
        ...updatedProduct,
        id: `${p.variants.length <= 1
          ? p._id
          : p._id +
          variantTitle
            ?.map(
              // (att) => selectVariant[att.title.replace(/[^a-zA-Z0-9]/g, '')]
              (att) => selectVariant[att._id]
            )
            .join("-")
          }`,

        title: `${p.variants.length <= 1
          ? showingTranslateValue(product?.title)
          : showingTranslateValue(product?.title) +
          "-" +
          variantTitle
            ?.map(
              // (att) => selectVariant[att.title.replace(/[^a-zA-Z0-9]/g, '')]
              (att) =>
                att.variants?.find((v) => v._id === selectVariant[att._id])
            )
            .map((el) => showingTranslateValue(el?.name))
          }`,
        image: img,
        variant: selectVariant,
        price: price,
        originalPrice: originalPrice,
      };
      handleAddItem(newItem);
    } else {
      return notifyError("Please select all variant first!");
    }
  };

  const scrollContainerRef = useRef(null);

  const handleChangeImage = (img) => {
    setImg(img)
    // const scrollContainer = scrollContainerRef.current;
    // if (scrollContainer) {
    //   const imageWidth = scrollContainer.firstChild.offsetWidth; // Dynamically get the width of the first child
    //   const scrollOffset = index * imageWidth; // Calculate the position based on the dynamic width
    //   scrollContainer.scrollTo({
    //     left: scrollOffset,
    //     behavior: "smooth",
    //   });
    // }
  };



  const orderOnWhatsapp = () => {
    const url = `https://api.whatsapp.com/send?phone=${storeCustomizationSetting?.footer?.bottom_contact}&text=I%20found%20this%20product%20on%20your%20website:%20${window.location.href}`;
    window.open(url, "_blank");
  }

  const viewInYourSpace = () => {
    // Redirect to the viewInYourSpace page with the product's image as a query parameter
    router.push(`/viewInYourSpace?image=${encodeURIComponent(product.image[0])}`);
  };

  const { globalSetting } = useGetSetting();

  const { t } = useTranslation();

  // category name slug
  const category_name = showingTranslateValue(product?.category?.name)
    .toLowerCase()
    .replace(/[^A-Z0-9]+/gi, "-");

  // console.log("discount", product);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isImgDisplayed, setIsImgDisplayed] = useState(Boolean(img)); // Track if `img` is displayed

  // Update `isImgDisplayed` whenever `img` changes
  useEffect(() => {
    if (img) {
      setIsImgDisplayed(true);
    }
  }, [img]);

  const handleNext = () => {
    if (isImgDisplayed) {
      setIsImgDisplayed(false); // Switch to cycling `product.image`
    } else {
      setCurrentIndex((prevIndex) =>
        prevIndex === product.image.length - 1 ? 0 : prevIndex + 1
      );
    }
  };

  const handlePrev = () => {
    if (isImgDisplayed) {
      setIsImgDisplayed(false); // Switch to cycling `product.image`
    } else {
      setCurrentIndex((prevIndex) =>
        prevIndex === 0 ? product.image.length - 1 : prevIndex - 1
      );
    }
  };

  return (
    <>
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <Layout
          title={showingTranslateValue(product?.metatitle)}
          description={showingTranslateValue(product?.metadescription)}
        >
          <div className="px-0 py-0 lg:py-10">
            <div className="mx-auto px-3 lg:px-10 max-w-screen-2xl">
              <div className="flex items-center pb-4">
                <ol className="flex items-center w-full overflow-hidden font-serif">
                  <li className="text-sm pr-1 transition duration-200 ease-in cursor-pointer hover:text-emerald-500 font-semibold">
                    <Link href="/">Home</Link>
                  </li>
                  <li className="text-sm mt-[1px]">
                    {" "}
                    <FiChevronRight />{" "}
                  </li>
                  <li className="text-sm pl-1 transition duration-200 ease-in cursor-pointer hover:text-emerald-500 font-semibold ">
                    <Link
                      href={`/search?category=${category_name}&_id=${product?.category?._id}`}
                    >
                      <button
                        type="button"
                        onClick={() => setIsLoading(!isLoading)}
                      >
                        {category_name}
                      </button>
                    </Link>
                  </li>
                  <li className="text-sm mt-[1px]">
                    {" "}
                    <FiChevronRight />{" "}
                  </li>
                  <li className="text-sm px-1 transition duration-200 ease-in ">
                    {showingTranslateValue(product?.title)}
                  </li>
                </ol>
              </div>
              <div className="w-full rounded-lg p-3 lg:p-12 bg-white">
                <div className="flex flex-col xl:flex-row">
                  <div className="flex-shrink-0 xl:pr-10 lg:block w-full mx-auto md:w-6/12 lg:w-6/12 xl:w-6/12 pl-0 lg:pl-16">

                    {/* Main Image Scrollable Section */}
                    {product?.image?.length > 1 ? (
                      <div className="w-full h-auto flex items-center justify-center space-x-4 md:space-x-8">
                        {/* Left Arrow */}
                        <button
                          className="bg-black text-white p-2 shadow-lg focus:outline-none rounded-full z-10"
                          onClick={handlePrev}
                          aria-label="Previous image"
                        >
                          &#8249;
                        </button>

                        {/* Image Display (constrained width so arrows have space) */}
                        <div className="relative w-full max-w-[460px]">
                          {/* absolute positioned badge — adjust top/left for spacing */}
                          <div className="absolute top-2 left-2 md:top-2 md:left-2">
                            <Discount slug product={product} discount={discount} />
                          </div>

                          <Image
                            src={
                              isImgDisplayed
                                ? img || DUMMY_IMAGE
                                : (product?.image && product.image[currentIndex]) || DUMMY_IMAGE
                            }
                            alt={`Product Image ${isImgDisplayed ? "Custom Image" : currentIndex + 1}`}
                            width={460}
                            height={460}
                            className="object-cover h-auto w-full rounded-lg"
                            priority
                          />
                        </div>

                        {/* Right Arrow */}
                        <button
                          className="bg-black text-white p-2 shadow-lg focus:outline-none rounded-full z-10"
                          onClick={handleNext}
                          aria-label="Next image"
                        >
                          &#8250;
                        </button>
                      </div>
                    ) : (
                      <Image
                        src={product.image[0] || DUMMY_IMAGE}
                        alt="Product Image"
                        width={460}
                        height={460}
                        priority
                      />
                    )}

                    {/* Image Carousel (Thumbnails) */}
                    {product?.image?.length > 1 && (
                      <div className="flex flex-row flex-wrap justify-between">
                        <ImageCarousel
                          images={product.image}
                          setImg={setImg}
                          handleChangeImage={handleChangeImage} // Pass the updated handler
                          activeImage={isImgDisplayed ? img : product.image[currentIndex]} // <-- pass current displayed image
                        />
                      </div>
                    )}
                  </div>

                  <div className="w-full">
                    <div className="flex flex-col md:flex-row lg:flex-row xl:flex-row">
                      <div className="xl:pr-6 md:pr-6  md:w-3/3 mob-w-full">
                        <div className="mb-4">
                          <h1 className="leading-7 text-lg md:text-xl lg:text-2xl mb-4 font-semibold font-poppins text-gray-800">
                            {showingTranslateValue(product?.title)}
                          </h1>
                          <div className="flex md:flex-row justify-between items-center mb-4">
                            <span className="text-base md:text-lg text-gray-900">
                              <Price
                                price={price}
                                product={product}
                                currency={currency}
                                originalPrice={originalPrice}
                              />
                            </span>
                            {/* <span className="text-sm md:text-base text-teal-600 font-large mt-2 md:mt-0">
                                <Stock stock={stock} />
                              </span> */}
                          </div>
                          <hr></hr>
                        </div>
                        <div className="mb-4">
                          {variantTitle?.map((a, i) => (
                            <span key={i + 1}>
                              <h4 className="text-md font-semibold mb-3">
                                {showingTranslateValue(a?.name)}:
                              </h4>
                              <div className="flex flex-row">
                                <VariantList
                                  att={a._id}
                                  lang={lang}
                                  option={a.option}
                                  setValue={setValue}
                                  varTitle={variantTitle}
                                  setSelectVa={setSelectVa}
                                  variants={product.variants}
                                  selectVariant={selectVariant}
                                  setSelectVariant={setSelectVariant}
                                />
                              </div>
                            </span>
                          ))}
                        </div>
                        <div>
                          <div>
                            <span className="font-semibold mb-4">COD : {product?.isCodAvaialble ? "Available" : "Not Available"}</span>
                          </div>

                          {/* <div className="bg-green-50 p-4 rounded-md">
                                <div className="flex justify-between items-center">
                                  <div className="flex items-center">
                                    <div className="bg-green-500 text-white text-sm font-semibold rounded-full h-6 w-6 flex items-center justify-center mr-2">
                                      %
                                    </div>
                                    <span className="text-lg font-semibold">Best price:- ₹4962</span>
                                  </div>
                                  <span className="bg-green-500 text-white text-sm font-semibold px-2 py-1 rounded">
                                    SAVED ₹551
                                  </span>
                                </div>
                                <div className="mt-2 flex justify-between items-center">
                                  <span className="text-sm">Use coupon <span className="font-semibold">FIRSTLOOK</span></span>
                                  <button className="text-green-600 font-semibold">
                                    Copy Code
                                  </button>
                                </div>
                              </div> */}

                          {/* <div className="flex flex-row items-center mt-4 space-x-4">
                                  Order on WhatsApp Button
                              <div className="flex-1 flex items-center justify-center">
                                  <img
                                    src="/orderonwhatsapp.png"
                                    alt="WhatsApp"
                                    onClick={orderOnWhatsapp}
                                    className="w-1/2 sm:w-1/2 cursor-pointer lg:w-1/3 lg:h-auto"
                                  />
                              </div>
                                  View in Your Space Button
                                  <img
                                    src="/viewspace.png"
                                    alt="AR"
                                    onClick={viewInYourSpace}
                                    className="w-1/2 cursor-pointer sm:w-1/2 lg:w-1/3 lg:h-auto"
                                  />
                                  <div className="group w-1/2 sm:w-1/2 lg:w-1/3 flex items-center justify-between rounded-md overflow-hidden flex-shrink-0 border h-12 md:h-16 border-gray-300 mb-4 mt-4 md:mb-0">
                                      <button
                                        onClick={() => setItem(item - 1)}
                                        disabled={item === 1}
                                        className="flex items-center justify-center flex-shrink-0 h-full transition ease-in-out duration-300 focus:outline-none w-10 text-heading border-e border-gray-300 hover:text-gray-500"
                                      >
                                        <span className="text-dark text-xl"> Increased text size for better visibility
                                          <FiMinus />
                                        </span>
                                      </button>
                                      <p className="font-semibold flex items-center justify-center h-full transition-colors duration-250 ease-in-out cursor-default flex-shrink-0 text-lg text-heading w-12"> Adjusted width for better alignment
                                        {item}
                                      </p>
                                      <button
                                        onClick={() => setItem(item + 1)}
                                        disabled={selectVariant?.quantity <= item}
                                        className="flex items-center justify-center h-full flex-shrink-0 transition ease-in-out duration-300 focus:outline-none w-10 text-heading border-s border-gray-300 hover:text-gray-500"
                                      >
                                        <span className="text-dark text-xl"> Increased text size for better visibility
                                          <FiPlus />
                                        </span>
                                      </button>
                                  </div>
                              </div> */}
                          {product?.moq > 1 && (
                            <div className="w-full">
                              {Array.from({ length: 5 }, (_, i) => {
                                const moq = product?.moq * (i + 1);
                                return (
                                  <button
                                    key={i}
                                    onClick={e => { setItem(moq) }}
                                    className={`${item == moq ? "bg-emerald-500 text-white" : "bg-gray-100 text-gray-600"} mr-2 border-0  hover:bg-emerald-500 hover:text-white rounded-full inline-flex items-center justify-center px-2 py-1 text-xs font-semibold font-serif mt-2`}>
                                    {moq}
                                  </button>
                                );
                              })}
                            </div>
                          )}

                          <div className="flex flex-row items-center mt-6 mb-6 space-x-4"> {/* Adjusted spacing */}
                            {/* Order on WhatsApp Button */}
                            <div className="flex-1 flex items-center"> {/* Equal space for the image */}
                              <img
                                src="/orderonwhatsapp.png"
                                alt="WhatsApp"
                                onClick={orderOnWhatsapp}
                                className="w-full max-w-[150px] sm:max-w-[200px] cursor-pointer" /* Max width ensures image scales nicely */
                              />
                            </div>

                            {/* Item Counter Section */}
                            <div className="flex-1 flex items-center"> {/* Equal space for the counter */}
                              <div className="group flex items-center justify-between w-full max-w-[200px] rounded-md overflow-hidden border h-12 md:h-16 border-gray-300">
                                <button
                                  onClick={() => setItem(item - 1)}
                                  disabled={item === 1}
                                  className="flex items-center justify-center h-full transition ease-in-out duration-300 focus:outline-none w-10 text-heading border-e border-gray-300 hover:text-gray-500"
                                >
                                  <span className="text-dark text-xl">
                                    <FiMinus />
                                  </span>
                                </button>
                                <p className="font-semibold flex items-center justify-center h-full transition-colors duration-250 ease-in-out cursor-default flex-shrink-0 text-lg text-heading w-12">
                                  {item}
                                </p>
                                <button
                                  onClick={() => setItem(item + 1)}
                                  disabled={selectVariant?.quantity <= item}
                                  className="flex items-center justify-center h-full flex-shrink-0 transition ease-in-out duration-300 focus:outline-none w-10 text-heading border-s border-gray-300 hover:text-gray-500"
                                >
                                  <span className="text-dark text-xl">
                                    <FiPlus />
                                  </span>
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="p-2 mt-4 hidden lg:flex md:flex bg-white w-full md:relative z-10"> {/* Mobile-only using md:hidden */}
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="text-sm rounded-md items-center justify-center cursor-pointer transition ease-in-out duration-300 font-semibold font-serif text-center border-0 border-transparent focus-visible:outline-none focus:outline-none text-white px-4 py-2 w-full lg:py-3 shadow-md bg-black mr-2"
                            >
                              {/* Upper side - Text */}
                              <span className="text-lg pr-0 lg:pr-4">Add to Cart</span>

                              {/* Lower side - Price */}
                              <span className="rounded-lg font-bold px-3 bg-white py-2 text-black">
                                {`${currency}${(item * price).toFixed(2)}`}
                              </span>
                            </button>

                            <button
                              onClick={() => handleBuyNow(product)}
                              className="text-sm rounded-md items-center justify-center cursor-pointer transition ease-in-out duration-300 font-semibold font-serif text-center border-0 border-transparent focus-visible:outline-none focus:outline-none text-white px-4 py-2 lg:py-3 w-full shadow-md bg-black ml-2"
                            >
                              {/* Upper side - Text */}
                              <span className="text-lg pr-0 lg:pr-4">Buy Now</span>
                              {/* Lower side - Price */}
                              <span className="rounded-lg font-bold px-3 py-2 bg-white text-black">
                                {`${currency}${(item * price).toFixed(2)}`}
                              </span>
                            </button>
                          </div>

                          <div className="flex flex-col mt-4">
                            <span className="font-serif font-semibold mb-4 text-md d-block">
                              <span className="text-gray-800">
                                {t("common:category")}:
                              </span>{" "}
                              <Link
                                href={`/search?category=${category_name}&_id=${product?.category?._id}`}
                              >
                                <button
                                  type="button"
                                  className="text-gray-800 font-serif font-medium underline ml-2 hover:text-teal-600"
                                  onClick={() => setIsLoading(!isLoading)}
                                >
                                  {category_name}
                                </button>
                              </Link>
                            </span>
                            <div>
                              <span className="font-serif font-semibold py-1 text-md d-block">
                                <span className="text-gray-800">
                                  {"Brand"}:
                                </span>{" "}
                                <span className="text-gray-900 font-serif font-medium">
                                  {showingTranslateValue(product?.brand?.name)}
                                </span>
                              </span>
                            </div>
                            {/* <Tags product={product} /> */}
                          </div>

                          <div className="text-md leading-6 text-gray-700 md:leading-7">
                            <p className="mt-4 mb-4 text-lg font-semibold tracking-wider font-serif">Description</p>
                            {/* <div className="leading-5" dangerouslySetInnerHTML={{ __html: showingTranslateValue(product?.description) ? showingTranslateValue(product?.description) : (product?.description) }} /> */}
                            <div
                              className="leading-5 your-component"
                              dangerouslySetInnerHTML={{
                                __html: showingTranslateValue(product?.description) || product?.description || '',
                              }}
                            />
                            <br />
                            {/* {Object?.keys(product?.description)?.includes(lang)
                              ? product?.description[lang]?.length > 520 && (
                                  <span
                                    onClick={() => setIsReadMore(!isReadMore)}
                                    className="read-or-hide"
                                  >
                                    {isReadMore
                                      ? t("common:moreInfo")
                                      : t("common:showLess")}
                                  </span>
                                )
                              : product?.description?.en?.length > 520 && (
                                  <span
                                    onClick={() => setIsReadMore(!isReadMore)}
                                    className="read-or-hide"
                                  >
                                    {isReadMore
                                      ? t("common:moreInfo")
                                      : t("common:showLess")}
                                  </span>
                                )} */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* related products */}
              {showProduct?.length >= 2 && (
                <div className="pt-10 lg:pt-20 lg:pb-10">
                  <h3 className="leading-7 text-lg lg:text-xl mb-3 font-semibold font-serif hover:text-gray-900">
                    {t("common:relatedProducts")}
                  </h3>
                  <div className="flex">
                    <div className="w-full">
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 2xl:grid-cols-4 gap-2 md:gap-3 lg:gap-5">
                        {showProduct?.slice(1, 13).map((product, i) => (
                          <ProductCard
                            key={product._id}
                            product={product}
                            attributes={attributes}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {/* {userInfo != null && ( */}
              <>
                <Review product={product} customer={userInfo} ratings={ratings} />
                <ReviewList reviews={ratings} />
              </>
              {/* )} */}

            </div>
          </div>
        </Layout>
      )}
      <div className="flex p-2 flex-row md:bottom-auto bg-white bottom-0 w-full fixed md:relative z-10 block md:hidden lg:hidden"> {/* Mobile-only using md:hidden */}
        <button
          onClick={() => handleAddToCart(product)}
          className="text-sm flex flex-col rounded-md lg:flex-row items-center justify-center cursor-pointer transition ease-in-out duration-300 font-semibold font-serif text-center border-0 border-transparent focus-visible:outline-none focus:outline-none text-white px-4 py-3 w-full shadow-md bg-black mr-2"
        >
          {/* Lower side - Price */}
          {/* <span className="rounded-lg font-bold px-3 bg-white text-red-600">
                                      {`${currency}${(item * price).toFixed(2)}`}
                                    </span> */}
          {/* Upper side - Text */}
          <span className="text-md pr-0 lg:pr-4">Add to Cart</span>
        </button>
        <button
          onClick={() => handleBuyNow(product)}
          className="text-sm flex flex-col rounded-md items-center justify-center cursor-pointer transition ease-in-out duration-300 font-semibold font-serif text-center border-0 border-transparent focus-visible:outline-none focus:outline-none text-white px-4 py-3 w-full shadow-md bg-black ml-2"
        >
          {/* Lower side - Price */}
          {/* <span className="rounded-lg font-bold px-3 bg-white text-orange-600">
                                      {`${currency}${(item * price).toFixed(2)}`}
                                    </span> */}
          {/* Upper side - Text */}
          <span className="text-md">Buy Now</span>
        </button>
      </div>
    </>
  );
};

// you can use getServerSideProps alternative for getStaticProps and getStaticPaths

export const getServerSideProps = async (context) => {
  const { slug } = context.params;

  const [data, attributes] = await Promise.all([
    ProductServices.getShowingStoreProducts({
      category: "",
      slug: slug,
    }),

    AttributeServices.getShowingAttributes({}),
  ]);
  let product = {};

  let ratings = [];

  if (slug) {
    product = data?.products?.find((p) => p.slug === slug);
    const [d] = await Promise.all([
      RatingServices.getAllRatings(product?._id),
    ]);
    ratings = d;
  }

  return {
    props: {
      product,
      ratings,
      relatedProducts: data?.relatedProducts,
      attributes,
    },
  };
};

export default ProductScreen;
