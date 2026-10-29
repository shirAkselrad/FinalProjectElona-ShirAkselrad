export const validatePointsSettings = (settings) => {
  const errors = {};
  const minPrice = Number(settings.min_order_price);
  const percenatge = Number(settings.earning_percentage);

  if (
    settings.min_order_price === "" ||
    !Number.isFinite(minPrice) ||
    minPrice < 0 ||
    !/^\d+(\.\d{1,2})?$/.test(String(settings.min_order_price))
  )
    errors.min_order_price = "Enter a valid minimum order price.";

  if (
    settings.earning_percentage === "" ||
    !Number.isFinite(percenatge) ||
    percenatge < 0 ||
    percenatge > 100 ||
    !/^\d+(\.\d{1,2})?$/.test(String(settings.earning_percentage))
  )
    errors.earning_percentage = "Enter a valid percentage between 0 and 100.";
  return errors;
};
