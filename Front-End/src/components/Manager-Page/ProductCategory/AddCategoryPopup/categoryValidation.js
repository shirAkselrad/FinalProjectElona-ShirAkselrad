export function checkCategoryValidation(name, types) {
  //only letters, numbers and spaces are allowed
  const validText = /^[\p{L}\p{N} ]+$/u;

  //checking the the category name is not empty
  const validName = name.trim() != "" && validText.test(name);

  //checking types which are not empty
  const validTypes = types.every(
    (type) => type.trim() === "" || validText.test(type),
  );
  return validName && validTypes;
}
