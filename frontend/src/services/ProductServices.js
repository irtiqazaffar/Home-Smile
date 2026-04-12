import requests from "./httpServices";

const ProductServices = {
  getShowingProducts: async () => {
    return requests.get("/products/show");
  },
  getShowingStoreProducts: async ({ category = "", title = "", slug = "", query = "", page = 1 }) => {
    return requests.get(
      `/products/store?query=${query}&category=${category}&title=${title}&slug=${slug}&page=${page}`
    );
  },
  getShowingStoreAllProducts: async () => {
    return requests.get("/products/allProduct");
  },
  getDiscountedProducts: async () => {
    return requests.get("/products/discount");
  },

  getProductBySlug: async (slug) => {
    return requests.get(`/products/${slug}`);
  },
  getShowingsBrands: async (slug) => {
    return requests.get('/brand/show');
  },
  productSuggest: async (data) => {
    return requests.post("/products/suggest/product", data);
  },
};

export default ProductServices;
