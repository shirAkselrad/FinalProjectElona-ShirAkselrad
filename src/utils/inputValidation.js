//The function gets str and check that the str includes ONLY letters or spaces
export function checkStr(str) {
  if (str.length == 0 || str.length > 50) return false;

  for (let i = 0; i < str.length; i++) {
    if (
      (str[i] < "a" || str[i] > "z") &&
      (str[i] < "A" || str[i] > "Z") &&
      str[i] !== " "
    ) {
      return false;
    }
  }

  return true;
}

//The function check that str contains ONLY char numbers
export function onlyNumbers(str) {
  if (str.length == 0 || str.length > 4) return false;

  for (let i = 0; i < str.length; i++) {
    if (str[i] < "0" || str[i] > "9") return false;
  }

  return true;
}

//The function check that str is an email address
export function checkEmail(str) {
  const emailRegex = /^[\w.-]+@[\w.-]+\.\w{2,}$/;
  return emailRegex.test(str);
}

//The function check that str is a valid username (must include 8-12 chars and 2 capital letters)
export function checkUsername(str) {
  if (str.length < 8 || str.length > 12) return false;
  let count = 0;
  for (let i = 0; i < str.length; i++)
    if (str[i] >= "A" && str[i] <= "Z") count++;

  if (count >= 2) return true;
  return false;
}

//The function check if str is a valid password
export function checkPassword(str) {
  if (str.length < 8 || str.length > 12) return false;
  const specialChars = "!@#$%^&*?";
  let special = false;
  let capital = false;
  for (let i = 0; i < str.length; i++) {
    if (specialChars.includes(str[i])) special = true;
    if (str[i] >= "A" && str[i] <= "Z") capital = true;
  }

  return capital && special;
}

//The function checks if str is a valid phone number pattern
export function checkPhoneNum(str) {
  const phoneRegex = /^0\d{1,2}-?\d{7}$/;
  return phoneRegex.test(str);
}



//The function check that both passwords are equal
export function checkVerificationPassword(password, str) {
  if (password === str) return true;
  return false;
}

export function onlyFirstLetterCapital(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
