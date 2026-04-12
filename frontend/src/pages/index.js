import { SidebarContext } from "@context/SidebarContext";
import { useContext, useEffect, useState } from "react";
import { useRouter } from "next/router";

//internal import
import Layout from "@layout/Layout";
import Banner from "@components/banner/Banner";
import useGetSetting from "@hooks/useGetSetting";
import CardTwo from "@components/cta-card/CardTwo";
import OfferCard from "@components/offer/OfferCard";
import StickyCart from "@components/cart/StickyCart";
import Loading from "@components/preloader/Loading";
import ProductServices from "@services/ProductServices";
import ProductCard from "@components/product/ProductCard";
import MainCarousel from "@components/carousel/MainCarousel";
import FeatureCategory from "@components/category/FeatureCategory";
import AttributeServices from "@services/AttributeServices";
import CMSkeleton from "@components/preloader/CMSkeleton";
import FeatureCat from "@components/category/FeatureCat";

const Home = ({ popularProducts, discountProducts, attributes }) => {
  const router = useRouter();
  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const { loading, error, storeCustomizationSetting } = useGetSetting();

  // const phoneNumber = storeCustomizationSetting?.footer?.block4_phone || 6392899521; // Replace with your phone number

  const handleClick = (phoneNumber) => {
    window.open(`https://wa.me/${phoneNumber}`, "_blank");
  };

  // console.log("Number ", storeCustomizationSetting?.footer?.block4_phone);

  const showProduct = popularProducts.filter(product => product?.status === "show");
  const DisProduct = discountProducts.filter(product => product?.status === "show");

  // Filter products based on the category name containing "clock"
  const filteredProducts = popularProducts.filter(product =>
    product.category?.name?.en?.toLowerCase().includes('clock')
  );

  const [gridCols, setGridCols] = useState('grid-cols-1'); // default to grid-cols-1

  const handleGridChange = (cols) => {
    setGridCols(cols); // change grid layout
  };

  useEffect(() => {
    const updateGridCols = () => {
      if (window.innerWidth >= 768) { // md breakpoint is 768px
        setGridCols('grid-cols-4'); // Set to 4 columns on desktop
      } else {
        setGridCols('grid-cols-2'); // Set to 1 column on mobile
      }
    };

    // Initial check
    updateGridCols();

    // Event listener for window resize
    window.addEventListener('resize', updateGridCols);

    // Clean up the event listener on component unmount
    return () => window.removeEventListener('resize', updateGridCols);
  }, []);

  // Remove duplicate products based on a unique identifier, like product ID
  const uniqueProducts = filteredProducts.reduce((accumulator, current) => {
    const x = accumulator.find(item => item._id === current._id);
    if (!x) {
      return accumulator.concat([current]);
    } else {
      return accumulator;
    }
  }, []);

  const filteredProduct = popularProducts.filter(product =>
    product.category?.name?.en?.toLowerCase().includes('painting')
  );

  // Remove duplicate products based on a unique identifier, like product ID
  const uniqueProduct = filteredProduct.reduce((accumulator, current) => {
    const x = accumulator.find(item => item._id === current._id);
    if (!x) {
      return accumulator.concat([current]);
    } else {
      return accumulator;
    }
  }, []);

  const filteredProduct1 = popularProducts.filter(product =>
    product.category?.name?.en?.toLowerCase().includes('wall art')
  );

  // Remove duplicate products based on a unique identifier, like product ID
  const uniqueProduct1 = filteredProduct1.reduce((accumulator, current) => {
    const x = accumulator.find(item => item._id === current._id);
    if (!x) {
      return accumulator.concat([current]);
    } else {
      return accumulator;
    }
  }, []);

  const suniqueProduct1 = uniqueProduct1.filter(product => product?.status === "show");
  const suniqueProduct = uniqueProduct.filter(product => product?.status === "show");
  const suniqueProducts = uniqueProducts.filter(product => product?.status === "show");

  useEffect(() => {
    if (router.asPath === "/") {
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }
  }, [router]);

  return (
    <>
      {isLoading ? (
        <Loading loading={isLoading} />
      ) : (
        <Layout>
          <div className="min-h-screen">
            {/* <StickyCart /> */}
            <div className="bg-white">
              <div className="mx-auto pt-0 pm-4 lg:pt-1 md:pt-8 max-w-screen-2xl px-0 sm:px-2">
                <div className="w-auto md:mt-4 mt-16 mx-2">
                  <MainCarousel />
                </div>
                {/* {storeCustomizationSetting?.home?.promotion_banner_status && (
                  <div className="bg-orange-100 px-10 py-6 rounded-lg mt-6">
                    <Banner />
                  </div>
                )} */}
              </div>
            </div>

            {/* discounted products */}
            {storeCustomizationSetting?.home?.discount_product_status &&
              DisProduct?.length > 0 && (
                <div
                  id="discount"
                  className="bg-gray-50 lg:py-16 py-8 mx-auto max-w-screen-2xl px-3 sm:px-10"
                >
                  <div className="mb-10 flex justify-center">
                    <div className="text-center w-full lg:w-2/5">
                      <h2 className="text-xl lg:text-2xl mb-2 font-semibold">
                        <CMSkeleton
                          count={1}
                          height={30}
                          // error={error}
                          loading={loading}
                          data={
                            storeCustomizationSetting?.home
                              ?.latest_discount_title
                          }
                        />
                      </h2>
                      <p className="text-base text-gray-600 leading-6">
                        <CMSkeleton
                          count={5}
                          height={20}
                          // error={error}
                          loading={loading}
                          data={
                            storeCustomizationSetting?.home
                              ?.latest_discount_description
                          }
                        />
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-full">
                      {loading ? (
                        <CMSkeleton
                          count={20}
                          height={20}
                          error={error}
                          loading={loading}
                        />
                      ) : (
                        <div className={`grid ${gridCols} gap-4`}>
                          {DisProduct
                            ?.slice(
                              0,
                              storeCustomizationSetting?.home
                                ?.latest_discount_product_limit
                            )
                            .map((product) => (
                              <ProductCard
                                key={product._id}
                                product={product}
                                attributes={attributes}
                              />
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}

            {/* popular products */}
            {storeCustomizationSetting?.home?.popular_products_status && (
              <div className="bg-gray-50 lg:py-16 pb-8 mx-auto max-w-screen-2xl px-3 sm:px-10">
                <div className="mb-10 flex justify-center">
                  <div className="text-center w-full lg:w-2/5">
                    <h2 className="text-xl lg:text-2xl mb-2 font-semibold">
                      <CMSkeleton
                        count={1}
                        height={30}
                        // error={error}
                        loading={loading}
                        data={storeCustomizationSetting?.home?.popular_title}
                      />
                    </h2>
                    <p className="text-base text-gray-600 leading-6">
                      <CMSkeleton
                        count={5}
                        height={10}
                        error={error}
                        loading={loading}
                        data={
                          storeCustomizationSetting?.home?.popular_description
                        }
                      />
                    </p>
                  </div>
                </div>
                <div className="flex">
                  <div className="w-full">
                    {loading ? (
                      <CMSkeleton
                        count={20}
                        height={20}
                        error={error}
                        loading={loading}
                      />
                    ) : (
                      <div>
                        {/* Buttons to toggle grid layout */}
                        <div className="mb-4 flex space-x-2">
                          {/* Image 1 for grid-cols-1 */}
                          {/* <img
                                src="/single.png"  // Replace with the actual image path
                                alt="One Column Grid"
                                className={`cursor-pointer ${gridCols === 'grid-cols-1' ? 'border-2 border-black-800' : ''} block md:hidden`} // Add border if selected
                                onClick={() => handleGridChange('grid-cols-1')}
                              /> */}
                          {/* Image 2 for grid-cols-2 */}
                          {/* <img
                                src="/double.png"  // Replace with the actual image path
                                alt="Two Column Grid"
                                className={`cursor-pointer ${gridCols === 'grid-cols-2' ? 'border-2 border-black-800' : ''}`} // Add border if selected
                                onClick={() => handleGridChange('grid-cols-2')}
                              /> */}
                          {/* Image 2 for grid-cols-2 */}
                          {/* <img
                                src="/trippel.png"  // Replace with the actual image path
                                alt="Two Column Grid"
                                className={`cursor-pointer ${gridCols === 'grid-cols-2' ? 'border-2 border-black-800' : ''} hidden lg:block`} // Add border if selected
                                onClick={() => handleGridChange('grid-cols-3')}
                              /> */}
                          {/* Image 2 for grid-cols-2 */}
                          {/* <img
                                src="/fourth.png"  // Replace with the actual image path
                                alt="Two Column Grid"
                                className={`cursor-pointer ${gridCols === 'grid-cols-2' ? 'border-2 border-black-800' : ''} hidden lg:block`} // Add border if selected
                                onClick={() => handleGridChange('grid-cols-4')}
                              /> */}
                          {/* Image 2 for grid-cols-2 */}
                          {/* <img
                                src="/fifth.png"  // Replace with the actual image path
                                alt="Two Column Grid"
                                className={`cursor-pointer ${gridCols === 'grid-cols-2' ? 'border-2 border-black-800' : ''} hidden lg:block`} // Add border if selected
                                onClick={() => handleGridChange('grid-cols-5')}
                              /> */}
                        </div>
                        <div className={`grid ${gridCols} gap-4`}>
                          {showProduct
                            ?.slice(0, storeCustomizationSetting?.home?.popular_product_limit)
                            .map((product) => (
                              <ProductCard key={product._id} product={product} attributes={attributes} />
                            ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* feature category's */}
            {storeCustomizationSetting?.home?.featured_status && (
              <div className="bg-gray-100 mt-2 lg:py-16 py-8">
                <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
                  <div className="mb-10 flex justify-center">
                    <div className="text-center w-full lg:w-2/5">
                      <h4 className="text-2xl text-left lg:text-center lg:text-4xl mb-0">
                        <CMSkeleton
                          count={1}
                          height={30}
                          // error={error}
                          loading={loading}
                          data={storeCustomizationSetting?.home?.feature_title}
                        />
                      </h4>
                      <p className="text-base text-gray-600 leading-6">
                        <CMSkeleton
                          count={4}
                          height={10}
                          error={error}
                          loading={loading}
                          data={
                            storeCustomizationSetting?.home?.feature_description
                          }
                        />
                      </p>
                    </div>
                  </div>
                  <FeatureCategory />
                </div>
              </div>
            )}

            {/* promotional banner card */}
            {/* {storeCustomizationSetting?.home?.delivery_status && (
              <div className="block mx-auto max-w-screen-2xl">
                <div className="mx-auto max-w-screen-2xl px-4 sm:px-10">
                  <div className="lg:p-16 p-6 bg-emerald-500 shadow-sm border rounded-lg">
                    <CardTwo />
                  </div>
                </div>
              </div>
            )} */}

            {/* Clock Art */}

            {/* <div
                  id="discount"
                  className="bg-gray-50 lg:py-16 py-8 mx-auto max-w-screen-2xl px-3 sm:px-10"
                >
                  <div className="mb-10 flex justify-center">
                    <div className="text-center w-full lg:w-2/5">
                      <h2 className="text-xl lg:text-2xl mb-2 font-semibold">
                          -------- Popular Clocks --------
                        <CMSkeleton
                          count={1}
                          height={30}
                          error={error}
                          loading={loading}
                          data={
                            storeCustomizationSetting?.home
                              ?.latest_discount_title
                          }
                        />
                      </h2>
                      <p className="text-base font-sans text-gray-600 leading-6">
                        <CMSkeleton
                          count={5}
                          height={20}
                          error={error}
                          loading={loading}
                          data={
                            storeCustomizationSetting?.home
                              ?.latest_discount_description
                          }
                        />
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-full">
                      {loading ? (
                        <CMSkeleton
                          count={20}
                          height={20}
                          error={error}
                          loading={loading}
                        />
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {newArrivals
                            ?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                            ?.slice(
                              0, 16)
                            .map((product) => (
                              <ProductCard
                                key={product._id}
                                product={product}
                                attributes={attributes}
                              />
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div> */}

            {/* Wall Art */}

            {/* <div
                  id="discount"
                  className="bg-gray-50 lg:py-16 py-10 mx-auto max-w-screen-2xl px-3 sm:px-10"
                >
                  <div className="mb-10 flex justify-center">
                    <div className="text-center w-full lg:w-2/5">
                      <h2 className="text-xl lg:text-2xl mb-2 font-semibold">
                          -------- Popular Wall Art --------
                        <CMSkeleton
                          count={1}
                          height={30}
                          error={error}
                          loading={loading}
                          data={
                            storeCustomizationSetting?.home
                              ?.latest_discount_title
                          }
                        />
                      </h2>
                      <p className="text-base font-sans text-gray-600 leading-6">
                        <CMSkeleton
                          count={5}
                          height={20}
                          error={error}
                          loading={loading}
                          data={
                            storeCustomizationSetting?.home
                              ?.latest_discount_description
                          }
                        />
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-full">
                      {loading ? (
                        <CMSkeleton
                          count={20}
                          height={20}
                          error={error}
                          loading={loading}
                        />
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {suniqueProduct1
                            ?.slice(
                              0, 4)
                            .map((product) => (
                              <ProductCard
                                key={product._id}
                                product={product}
                                attributes={attributes}
                              />
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div> */}

            {/* Painting Art */}

            {/* <div
                  id="discount"
                  className="bg-gray-50 lg:py-16 py-10 mx-auto max-w-screen-2xl px-3 sm:px-10"
                >
                  <div className="mb-10 flex justify-center">
                    <div className="text-center w-full lg:w-2/5">
                      <h2 className="text-xl lg:text-2xl mb-2 font-semibold">
                          -------- Popular Paintings --------
                        <CMSkeleton
                          count={1}
                          height={30}
                          error={error}
                          loading={loading}
                          data={
                            storeCustomizationSetting?.home
                              ?.latest_discount_title
                          }
                        />
                      </h2>
                      <p className="text-base font-sans text-gray-600 leading-6">
                        <CMSkeleton
                          count={5}
                          height={20}
                          error={error}
                          loading={loading}
                          data={
                            storeCustomizationSetting?.home
                              ?.latest_discount_description
                          }
                        />
                      </p>
                    </div>
                  </div>
                  <div className="flex">
                    <div className="w-full">
                      {loading ? (
                        <CMSkeleton
                          count={20}
                          height={20}
                          error={error}
                          loading={loading}
                        />
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                          {suniqueProduct
                            ?.slice(
                              0, 4)
                            .map((product) => (
                              <ProductCard
                                key={product._id}
                                product={product}
                                attributes={attributes}
                              />
                            ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div> */}
          </div>
        </Layout>
      )}
    </>
  );
};

export const getServerSideProps = async (context) => {
  const { cookies } = context.req;
  const { query, _id } = context.query;

  const [data, attributes] = await Promise.all([
    ProductServices.getShowingStoreProducts({
      category: _id ? _id : "",
      title: query ? query : "",
    }),

    AttributeServices.getShowingAttributes(),
  ]);

  return {
    props: {
      popularProducts: data.popularProducts,
      discountProducts: data.discountedProducts,
      cookies: cookies,
      attributes,
    },
  };
};

export default Home;
