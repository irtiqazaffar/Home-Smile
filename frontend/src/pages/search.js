import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
import useTranslation from "next-translate/useTranslation";

// internal imports
import Layout from "@layout/Layout";
import useFilter from "@hooks/useFilter";
import ProductServices from "@services/ProductServices";
import ProductCard from "@components/product/ProductCard";
import { SidebarContext } from "@context/SidebarContext";
import Loading from "@components/preloader/Loading";
import AttributeServices from "@services/AttributeServices";
import Card from "@components/cta-card/Card";
import CategoryCarousel from "@components/carousel/CategoryCarousel";
import useUtilsFunction from "@hooks/useUtilsFunction";
import DepartmentServices from "@services/DepartmentServices";
import CategoryServices from "@services/CategoryServices";
import { useRouter } from "next/router";
import { IoFunnelSharp } from "react-icons/io5";

const Search = ({ products, attributes, brands, categories, departments, nextPage, prevPage, totalProduct }) => {
  const { t } = useTranslation();
  const { showingTranslateValue } = useUtilsFunction();
  const { isLoading, setIsLoading } = useContext(SidebarContext);
  const [visibleProduct, setVisibleProduct] = useState(8000);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const router = useRouter();
  // console.log(filteredProducts);
  
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(100000);
  const [brand, setBrand] = useState([]);
  const [isOpenBrand, setIsOpenBrand] = useState(false);
  const [category, setCategory] = useState([]);
  const [isOpenCategory, setIsOpenCategory] = useState(false);
  const [department, setDepartment] = useState([]);
  const [attribute, setAttribute] = useState([]);
  const [isOpenDepartment, setIsOpenDepartment] = useState(false);
  const [apply, setApply] = useState(false);
  const { asPath, query: searchQuery } = router;
  const { query, category: queryCategory , title, slug, _id } = searchQuery;

  const [gridCols, setGridCols] = useState('grid-cols-1'); // default to grid-cols-1

  const handleGridChange = (cols) => {
    setGridCols(cols); // change grid layout
  };

  useEffect(() => {
    const savedScrollData = localStorage.getItem('scrollPosition');
  
    if (savedScrollData) {
      const { position, expiry } = JSON.parse(savedScrollData);
  
      // Check if the scroll data is still valid (within 5 minutes)
      if (new Date().getTime() < expiry) {
        setTimeout(() => {
          window.scrollTo(0, parseInt(position, 10));
        }, 100); // Small delay to ensure DOM stability
  
        // Remove the scroll data after using it
        localStorage.removeItem('scrollPosition');
      } else {
        // If the data is expired, remove it
        localStorage.removeItem('scrollPosition');
      }
    }
  }, [products]); // Add 'products' dependency if needed
  

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
  
  
  useEffect(() => {
    setIsLoading(false);
  }, [products]);

  useEffect(() => {
    setFilteredProducts(products);
  },[products]);

  useEffect(() => {
    reset();
  },[asPath]);
  
  const [expandFilter, setExpandFilter] = useState("hidden lg:block");

const [isCategoryOpen, setIsCategoryOpen] = useState(true); // true to open by default
const [isPriceOpen, setIsPriceOpen] = useState(true); // true to open by default

const toggleCategoryOpen = () => {
  setIsCategoryOpen(prevState => !prevState); // Toggle the state
};

const togglePriceOpen = () => {
  setIsPriceOpen(prevState => !prevState); // Toggle the state
};

const [isBrandOpen, setIsBrandOpen] = useState(true); // true to open by default
const [isHide, setIsHide] = useState(false);
const [isFilter, setIsFilter] = useState(true);

const toggleBrandOpen = () => {
  setIsBrandOpen(prevState => !prevState); // Toggle the state
};
  
  useEffect(() => {
    if (apply) {
      let services = products;
  
      // Filter by price range
      if (min > 0 && max <= 100000) {
        services = services?.filter(service => 
          service.prices.price >= min && service.prices.price <= max
        );
      }      
  
      // Filter by brand
      if (brand.length > 0) {
        services = services?.filter(service => {
          console.log(`Filtering by brand: ${service.brand?._id}, Selected Brands: ${brand}`);
          return brand.includes(service.brand?._id);
        });
      }
  
      // Filter by category
      if (category.length > 0) {
        services = services?.filter(service => {
          const isCategoryMatched = service.category ? category.includes(service.category._id) : false;
  
          const isCategoriesMatched = service.categories?.some(catId => 
            category.includes(catId._id)
          );
  
          console.log(`Service ID: ${service.category?._id}, isCategoryMatched: ${isCategoryMatched}, isCategoriesMatched: ${isCategoriesMatched}`);
          
          return isCategoryMatched || isCategoriesMatched;
        });
      }
  
      // Filter by attributes, if any (assuming you have this implemented)
      if (attribute.length > 0) {
        services = services?.filter(service => {
          const variantAttributes = service.variants.flatMap(variant => 
            Object.entries(variant)
              .filter(([key, value]) => key !== 'originalPrice' 
              && key !== 'price' && key !== 'quantity'
              && key !== 'discount' && key !== 'productId'
              && key !== 'barcode' && key !== 'sku'
              && key !== 'image')
          );
  
          // console.log(variantAttributes);
  
          return attribute.every(a => {
            const { attributeId, variantId } = a;
            return variantAttributes.some(([key, value]) => key === attributeId && value === variantId);
          });
        });
      }
  
      // console.log('Filtered Products:', services);
      setFilteredProducts(services);
      setApply(false);
    }
  }, [apply]);

  const reset = () => {
    setApply(false)
    setMin(0)
    setMax(100000)
    setBrand([])
    setIsOpenBrand(false)
    setCategory([])
    setIsOpenCategory(false)
    setDepartment([])
    setIsOpenDepartment(false)
    setAttribute([]);
    setFilteredProducts(products)
  }

  const handleBrandChange = (brandId) => {
    setBrand((prevSelected) => {
      if (prevSelected.includes(brandId)) {
        return prevSelected.filter((id) => id !== brandId);
      } else {
        return [...prevSelected, brandId];
      }
    });
  };

  const hide = () => {
    setIsHide((prevIsHide) => {
      const newIsHide = !prevIsHide;
  
      if (window.innerWidth >= 768 && window.innerWidth <= 2048) {
        // Adjust grid columns and filter state only for mobile and desktop screens
        setGridCols(newIsHide ? 'grid-cols-3' : 'grid-cols-4');
        setIsFilter(newIsHide ? false : true);
      }
  
      return newIsHide;
    });
  };    

  // Handler to update the minimum price based on user input
  const handleMinPriceChange = (e) => {
    const newMin = parseInt(e.target.value);
    if (newMin <= max) {
      setMin(newMin);
    }
  };

  // Handler to update the maximum price based on user input
  const handleMaxPriceChange = (e) => {
    const newMax = parseInt(e.target.value);
    if (newMax >= min) {
      setMax(newMax);
    }
  };

  const handleCategoryChange = (categoryId) => {
    setCategory((prevSelected) => {
      if (prevSelected.includes(categoryId)) {
        return prevSelected.filter((id) => id !== categoryId);
      } else {
        return [...prevSelected, categoryId];
      }
    });
  };

  const loadNextPage = async (page)=>{
    const params = new URLSearchParams();
    // Add parameters if their values are available
    if (query) params.set('query', query);
    if (queryCategory) params.set('category', queryCategory);
    if (title) params.set('title', title);
    if (slug) params.set('slug', slug);
    if (_id) params.set('_id', _id);
    if (page !== undefined) params.set('page', page); // Include page only if defined

    await router.push(`/search?${params.toString()}`);
    // await router.push(`/search?query=${query}&category=${queryCategory}&title=${title}&slug=${slug}&page=${page}`);
  }

  const handleDepartmentChange = (departmentId) => {
    setDepartment((prevSelected) => {
      if (prevSelected.includes(departmentId)) {
        return prevSelected.filter((id) => id !== departmentId);
      } else {
        return [...prevSelected, departmentId];
      }
    });
  };


  const handleAttributeChange = (body) => {
    const { attributeId, variantId } = body;
    const exists = attribute.some(
      (attr) => attr.attributeId === attributeId && attr.variantId === variantId
    );
  
    if (exists) {
      setAttribute((prevState) =>
        prevState.filter(
          (attr) => !(attr.attributeId === attributeId && attr.variantId === variantId)
        )
      );
    } else {
      setAttribute((prevState) => [...prevState, { attributeId, variantId }]);
    }
  };

  const brandRef = useRef(null); // Create a ref to attach to the dropdown
  const categoryRef = useRef(null); // Create a ref to attach to the dropdown
  const departmentRef = useRef(null); // Create a ref to attach to the dropdown

  // Close the dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (brandRef.current && !brandRef.current.contains(event.target)) {
        setIsOpenBrand(false);
      }
      if (categoryRef.current && !categoryRef.current.contains(event.target)) {
        setIsOpenCategory(false);
      }
      if (departmentRef.current && !departmentRef.current.contains(event.target)) {
        setIsOpenDepartment(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [brandRef, categoryRef, departmentRef]);

  const { setSortedField, productData } = useFilter(filteredProducts);

  // console.log("Search page ", productData);
  const showProduct = productData.filter(product => product?.status === "show");
  
  return (
    isLoading ? (
      <Loading loading={isLoading} />
    ):(
      <Layout title="Search" description="This is search page">
      <div className="mx-auto max-w-screen-2xl px-3 sm:px-10">
        {/* <div className="w-full mt-4">
          <div className="w-full grid grid-col gap-4 grid-cols-1 2xl:gap-6 xl:grid-cols-3 lg:grid-cols-3 md:grid-cols-2">
              <Card />
            </div>
            <div className="relative">
              <CategoryCarousel />
            </div>
        </div> */}
        <div className="flex py-0 lg:py-12">
          <div className="w-full lg:flex">
            <div
             className="flex justify-between mb-3 bg-white border shadow-sm rounded p-3 lg:hidden"
             onClick={hide}
            >
              <h6 className="text-sm">
                {t("common:filters")}
              </h6>
              <span className="text-sm">
                <IoFunnelSharp/>
              </span>
            </div>
            {/* Filters Section */}
            {isHide && (
                          <div className={`lg:w-1/4 p-4 rounded-lg mb-4 lg:mb-0 lg:mr-6 bg-white shadow-sm max-h-min`}>
                          <div className="flex justify-between mb-4">
                            <h2 className="text-xl font-semibold">{t("common:filters")}</h2>
                            <div className="flex gap-3">
                              <button
                                onClick={reset}
                                className="md:text-sm flex items-center rounded-sm transition ease-in-out duration-300 font-medium text-center justify-center border-0 border-transparent focus-visible:outline-none focus:outline-none bg-gradient-to-r from-gray-700 via-gray-500 to-gray-900 text-white px-3 hover:text-white text-sm lg:text-sm"
                              >
                                {t("common:reset")}
                              </button>
                              <button
                                onClick={(e)=>{
                                  setApply(true);
                                  if (window.innerWidth <= 1024) { // Mobile and tablet screens up to 1024px wide
                                    setIsHide(false);
                                  }
                                }}
                                className="md:text-sm bg-gradient-to-r rounded-sm from-orange-700 via-pink-500 to-gray-600 flex items-center transition ease-in-out duration-300 font-medium text-center justify-center border-0 border-transparent focus-visible:outline-none focus:outline-none  px-3 text-white text-sm lg:text-sm"
                              >
                                {t("common:apply")}
                              </button>
                            </div>
                          </div>
                          {/* Filter by Price */}
                          <div className="mb-4">
                  {/* Price Range Filter */}
                  <div className="border-b border-gray-300 pb-4">
                      <h3 className="text-sm font-medium mb-3 flex justify-between items-center" onClick={togglePriceOpen}>
                        PRICE
                        <span>{isPriceOpen ? '▼' : '▲'}</span> {/* Arrow to collapse/expand */}
                      </h3>

                      {/* Display the selected price range */}
                      {isPriceOpen && (
                        <>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm font-medium text-gray-600">₹</span>
                        <span className="text-sm font-medium">{min}</span>
                        <input
                          type="range"
                          min="0"
                          max="100000"
                          value={min}
                          onChange={handleMinPriceChange}
                          className="w-full mx-2"
                        />
                        <span className="text-sm font-medium">₹</span>
                        <span className="text-sm font-medium">{max}</span>
                      </div>

                      {/* Display the input fields to directly set the price range */}
                      <div className="flex items-center justify-between">
                        <div className="flex flex-col items-center w-1/2">
                          <span className="text-sm font-medium text-gray-600">₹</span>
                          <input
                            type="number"
                            value={min}
                            onChange={handleMinPriceChange}
                            className="w-full p-1 border-b-2 border-gray-300 text-center text-gray-800 focus:outline-none focus:border-gray-500"
                          />
                        </div>
                        <span className="text-sm mt-4 font-medium mx-2">-</span>
                        <div className="flex flex-col items-center w-1/2">
                          <span className="text-sm font-medium text-gray-600">₹</span>
                          <input
                            type="number"
                            value={max}
                            onChange={handleMaxPriceChange}
                            className="w-full p-1 border-b-2 border-gray-300 text-center text-gray-800 focus:outline-none focus:border-gray-500"
                          />
                        </div>
                      </div>
                      </>
                      )}
                  </div>
            
                  {/* Category Filter */}
                  <div className="border-b border-gray-300 py-4">
                  <h3 className="text-md font-medium mb-2 flex justify-between items-center cursor-pointer" onClick={toggleCategoryOpen}>
                  Category
                  <span>{isCategoryOpen ? '▼' : '▲'}</span> {/* Arrow to collapse/expand */}
                </h3>
            
                {isCategoryOpen && (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {categories[0]?.children?.map((c) => (
                      <label key={c._id} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded"
                          value={c._id}
                          checked={category.includes(c._id)}
                          onChange={() => handleCategoryChange(c._id)}
                        />
                        <span className="text-sm text-gray-700">{showingTranslateValue(c?.name)}</span>
                      </label>
                    ))}
                  </div>
                )}
                  </div>
            
                  {/* Brand Filter */}
                  {/* <div className="border-b border-gray-300 py-4">
                    <h3 className="text-md font-medium mb-2 flex justify-between items-center cursor-pointer" onClick={toggleBrandOpen}>
                      Brand
                      <span>{isBrandOpen ? '▼' : '▲'}</span>
                    </h3>
                    {isBrandOpen && (
                    <div className="space-y-2 max-h-60 overflow-y-auto">
                      {brands.map((b) => (
                        <label key={b._id} className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            className="form-checkbox h-4 w-4 text-blue-600 border-gray-300 rounded"
                            value={b._id}
                            checked={brand.includes(b._id)}
                            onChange={() => handleBrandChange(b._id)}
                          />
                          <span className="text-sm text-gray-700">{showingTranslateValue(b?.name)}</span>
                        </label>
                      ))}
                    </div>
                    )}
                  </div> */}
                </div>
            </div>
            )}

            {/* Products Section */}
            <div className="w-full lg:w-4/4">
              <div className="flex justify-between items-center mb-3 bg-white border shadow-sm rounded p-3">
              <div className="hidden lg:flex items-center py-2 px-3 text-sm text-black font-medium rounded border border-black bg-white">
                  <button onClick={hide} className="flex items-center">
                    <span className="mr-2">{isFilter ? 'FILTER' : 'HIDE FILTERS'}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4h18M4 10h16M6 16h12" />
                    </svg>
                  </button>
              </div>

              <h6 className="text-sm text-black">
                  {t("common:totalI")}{" "}
                  <span className="font-bold">{totalProduct}</span>{" "}
                  {t("common:itemsFound")}
              </h6>
                  <span className="text-sm relative">
                      <select
                        onChange={(e) => setSortedField(e.target.value)}
                        className="appearance-none py-2 cursor-pointer px-3 text-sm text-black font-medium block w-full rounded border border-black bg-white pr-8 focus:outline-none focus:border-black focus:ring-0"
                        defaultValue="Sort by"
                        style={{
                          backgroundImage: "none", // Ensure no default arrow appears
                        }}
                      >
                            <option value="Sort by" disabled hidden class="text-left rtl">Sort by ⥮</option>
                            <option value="Popularity">Popularity</option>
                            <option value="Newest">Latest</option>
                            <option value="Discount">Discount</option>
                            <option value="High">Price: High to Low</option>
                            <option value="Low">Price: Low to High</option>
                            {/* <option value="Oldest">Date, old to new</option> */}
                      </select>
                  </span>
                </div>

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
              {showProduct?.length === 0 && (
                <div className="mx-auto p-5 my-5">
                  <Image
                    className="my-4 mx-auto"
                    src="/no-result.svg"
                    alt="no-result"
                    width={400}
                    height={380}
                  />
                  <h2 className="text-lg md:text-xl lg:text-2xl xl:text-2xl text-center mt-2 font-medium text-gray-600">
                    {t("common:sorryText")} 😞
                  </h2>
                </div>
              )}

              {isLoading ? (
                <Loading loading={isLoading} />
              ) : (
                <>
                  <div className={`grid ${gridCols} gap-4`}>
                    {showProduct?.slice(0, visibleProduct).map((product, i) => (
                      <ProductCard
                        key={i + 1}
                        product={product}
                        attributes={attributes}
                      />
                    ))}
                  </div>

                  {/* {showProduct?.length > visibleProduct && (
                    <button
                      onClick={() => setVisibleProduct((prev) => prev + 10)}
                      className="w-auto mx-auto md:text-sm leading-5 flex items-center transition ease-in-out duration-300 font-medium text-center justify-center border-0 border-transparent rounded-md focus-visible:outline-none focus:outline-none bg-indigo-100 text-gray-900 px-5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-3 hover:text-white hover:bg-black h-12 mt-6 text-sm lg:text-sm"
                    >
                      {t("common:loadMoreBtn")}
                    </button>
                  )} */}

                  <div className="flex">
                      {prevPage > 0 && (
                        <button
                          onClick={() => loadNextPage(prevPage)}
                          className="w-auto mx-auto md:text-sm leading-5 flex items-center transition ease-in-out duration-300 font-medium text-center justify-center border-0 border-transparent rounded-md focus-visible:outline-none focus:outline-none bg-indigo-100 text-gray-700 px-5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-3 hover:text-white hover:bg-cyan-600 h-12 mt-6 text-sm lg:text-sm"
                        >
                          {"Prev"}
                        </button>
                      )}
                      {nextPage > 1 && showProduct.length == 20 && (
                        <button
                          onClick={() => loadNextPage(nextPage)}
                          className="w-auto mx-auto md:text-sm leading-5 flex items-center transition ease-in-out duration-300 font-medium text-center justify-center border-0 border-transparent rounded-md focus-visible:outline-none focus:outline-none bg-indigo-100 text-gray-700 px-5 md:px-6 lg:px-8 py-2 md:py-3 lg:py-3 hover:text-white hover:bg-cyan-600 h-12 mt-6 text-sm lg:text-sm"
                        >
                          {"Next"}
                        </button>
                      )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
    )
  );
};

export default Search;

export const getServerSideProps = async (context) => {
  const { query, title, _id, page } = context.query;
  
  const [data, attributes, brands, categories, departments] = await Promise.all([
    ProductServices.getShowingStoreProducts({
      category: _id ? _id : "",
      title: title ? encodeURIComponent(title) : "",
      query: query ? encodeURIComponent(query) : "",
      page: page ? encodeURIComponent(page) : 1,
    }),
    AttributeServices.getShowingAttributes({}),
    ProductServices.getShowingsBrands(),
    CategoryServices.getShowingCategory(),
    DepartmentServices.getShowingDepartments()
  ]);

  return {
    props: {
      products: data?.products,
      attributes,
      nextPage: data?.nextPage ?? 1,
      prevPage: data?.prevPage ?? 0,
      totalProduct:data?.totalProduct ?? 0,
      brands,
      categories,
      departments
    },
  };
};


 

// export const getServerSideProps = async (context) => {
//   const { query } = context.query;
//   const { Category } = context.query;
//   const { category } = context.query;
//   const data = await ProductServices.getShowingProducts();

//   let products = [];
//   //service filter with parent category
//   if (Category) {
//     products = data.filter(
//       (product) => product.parent.toLowerCase().replace("&", "").split(" ").join("-") === Category
//     );
//   }
//   //service filter with child category
//   if (category) {
//     products = data.filter(
//       (product) => product.children.toLowerCase().replace("&", "").split(" ").join("-") === category
//     );
//   }

//   //search result
//   if (query) {
//     products = data.filter((product) => product.title.toLowerCase().includes(query.toLowerCase()));
//   }

//   return {
//     props: {
//       products,
//     },
//   };
// };
