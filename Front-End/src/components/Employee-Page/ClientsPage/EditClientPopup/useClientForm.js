import { useState } from "react";
import * as Validation from "../../../../utils/inputValidation.js";

function useClientForm(initialClient) {
  const [client, setClient] = useState({
    first_name: initialClient?.first_name ?? "",
    last_name: initialClient?.last_name ?? "",
    phone_num: initialClient?.phone_num ?? "",
    city: initialClient?.city ?? "",
    street: initialClient?.street ?? "",
    house_num: initialClient?.house_num ?? "",
    role: initialClient?.role ?? "Client",
  });

  const [errors, setErrors] = useState({
    first_name: "",
    last_name: "",
    phone_num: "",
    city: "",
    street: "",
    house_num: "",
  });

  const [touched, setTouched] = useState({});

  //updates a specific field in client object
  function handleInputChange(field, value) {
    setClient((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, value),
    }));
  }

  function validateField(field, value) {
    switch (field) {
      case "first_name":
      case "last_name":
        return Validation.checkStr(value)
          ? ""
          : "Only letters and spaces are allowed";

      case "phone_num":
        return Validation.checkPhoneNum(value)
          ? ""
          : "Invalid phone number format";

      case "city":
      case "street":
        return Validation.checkStr(value)
          ? ""
          : "Only letters and spaces are allowed";

      case "house_num":
        return Validation.onlyNumbers(value) ? "" : "Only numbers allowed";
      default:
        return "";
    }
  }

  function handleInputBlur(field, value) {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, value),
    }));
  }

  const allFieldsFilled = Object.values(client).every(
    (value) => String(value).trim() !== "",
  );
  const allFieldsValid = Object.entries(client).every(
    ([field, value]) => validateField(field, value) === "",
  );
  const isFormValid = allFieldsFilled && allFieldsValid;

  return {
    client,
    errors,
    handleInputChange,
    handleInputBlur,
    isFormValid,
  };
}
export default useClientForm;
