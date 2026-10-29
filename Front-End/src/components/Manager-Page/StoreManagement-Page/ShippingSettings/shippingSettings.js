export const validateShippingSettings = (settings) => {
  const errors = {};
  const price = Number(settings.shipping_price);
  const minDays = Number(settings.min_delivery_days);
  const maxDays = Number(settings.max_delivery_days);

  if (
    settings.shipping_price === "" ||
    !Number.isFinite(price) ||
    price < 0 ||
    !/^\d+(\.\d{1,2})?$/.test(String(settings.shipping_price))
  )
    errors.shipping_price = "Enter a valid shipping price";

  if (
    settings.min_delivery_days === "" ||
    !Number.isInteger(minDays) ||
    minDays < 0
  )
    errors.min_delivery_days = "Enter valid minimum delivery days";

  if (
    settings.max_delivery_days === "" ||
    !Number.isInteger(maxDays) ||
    maxDays < 0
  )
    errors.max_delivery_days = "Enter valid maximum delivery days";
  return errors;
};
