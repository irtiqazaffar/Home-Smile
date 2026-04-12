import useUtilsFunction from "@hooks/useUtilsFunction";

const VariantDisplay = ({
  att,
  option,
  variants,
  setValue,
  varTitle,
  selectVariant,
  setSelectVariant,
  setSelectVa,
}) => {
  const { showingTranslateValue } = useUtilsFunction();

  const handleChangeVariant = (v) => {
    setValue(v);
    setSelectVariant({
      ...selectVariant,
      [att]: v,
    });
    setSelectVa({ [att]: v });
  };
  // console.log("option", );

  return (
    <>
        <div className="grid lg:grid-cols-3 grid-cols-2">
          {[
            ...new Map(
              variants?.map((v) => [v[att], v].filter(Boolean))
            ).values(),
          ]
            .filter(Boolean)
            .map((vl, i) =>
              varTitle.map((vr) =>
                vr?.variants?.map(
                  (el) =>
                    vr?._id === att &&
                    el?._id === vl[att] && (
                      <button
                        onClick={(e) => handleChangeVariant(vl[att])}
                        key={i + 1}
                        className={`${
                          Object?.values(selectVariant).includes(vl[att])
                            ? "bg-gray-600 text-white mr-2 border-0 inline-flex items-center justify-center px-3 py-1 text-xs font-serif mt-2 focus:outline-none"
                            : "bg-gray-600 mr-2 border-0 text-gray-600  inline-flex items-center justify-center px-3 py-1 text-xs font-serif mt-2 focus:outline-none"
                        }`}
                      >
                        {showingTranslateValue(el.name)}
                      </button>
                    )
                )
              )
            )}
        </div>
    </>
  );
};

export default VariantDisplay;
