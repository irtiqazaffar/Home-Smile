import { useContext } from "react";
import Link from "next/link";
import { useCart } from "react-use-cart";
import { FiPlus, FiMinus, FiTrash2 } from "react-icons/fi";

// internal import
import useAddToCart from "@hooks/useAddToCart";
import { SidebarContext } from "@context/SidebarContext";
import DUMMY_IMAGE from "@components/constants";
import useGetSetting from "@hooks/useGetSetting";
import { notifyError } from "@utils/toast";

const CartItem = ({ item, currency }) => {
  const { updateItemQuantity, removeItem } = useCart();
  const { closeCartDrawer } = useContext(SidebarContext);
  const { handleIncreaseQuantity, errorMessage } = useAddToCart();

  console.log("Item in cart ", item);

  const { globalSetting } = useGetSetting();

  return (
    <>
      {errorMessage && (
        <div className="error-message text-center mt-2 mb-2 text-red-600">
          {errorMessage}
        </div>
      )}
      <div className=" group w-full h-auto flex bg-white py-4 px-6 border-b border-gray-100 relative last:border-b-0">
        {/* Product Image */}
        <div className="flex-shrink-0 mr-4">
          <img
            key={item.id}
            src={Array.isArray(item?.image) ? item?.image[0] : item?.image || "https://bombaypalace.fr/wp-content/uploads/2022/01/img-dummy-product.jpg"}
            width={80}
            height={80}
            alt={item.title}
            className="object-cover rounded border border-gray-200 shadow-sm"
          />
        </div>

        {/* Product Details */}
        <div className="flex flex-col w-full">
          {/* Product Title and Remove Icon */}
          <div className="flex justify-between items-start">
            <Link
              href={`/product/${item?.slug}`}
              onClick={closeCartDrawer}
              className="text-base font-semibold text-gray-800 text-heading cursor-pointer"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {item.title}
            </Link>
            <button
              onClick={() => removeItem(item.id)}
              className="bg-emerald-500 hover:bg-emerald-200 text-white p-2 rounded-full ml-4 cursor-pointer transition duration-300 border border-2 border-emerald-300"
            >
              <FiTrash2 size={18} />
            </button>
          </div>

          {/* Product Attributes */}
          <div className="text-sm text-gray-500 mt-1">
            {/* <p className="text-sm m-0 !m-0 p-0">
            <span className="font-semibold">Size:</span> Diameter - {item.size || "15.5 Inches"}
          </p> */}
            <p className="text-sm m-0 !m-0 p-0">
              <span className="font-semibold">COD:</span> {item.isCodAvaialble ? "Available" : "Not Available"}
            </p>
            {/* <p className="text-sm m-0 !m-0 p-0">
            <span className="font-semibold">Material:</span> {item.material || "Acrylic & Glass"}
          </p> */}
            <p className="text-sm font-semibold mt-1">
              {globalSetting?.default_currency || "₹"}{` ${item.price.toFixed(2)}`}
            </p>
          </div>

          {/* Quantity Selector */}
          <div className="flex items-center mt-3">
            <button
              onClick={() => updateItemQuantity(item.id, item.quantity - 1)}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 text-gray-600 rounded-l focus:outline-none hover:bg-gray-100 cursor-pointer"
            >
              <FiMinus />
            </button>
            <span className="w-10 h-8 flex items-center justify-center border-t border-b border-gray-300 text-sm font-semibold text-gray-700">
              {item.quantity}
            </span>
            <button
              onClick={() => handleIncreaseQuantity(item)}
              className="w-8 h-8 flex items-center justify-center border border-gray-300 text-gray-600 rounded-r focus:outline-none hover:bg-gray-100 cursor-pointer"
            >
              <FiPlus />
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default CartItem;
