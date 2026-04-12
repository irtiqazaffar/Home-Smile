import useUtilsFunction from "@hooks/useUtilsFunction";

const Price = ({ product, price, card, currency, originalPrice }) => {
  // console.log("price", price, "originalPrice", originalPrice, "card", card);
  const { getNumberTwo } = useUtilsFunction();

  return (
    <div className="font-serif product-price">
  {product?.isCombination ? (
    <>
      <span
        className={`inline-block ${card ? "text-sm" : "text-lg"} 
          md:text-2xl`} // Smaller text on mobile, larger on desktop
      >
        {currency}
        {getNumberTwo(price)}
      </span>
      {originalPrice > price && (
        <del
          className={`ml-1 ${card ? "text-xs font-normal" : "text-lg"} 
            text-gray-600 md:text-lg`}
        >
          {currency}
          {getNumberTwo(originalPrice)}
        </del>
      )}
    </>
  ) : (
    <>
      <span
        className={`inline-block ${card ? "text-sm" : "text-lg"} 
          md:text-2xl`} // Smaller text on mobile, larger on desktop
      >
        {currency}
        {getNumberTwo(product?.prices?.price)}
      </span>
      {originalPrice > price && (
        <del
          className={`ml-1 ${card ? "text-xs font-normal" : "text-lg"} 
            text-gray-600 md:text-lg`}
        >
          {currency}
          {getNumberTwo(originalPrice)}
        </del>
      )}
    </>
  )}
</div>
  );
};

export default Price;
