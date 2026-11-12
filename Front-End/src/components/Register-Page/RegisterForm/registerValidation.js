import * as Validation from "../../../utils/inputValidation.js";

//validates a single registration field
export const validateRegisterField = (field, value, user) => {
  if (!value.trim()) return "This field is required";

  switch (field) {
    case "firstName":
    case "lastName":
    case "city":
    case "street":
      return Validation.checkStr(value)
        ? ""
        : "Only letters and spaces are allowed";

    case "houseNum":
      return Validation.onlyNumbers(value) ? "" : "Only numbers allowed";

    case "email":
      return Validation.checkEmail(value) ? "" : "Invalid email";

    case "phoneNum":
      return Validation.checkPhoneNum(value) ? "" : "Invalid phone number";

    case "userName":
      return Validation.checkUsername(value)
        ? ""
        : "Username must include 8-12 chars and at least 2 capital letters";

    case "password":
      return Validation.checkPassword(value)
        ? ""
        : "Password must include 8-12 chars, a capital letter and a special character";

    case "verifyPassword":
      return Validation.checkVerificationPassword(user.password, value)
        ? ""
        : "Passwords don't match";

    default:
      return "";
  }
};


//checks invalid characters while typing
const validateRegisterTyping = (field, value) => {
  if (!value) return "";

  switch (field) {
    case "firstName":
    case "lastName":
    case "city":
    case "street":
      return /^[A-Za-z ]*$/.test(value)
        ? ""
        : "Only letters and spaces are allowed";

    case "houseNum":
      return /^\d*$/.test(value)
        ? ""
        : "Only numbers are allowed";

    case "phoneNum":
      return /^[\d-]*$/.test(value)
        ? ""
        : "Only numbers are allowed";

    default:
      return "";
  }
};


//updates errors while typing
export const validateRegisterChange = (field, user, errors) => {
  const typingError = validateRegisterTyping(field, user[field]);

  const updatedErrors = {
    ...errors,
    [field]: typingError ||
      (errors[field]
        ? validateRegisterField(field, user[field], user)
        : ""),
  };

  if (
    (field === "password" || field === "verifyPassword") &&
    user.verifyPassword
  ) {
    updatedErrors.verifyPassword = validateRegisterField(
      "verifyPassword",
      user.verifyPassword,
      user,
    );
  }

  return updatedErrors;
};


//validates a field when the user leaves it
export const validateRegisterBlur = (field, user, errors) => {
  return {
    ...errors,
    [field]: validateRegisterField(field, user[field], user),
  };
};

//checks the complete form before enabling submission
export const checkRegisterValidation = (user) => {
  return Object.keys(user).every(
    (field) => validateRegisterField(field, user[field], user) === "",
  );
};
