import { useState } from "react";
import * as InventoryInputValidation from "../../../../utils/inventoryInputValidation.js";
import {
  ProductCategory,
  ProductSize,
  ProductStatus,
} from "../../../../Enums/products.js";

function useProductForm() {
  const [product, setProduct] = useState({
    product_id: "",
    name: "",
    category: ProductCategory.NONE,
    color: "",
    material: "",
    country_origin: "None",
    size: ProductSize.NONE,
    description: "",
    price: "",
    cost_price: "",
    discount: "",
    quantity: "",
    min_stock: "",
    status: ProductStatus.ACTIVE,
    restock_required: true,
    sales_check_date: "",
    min_sales: "",
    image: "",
  });

  const [errors, setErrors] = useState({
    product_id: "",
    name: "",
    category: "",
    color: "",
    material: "",
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
    image: "",
  });

  function handleProductNameChange(value) {
    setProduct({
      ...product,
      name: value,
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
    if (!InventoryInputValidation.checkPrice(value) || Number(value)<=0) {
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

  function handleProductQuantityChange(value) {
    setProduct({
      ...product,
      quantity: value,
    });
    if (!InventoryInputValidation.onlyNumbers(value) || Number(value)<=0) {
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
    if (!InventoryInputValidation.checkDiscount(value)|| Number(value)<=0) {
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
    if (!InventoryInputValidation.onlyNumbers(value) || value<=0) {
      setErrors({
        ...errors,
        min_sales: "Invalid min sales value",
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
      description: value,
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

  function handleProductStatusChange(value) {
    setProduct({
      ...product,
      status: value,
    });
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

  function handleColorChange(value) {
    setProduct((prev) => ({
      ...prev,
      color: value,
    }));
  }
  return {
    product,
    errors,
    handleProductNameChange,
    handleProductCategoryChange,
    handleProductSizeChange,
    handleProductCountryChange,
    handleProductPriceChange,
    handleProductQuantityChange,
    handleProductMinStockChange,
    handleProductDiscountChange,
    handleProductMinSalesChange,
    handleProductDescriptionChange,
    handleProductStatusChange,
    handleRestockRequiredChange,
    handleSalesCheckDateChange,
    handleColorChange,
  };
}

export default useProductForm;
