export function checkCategoryValidation(name, types) {
  //only letters, numbers and spaces are allowed
  const validText = /^[\p{L}\p{N} ]+$/u;

  //checking the the category name is not empty
  const validName = name.trim() != "" && validText.test(name);

  //checking types which are not empty
  const validTypes =
    types.length > 0 &&
    types.every(
      (type) =>
        type.name.trim() !== "" &&
        validText.test(type.name) &&
        type.min_sales!==""&&
        Number.isInteger(Number(type.min_sales)) &&
        Number(type.min_sales) > 0 &&
        type.sales_check_days !== "" &&
        Number.isInteger(Number(type.sales_check_days)) &&
        Number(type.sales_check_days) > 0,
    );
  return validName && validTypes;
}
