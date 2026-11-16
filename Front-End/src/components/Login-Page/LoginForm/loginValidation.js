//checks if both username and password are not empty 
export const validateLoginField = (field, value) => {
  if (field === "userName" && !value.trim()) return "Username cannot be empty";

  if (field === "password" && !value) return "Password cannot be empty";
  return "";
};

export const checkLoginValidation = (user) => {
  return (
    validateLoginField("userName", user.userName) === "" &&
    validateLoginField("password", user.password) === ""
  );
};
