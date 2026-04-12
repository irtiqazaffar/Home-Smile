import {
  FiGrid,
  FiUsers,
  FiUser,
  FiCompass,
  FiSettings,
  FiSlack,
  FiGlobe,
  FiTarget,
  FiStar,
  FiCornerLeftDown
} from "react-icons/fi";

const sidebar = [
  {
    path: "/dashboard",
    icon: FiGrid,
    name: "Dashboard",
    permission: "dashboard"
  },
  {
    icon: FiSlack,
    name: "Catalog",
    routes: [
      {
        path: "/brands",
        name: "Brands",
        permission: "department"
      },
      {
        path: "/categories",
        name: "Categories",
        permission: "category"
      },
      {
        path: "/products",
        name: "Products",
        permission: "product"
      },
      {
        path: "/attributes",
        name: "Attributes",
        permission: "attribute"
      },
      {
        path: "/coupons",
        name: "Coupons",
        permission: "coupon"
      },
    ],
  },
  {
    path: "/customers",
    icon: FiUsers,
    name: "Customers",
    permission: "customer"
  },
  {
    path: "/orders",
    icon: FiCompass,
    name: "Orders",
    permission: "order"
  },
];

export default sidebar;
