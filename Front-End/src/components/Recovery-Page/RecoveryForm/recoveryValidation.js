export const validateRecoveryCode = (code) => {
  if (!/^\d{6}$/.test(code))
    return "Recovery code must contain exactly 6 digits.";
  return ""; 
};
