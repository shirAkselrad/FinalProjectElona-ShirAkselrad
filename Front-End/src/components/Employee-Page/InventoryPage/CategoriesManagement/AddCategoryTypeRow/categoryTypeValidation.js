export const validationCategoryType = (type) => {
  const errors = {};
  if (!type.name.trim()) errors.name = "type name is required";
  else if (type.name.trim().length > 50)
    errors.name = "type name cannot exceed 50 characters";

  if (type.min_sales === "") errors.min_sales = "Minimum sales is required";
  else if (
    !Number.isInteger(Number(type.min_sales)) ||
    Number(type.min_sales) < 0
  )
    errors.min_sales = "Enter a valid positive whole number";

  if (type.sales_check_days === "")
    errors.sales_check_days = "Sales check days is required";
  else if (
    !Number.isInteger(Number(type.sales_check_days)) ||
    Number(type.sales_check_days) <= 0
  )
    errors.sales_check_days = "Enter a positive whole number";
  return errors;
};
