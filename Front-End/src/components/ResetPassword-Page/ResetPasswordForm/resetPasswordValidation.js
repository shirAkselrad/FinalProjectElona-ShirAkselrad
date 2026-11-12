export const validateResetPasswordField = (field, value, password) => {
  if (field === "password")
    if (
      value.length < 8 ||
      value.length > 12 ||
      !/[A-Z]/.test(value) ||
      !/[!@#$%^&*?]/.test(value)
    )
      return "Password must be 8-12 characters and contain a capital letter and special character";

  if (field === "verification" && value !== password)
    return "Passwords don't match";
  return "";
};

export const checkResetPasswordValidation = (password, verification) => {
  return (
    validateResetPasswordField("password", password) === "" &&
    validateResetPasswordField("verification", verification, password) === ""
  );
};

export const validatePasswordChange = (field, value, passwords, errors) => {
  const updatedPasswords = {
    ...passwords,
    [field]: value,
  };
  return {
    ...errors,
    [field]: "",
    verification: updatedPasswords.verification
      ? validateResetPasswordField(
          "verification",
          updatedPasswords.verification,
          updatedPasswords.password,
        )
      : "",
  };
};

export const validatePasswordBlur = (field, value, passwords, errors) => {
  const updatedErrors = {
    ...errors,
    [field]: validateResetPasswordField(field, value, passwords.password),
  };
  if (field === "password" && passwords.verification)
    updatedErrors.verification = validateResetPasswordField(
      "verification",
      passwords.verification,
      value,
    );
  return updatedErrors;
};
