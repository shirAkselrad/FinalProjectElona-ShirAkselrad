export const validateForgotPasswordEmail = (email) => {
  if (!email.trim()) return "Email address cannot be empty";

  const emailRegex = /^[\w.-]+@[\w.-]+\.\w{2,}$/;

  if (!emailRegex.test(email)) return "Invalid email address";

  return "";
};
