import dynamic from "next/dynamic";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import { IoAdd, IoBagAddSharp, IoRemove } from "react-icons/io5";
import { useCart } from "react-use-cart";

//internal import

import Price from "@components/common/Price";
import Stock from "@components/common/Stock";
import { notifyError, notifySuccess } from "@utils/toast";
import useAddToCart from "@hooks/useAddToCart";
import useGetSetting from "@hooks/useGetSetting";
import Discount from "@components/common/Discount";
import useUtilsFunction from "@hooks/useUtilsFunction";
import ProductModal from "@components/modal/ProductModal";
import ImageWithFallback from "@components/common/ImageWithFallBack";
import { handleLogEvent } from "src/lib/analytics";
import DUMMY_IMAGE from "@components/constants";
import { Router } from "next/router";
import { useRouter } from "next/router";
import { SidebarContext } from "@context/SidebarContext";
import VariantList from "@components/variants/VariantList";
import VariantDisplay from "@components/variants/VariantDisplay";

const ProductCard = ({ product, attributes }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const router = useRouter();
  const { setIsLoading, isLoading } = useContext(SidebarContext);

  // console.log("Home Product ", product);

  const { items, addItem, updateItemQuantity, inCart } = useCart();
  const { handleAddItem, item, setItem } = useAddToCart();
  const { handleIncreaseQuantity } = useAddToCart();
  const { globalSetting } = useGetSetting();
  const { showingTranslateValue, getNumber, lang } = useUtilsFunction();

  const currency = globalSetting?.default_currency || "₹";

  const [value, setValue] = useState("");
  const [price, setPrice] = useState(0);
  const [img, setImg] = useState("");
  const [originalPrice, setOriginalPrice] = useState(0);
  const [stock, setStock] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [selectVariant, setSelectVariant] = useState({});
  const [selectVa, setSelectVa] = useState({});
  const [variantTitle, setVariantTitle] = useState([]);
  const [variants, setVariants] = useState([]);

  useEffect(() => {
    if (value) {
      const result = product?.variants?.filter((variant) =>
        Object.keys(selectVa).every((k) => selectVa[k] === variant[k])
      );

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
        }) => ({
          ...rest,
        })
      );

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
  // console.log("product", product);

  useEffect(() => {
    const res = Object.keys(Object.assign({}, ...product?.variants));

    const varTitle = attributes?.filter((att) => res.includes(att?._id));

    setVariantTitle(varTitle?.sort());
  }, [variants, attributes]);

  // console.log('attributes in product cart',attributes)

  const handleAddItems = (event, p) => {
    event.stopPropagation();
    if (p?.stock < 1) return notifyError("Insufficient stock!");

    // if (p?.variants?.length > 0) {
    //   setModalOpen(!modalOpen);
    //   return;
    // }
    const { slug, variants, categories, description, ...updatedProduct } =
      product;
    const newItem = {
      ...updatedProduct,
      title: showingTranslateValue(p?.title),
      id: p?._id,
      slug: p?.slug,
      variant: p?.prices,
      price: p?.prices?.price,
      originalPrice: product?.prices?.originalPrice,
    };
    handleAddItem(newItem);
  };

  const handleMoreInfo = (slug) => {
    setModalOpen(false);

    // Save scroll position with an expiry date of 5 minutes
    const scrollData = {
      position: window.scrollY,
      expiry: new Date().getTime() + 10 * 60 * 1000, // Current time + 10 minutes
    };
    localStorage.setItem('scrollPosition', JSON.stringify(scrollData));

    router.push(`/product/${slug}`);
    setIsLoading(!isLoading);
    handleLogEvent("product", `opened ${slug} product details`);
  };

  const handleModalOpen = (event, id) => {
    setModalOpen(event);
  };

  // compute truncated title (max 8 words)
  const titleText = showingTranslateValue(product?.title) || "";
  const truncatedTitle = (() => {
    const words = titleText.trim().split(/\s+/).filter(Boolean);
    return words.length > 8 ? words.slice(0, 9).join(" ") + "..." : titleText;
  })();

  return (
    <>
      {modalOpen && (
        <ProductModal
          modalOpen={modalOpen}
          setModalOpen={setModalOpen}
          product={product}
          currency={currency}
          attributes={attributes}
        />
      )}
      <div className="group box-border overflow-hidden flex flex-col cursor-pointer items-center bg-white rounded-md p-0 m-0 shadow-lg" onClick={() => handleMoreInfo(product?.slug)} >
        <div
          className="relative flex justify-center cursor-pointer w-full h-70" // Maintain height for the image
        >
          <div className="relative w-full h-36 lg:h-80 m-0 p-0 group m-5 border border-gray-100 rounded-full shadow-md"> {/* Full height and width with hover group */}
            {product.image[0] ? (
              <Image
                src={product.image[0]} // Ensure this is a valid URL
                layout="fill" // Fills the parent container
                objectFit="cover" // Ensures the image fills the area
                alt="product"
                className="absolute inset-0 object-cover w-full rounded-full"
              />
            ) : (
              <Image
                src={DUMMY_IMAGE} // Fallback
                layout="fill"
                alt="product"
                className="absolute inset-0 object-cover"
              />
            )}

            {product?.stock <= 0 && (
              <div className="absolute top-2 left-2 bg-black text-white py-1 px-4 rounded-2xl">Sold Out</div>
            )}

            {/* Variant details overlay */}
            <div
              className="absolute inset-0 bg-black top-16 bg-opacity-0 text-center flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <div className="text-black">
                {variantTitle?.map((a) => (
                  <span key={a._id}>
                    <div className="flex items-center mb-1 lg:mb-3 md:mb-1 p-1 bg-gray-300">
                      <h4 className="text-xs lg:text-xl py-0 font-bold mr-2">
                        {showingTranslateValue(a?.name)}:
                      </h4>
                      {/* Values - Aligning to the same line as the title */}
                      <div className="flex flex-row">
                        {[
                          ...new Map(
                            variants?.map((v) => [v[a._id], v].filter(Boolean))
                          ).values(),
                        ]
                          .filter(Boolean)
                          .map((vl) =>
                            variantTitle.map((vr) =>
                              vr?.variants?.map(
                                (el) =>
                                  vr?._id === a._id &&
                                  el?._id === vl[a._id] && (
                                    <div
                                      key={el._id} // Use a unique key for each button
                                      className={`${Object?.values(selectVariant).includes(vl[a._id])
                                        ? "text-gray-900 mr-2 border-0 inline-flex items-center justify-center px-3 text-xs lg:text-lg md:text-lg focus:outline-none"
                                        : "mr-2 border-0 text-gray-900 inline-flex items-center justify-center px-3 text-xs lg:text-lg md:text-lg focus:outline-none"
                                        }`}
                                    >
                                      {showingTranslateValue(el.name)}
                                    </div>
                                  )
                              )
                            )
                          )}
                      </div>
                    </div>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        <div className="w-full px-3 md:px-2 lg:px-4 pb-4 flex flex-col justify-between h-full"> {/* Ensure contents are spaced out */}
          <div className="relative mb-1 flex-grow"> {/* Flex-grow to take available space */}
            <span className="text-gray-400 font-medium text-xs block mb-1">
              {product.unit}
            </span>
            <h2 className="font-poppins text-heading mb-2 block text-sm lg:text-base font-bold text-gray-900">
              {truncatedTitle}
            </h2>
            <h5 className="font-poppins text-heading mb-0 block text-sm text-bold lg:text-base text-gray-700">
              {showingTranslateValue(product?.brand?.name)}
            </h5>
            {/* <div>
              <span className="text-yellow-500">
                {Array.from({ length: 5 }, (_, i) => (
                  <span key={i}>{i < product.rating ? '★' : '☆'}</span>
                ))}
              </span>
            </div> */}
          </div>
          <div className="flex font-Lato justify-between items-center text-heading text-lg sm:text-base space-x-2">
            <Price
              card
              product={product}
              currency={currency}
              price={
                product?.isCombination
                  ? product?.variants[0]?.price
                  : product?.prices?.price
              }
              originalPrice={
                product?.isCombination
                  ? product?.variants[0]?.originalPrice
                  : product?.prices?.originalPrice
              }
            />
            <button
              onClick={(event) => handleAddItems(event, product)}
              aria-label="Add to cart"
              className="bg-black/70 rounded-lg text-white mt-0 md:mt-2 hover:bg-black active:bg-black/90 transition-all flex items-center justify-center
                         w-10 h-10 md:w-28 md:h-auto md:py-2"
            >
              {/* Icon visible on mobile, hidden on md+ */}
              <span className="block lg:hidden text-lg">
                <IoBagAddSharp />
              </span>

              {/* Text visible on md+ */}
              <span className="hidden lg:block text-sm md:text-md lg:text-md">
                ADD TO CART
              </span>
            </button>
          </div>

        </div>
      </div>
    </>
  );
};
export default dynamic(() => Promise.resolve(ProductCard), { ssr: false });
