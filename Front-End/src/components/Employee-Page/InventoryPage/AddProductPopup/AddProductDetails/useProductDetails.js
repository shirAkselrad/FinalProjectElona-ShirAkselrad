import { useState } from "react";
import * as InventoryInputValidation from "../../../../../utils/inventoryInputValidation.js";
import * as inputValidation from "../../../../../utils/inputValidation.js";
import { ProductCategory, ProductSize } from "../../../../../Enums/products.js";

//passing empty product (as long as the user didn't press back)
function useProductDetails(initialDetails = null) {
  const emptyDetails = {
    product_id: "",
    name: "",
    category: ProductCategory.NONE,
    colors: [],
    country_origin: "None",
    size: ProductSize.NONE,
    description: "",
    price: "",
    cost_price: "",
    discount: "",
    quantity: "",
    min_stock: "",
    restock_required: true,
    sales_check_date: "",
    min_sales: "",
  };

  //if products details are not empty then we will work with them (probably after the user clicked back), else starting with an empty product details
  const [details, setDetails] = useState(initialDetails || emptyDetails);

  //all the errors that might be while filling all the inputs
  const [errors, setErrors] = useState({
    product_id: "",
    name: "",
    category: "",
    colors: "",
    country_origin: "",
    size: "",
    description: "",
    price: "",
    cost_price: "",
    discount: "",
    quantity: "",
    min_stock: "",
    restock_required: "",
    sales_check_date: "",
    min_sales: "",
  });

  //this function check the value of the product's name
  function handleProductNameChange(value) {
    setDetails({
      ...details,
      name: InventoryInputValidation.everyWordWithCapitalLetter(value),
    });

    if (!InventoryInputValidation.checkStr(value)) {
      setErrors({
        ...errors,
        name: "Product name cannot be empty and must contain ONLY letters",
      });
    } else {
      setErrors({
        ...errors,
        name: "",
      });
    }
  }

  //this function gets value and return true if all the chars are digits, else,false
  function onlyNumbers(value) {
    for (let i = 0; i < value.length; i++)
      if (value[i] < "0" || value[i] > "9") return false;
    return true;
  }

  //this function check the validation of the product's id
  function handleProductIdChange(value) {
    setDetails({
      ...details,
      product_id: value,
    });
    if (value.length != 9) {
      setErrors({
        ...errors,
        product_id: "Invalid product ID",
      });
    } else if (!onlyNumbers(value)) {
      setErrors({
        ...errors,
        product_id: "Product ID must contain ONLY digits",
      });
    } else {
      setErrors({
        ...errors,
        product_id: "",
      });
    }
  }

  //This function check the validation of the product's category
  function handleProductCategoryChange(value) {
    setDetails({
      ...details,
      category: value,
    });
    if (value === ProductCategory.NONE) {
      setErrors({
        ...errors,
        category: "Please select a category",
      });
    } else {
      setErrors({
        ...errors,
        category: "",
      });
    }
  }

  //This function check the validation of the product's size
  function handleProductSizeChange(value) {
    setDetails({
      ...details,
      size: value,
    });
    if (value === ProductSize.NONE) {
      setErrors({
        ...errors,
        size: "Please select a size",
      });
    } else {
      setErrors({
        ...errors,
        size: "",
      });
    }
  }

  //This function check the validation of the product's country origin
  function handleProductCountryChange(value) {
    setDetails({
      ...details,
      country_origin: value,
    });
    if (value === "None") {
      setErrors({
        ...errors,
        country_origin: "Please select a country",
      });
    } else {
      setErrors({
        ...errors,
        country_origin: "",
      });
    }
  }

  //This function checks the validation of the product's price
  function handleProductPriceChange(value) {
    setDetails({
      ...details,
      price: value,
    });
    if (!InventoryInputValidation.checkPrice(value) || Number(value) <= 0) {
      setErrors({
        ...errors,
        price: "Invalid price value",
      });
    } else {
      setErrors({
        ...errors,
        price: "",
      });
    }
  }

  //This function checks the validation of the product's cost price
  function handleProductCostPriceChange(value) {
    setDetails({
      ...details,
      cost_price: value,
    });
    if (!InventoryInputValidation.checkPrice(value) || Number(value) <= 0) {
      setErrors({
        ...errors,
        cost_price: "Invalid cost price value",
      });
    } else if (Number(details.price) < Number(value)) {
      setErrors({
        ...errors,
        cost_price: "Cost price cannot be higher than the selling price ",
      });
    } else {
      setErrors({
        ...errors,
        cost_price: "",
      });
    }
  }

  //This function check the validation of the product's quantity
  function handleProductQuantityChange(value) {
    setDetails({
      ...details,
      quantity: value,
    });
    if (!InventoryInputValidation.onlyNumbers(value) || Number(value) <= 0) {
      setErrors({
        ...errors,
        quantity: "Invalid quantity value",
      });
    } else {
      setErrors({
        ...errors,
        quantity: "",
      });
    }
  }

  //This function checks the validation of the product's min_stock value
  function handleProductMinStockChange(value) {
    setDetails({
      ...details,
      min_stock: value,
    });
    if (!InventoryInputValidation.onlyNumbers(value)) {
      setErrors({
        ...errors,
        min_stock: "Invalid min stock value",
      });
    } else if (Number(details.quantity) < Number(value)) {
      setErrors({
        ...errors,
        min_stock: "Minimum stock cannot be bigger than product's quantity.",
      });
    } else {
      setErrors({
        ...errors,
        min_stock: "",
      });
    }
  }

  //This function check the validation of the product's discount value
  function handleProductDiscountChange(value) {
    setDetails({
      ...details,
      discount: value,
    });
    if (!InventoryInputValidation.checkDiscount(value) || Number(value) < 0) {
      setErrors({
        ...errors,
        discount: "Invalid discount value",
      });
    } else {
      setErrors({
        ...errors,
        discount: "",
      });
    }
  }

  //This function checks the validation of the product's min_sales value
  function handleProductMinSalesChange(value) {
    setDetails({
      ...details,
      min_sales: value,
    });
    if (!InventoryInputValidation.onlyNumbers(value) || value <= 0) {
      setErrors({
        ...errors,
        min_sales: "Invalid min sales value",
      });
    } else if (Number(details.quantity) < Number(value)) {
      setErrors({
        ...errors,
        min_sales: "Minimum sales cannot be bigger than product's quantity.",
      });
    } else {
      setErrors({
        ...errors,
        min_sales: "",
      });
    }
  }

  //This function checks the validation of the product's description
  function handleProductDescriptionChange(value) {
    setDetails({
      ...details,
      description: inputValidation.onlyFirstLetterCapital(value),
    });
    if (value == "") {
      setErrors({
        ...errors,
        description: "Description cannot be empty",
      });
    } else {
      setErrors({
        ...errors,
        description: "",
      });
    }
  }

  //This function changes the restock require value
  function handleRestockRequiredChange(value) {
    setDetails((prev) => ({
      ...prev,
      restock_required: value,
    }));
  }

  //This function sets the chosen check date
  function handleSalesCheckDateChange(value) {
    setDetails({
      ...details,
      sales_check_date: value,
    });
  }

  //This function set the product's color/s
  function handleColorsChange(value) {
    const updatedColors = details.colors.includes(value)
      ? details.colors.filter((c) => c !== value)
      : [...details.colors, value];

    setDetails({
      ...details,
      colors: updatedColors,
    });

    if (updatedColors.length === 0) {
      setErrors({
        ...errors,
        colors:
          "Colors field cannot stay empty. Please choose at least one color.",
      });
    } else {
      setErrors({
        ...errors,
        colors: "",
      });
    }
  }

  //This function check all the inputs, only if all the values are valid returns true, else, false
  function checkInputDetailsValidation() {
    const noErrors = Object.values(errors).every((error) => error === "");
    const noEmptyInputs =
      details.name !== "" &&
      details.product_id !== "" &&
      details.category !== ProductCategory.NONE &&
      details.size !== ProductSize.NONE &&
      details.country_origin !== "None" &&
      details.colors.length > 0 &&
      details.price !== "" &&
      details.cost_price !== "" &&
      details.quantity !== "" &&
      details.min_stock !== "" &&
      details.discount !== "" &&
      details.min_sales !== "" &&
      details.sales_check_date !== "" &&
      details.description !== "";

    return noErrors && noEmptyInputs;
  }

  return {
    details,
    errors,
    handleColorsChange,
    handleProductCategoryChange,
    handleProductCostPriceChange,
    handleProductCountryChange,
    handleProductDescriptionChange,
    handleProductDiscountChange,
    handleProductIdChange,
    handleProductMinSalesChange,
    handleProductMinStockChange,
    handleProductNameChange,
    handleProductPriceChange,
    handleProductQuantityChange,
    handleProductSizeChange,
    handleRestockRequiredChange,
    handleSalesCheckDateChange,
    checkInputDetailsValidation,
  };
}
export default useProductDetails;
