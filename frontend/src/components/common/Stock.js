import useTranslation from "next-translate/useTranslation";

const Stock = ({ stock, card }) => {
  const { t } = useTranslation();

  return (
    <>
      {stock <= 0 ? (
        <span className="absolute z-10 text-red-700 rounded-full inline-flex items-center justify-center px-2 py-1 text-sm font-medium font-serif">
          {t("common:stockOut")}
        </span>
        ) : (
          <>
            <span
              className={`${
                card
                  ? "absolute z-10 text-teal-500 rounded-full text-sm px-2 py-1 font-large"
                  : "text-teal-500 rounded-full inline-flex items-center justify-center px-2 py-1 text-sm font-large font-serif"
              }`}
            >
              {t("common:stock")} :
              <span className="text-orange-700 pl-1 font-bold text-lg">{stock} </span>
            </span>
          </>
      )}
    </>
  );
};

export default Stock;
