import { useState } from "react";
import * as InventoryInputValidation from "../../../../utils/inventoryInputValidation.js";
import * as inputValidation from "../../../../utils/inputValidation.js";
import { ProductCategory, ProductSize } from "../../../../Enums/products.js";

function useProductForm() {
  const [frontImg, setFrontImg] = useState("");

  const [product, setProduct] = useState({
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
    files: [],
  });

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
    files: "",
  });

  const allowedExtensions = [".jpg", ".jpeg", ".png", ".webp"];

  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "",
  });

  function handleProductNameChange(value) {
    setProduct({
      ...product,
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

  function handleProductIdChange(value) {
    setProduct({
      ...product,
      product_id: value,
    });
    if (value.length != 9) {
      setErrors({
        ...errors,
        product_id: "Invalid product ID",
      });
    } else {
      setErrors({
        ...errors,
        product_id: "",
      });
    }
  }

  function handleProductCategoryChange(value) {
    setProduct({
      ...product,
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

  function handleProductSizeChange(value) {
    setProduct({
      ...product,
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

  function handleProductCountryChange(value) {
    setProduct({
      ...product,
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

  function handleProductPriceChange(value) {
    setProduct({
      ...product,
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

  function handleProductCostPriceChange(value) {
    setProduct({
      ...product,
      cost_price: value,
    });
    if (!InventoryInputValidation.checkPrice(value) || Number(value) <= 0) {
      setErrors({
        ...errors,
        cost_price: "Invalid cost price value",
      });
    } else if (Number(product.price) < Number(value)) {
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

  function handleProductQuantityChange(value) {
    setProduct({
      ...product,
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

  function handleProductMinStockChange(value) {
    setProduct({
      ...product,
      min_stock: value,
    });
    if (!InventoryInputValidation.onlyNumbers(value)) {
      setErrors({
        ...errors,
        min_stock: "Invalid min stock value",
      });
    } else if (Number(product.quantity) < Number(value)) {
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

  function handleProductDiscountChange(value) {
    setProduct({
      ...product,
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

  function handleProductMinSalesChange(value) {
    setProduct({
      ...product,
      min_sales: value,
    });
    if (!InventoryInputValidation.onlyNumbers(value) || value <= 0) {
      setErrors({
        ...errors,
        min_sales: "Invalid min sales value",
      });
    } else if (Number(product.quantity) < Number(value)) {
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

  //MUST BE CHANGED, LIMIT THE AMOUNT OF CHARS, ALSO CALL FOR FREETEXT COMPONENT !!!
  function handleProductDescriptionChange(value) {
    setProduct({
      ...product,
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

  function handleRestockRequiredChange(value) {
    setProduct((prev) => ({
      ...prev,
      restock_required: value,
    }));
  }

  function handleSalesCheckDateChange(value) {
    setProduct({
      ...product,
      sales_check_date: value,
    });
  }

  function handleColorsChange(value) {
    const updatedColors = product.colors.includes(value)
      ? product.colors.filter((c) => c !== value)
      : [...product.colors, value];

    setProduct({
      ...product,
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

  //The function gets a filesList from multiple and add it to the previous values of product (check if the images not already exsits )
  function handleProductFilesChange(files) {
    const filesToAdd = Array.from(files);

    const allowedFilesToAdd = filesToAdd.filter((file) =>
      allowedExtensions.some((ext) => file.name.toLowerCase().endsWith(ext)),
    );

    const newFiles = allowedFilesToAdd.filter(
      (newFile) =>
        !product.files.some(
          (existingFile) =>
            existingFile.file.name === newFile.name &&
            existingFile.file.size === newFile.size &&
            existingFile.file.lastModified === newFile.lastModified,
        ),
    );

    const newFilesWithId = newFiles.map((file, i) => {
      return {
        file: file,
        id: product.files.length + i,
      };
    });
    const duplicateFlag = newFilesWithId.length < allowedFilesToAdd.length;

    if (duplicateFlag) {
      setPopup({
        show: true,
        message: "Some images were already added and were skipped",
        type: "info",
      });
    }

    setProduct((prev) => ({
      ...prev,
      files: [...prev.files, ...newFilesWithId],
    }));

    if (frontImg === "" && newFilesWithId.length > 0) {
      setFrontImg(newFilesWithId[0].id);
    }

    if (newFilesWithId.length == 1) {
      setPopup({
        show: true,
        message: `${newFilesWithId[0].file.name} will be the front image of the product`,
        type: "info",
      });
    }
  }

  function handleRemoveFile(indexToRemove) {
    setProduct((prev) => ({
      ...prev,
      files: prev.files.filter((file, index) => index !== indexToRemove),
    }));
  }

  function handleRemoveAllFiles() {
    setProduct((prev) => ({
      ...prev,
      files: [],
    }));
  }

  return {
    product,
    errors,
    handleProductNameChange,
    handleProductIdChange,
    handleProductCategoryChange,
    handleProductSizeChange,
    handleProductCountryChange,
    handleProductPriceChange,
    handleProductCostPriceChange,
    handleProductQuantityChange,
    handleProductMinStockChange,
    handleProductDiscountChange,
    handleProductMinSalesChange,
    handleProductDescriptionChange,
    handleRestockRequiredChange,
    handleSalesCheckDateChange,
    handleColorsChange,
    handleProductFilesChange,
    handleRemoveFile,
    handleRemoveAllFiles,
    popup,
    setPopup,
    frontImg,
    setFrontImg,
  };
}

export default useProductForm;
