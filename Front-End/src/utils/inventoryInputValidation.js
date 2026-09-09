//The function gets str, returns true if all the chars in it are only letters, else false
export function checkStr(str) {
  if (str.length == 0) return false;
  for (let i = 0; i < str.length; i++)
    if ((str[i] < "A" || str[i] < "Z") && (str[i] < "a" || str[i] > "z"))
      return false;
  return true;
}

//The function gets str, returns true if str is a valid price value, else, false
export function checkPrice(str) {
  if (str.length == 0) return false;
  if (str.startsWith(".") || str.endsWith(".")) return false;
  let pointCount = 0;
  let countAfterPoint = 0;

  for (let i = 0; i < str.length; i++) {
    if (str[i] === ".") {
      pointCount++;

      if (pointCount > 1) {
        return false;
      }
    } else if (str[i] < "0" || str[i] > "9") {
      return false;
    } else if (pointCount == 1) countAfterPoint++;
    if (countAfterPoint > 2) return false;
  }

  return true;
}

//The function gets str, return true if str contains only numbers, else, false
export function onlyNumbers(str) {
  if (str.length == 0) return false;
  for (let i = 0; i < str.length; i++)
    if (str[i] < "0" || str[i] > "9") return false;
  return true;
}

//This function gets str, return true if str is a valid precent value, else, false
export function checkDiscount(str) {
  if (!onlyNumbers(str)) return false;
  let precent = Number(str);
  if (precent < 0 || precent > 100) return false;
  return true;
}
