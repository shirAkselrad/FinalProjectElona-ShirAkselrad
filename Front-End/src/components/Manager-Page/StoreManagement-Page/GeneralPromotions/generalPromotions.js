export const emptyPromotion = {
  name: "",
  discount_percentage: "",
  min_order_price: "",
  start_date: "",
  end_date: "",
  status:"Not Active"
};

export const validatePromotion = (promotion) => {
  const errors = {};
  if (!promotion.name.trim()) errors.name = "Promotion name is required.";
  else if (promotion.name.trim().length > 100)
    errors.name = "Maximum 100 characters.";
  const discount = Number(promotion.discount_percentage);
  if (
    promotion.discount_percentage === "" ||
    !Number.isInteger(discount) ||
    discount < 1 ||
    discount > 100
  )
    errors.discount_percentage = "Invalid discount value";

  const price = Number(promotion.min_order_price);
  if (
    promotion.min_order_price === "" ||
    !Number.isFinite(price) ||
    price < 0 ||
    !/^\d+(\.\d{1,2})?$/.test(String(promotion.min_order_price))
  )
    errors.min_order_price = "Enter a valid price.";

  const startDate = new Date(promotion.start_date);
  const endDate = new Date(promotion.end_date);

  if (!promotion.start_date || Number.isNaN(startDate.getTime()))
    errors.start_date = "Enter a valid start date.";

  if (!promotion.end_date || Number.isNaN(endDate.getTime()))
    errors.end_date = "Enter a valid end date.";
  else if (!errors.start_date && endDate <= startDate)
    errors.end_date = "End date must be after start date.";

  return errors;
};
