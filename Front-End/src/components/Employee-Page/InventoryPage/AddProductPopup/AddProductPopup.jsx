import styles from "./addProductPopup.module.css";
import ColorSelect from "../../../General/ColorSelect/ColorSelect.jsx";
import InputField from "../../../General/InputField/InputField.jsx";
import InputLabel from "../../../General/InputLabel/InputLabel.jsx";
import GeneralBtn from "../../../General/GeneralBtn/GeneralBtn.jsx";
import CheckBoxField from "../../../General/CheckBoxField/CheckBoxField.jsx";
import Remove from "../../../General/Remove/Remove.jsx";
import * as InventoryValidation from "../../../../utils/inventoryInputValidation.js";
import GeneralSelection from "../../../General/GeneralSelection/GeneralSelection.jsx";
import DateInput from "../../../General/DateInput/DateInput.jsx";
import {
  ProductCategory,
  ProductSize,
  ProductStatus,
} from "../../../../Enums/products.js";
import { countries } from "../../../../data/countries.js";
import useProductForm from "./addProductPopupInfo.js"; 
import TextAreaField from "../../../General/TextAreaField/TextAreaField.jsx"
function AddProductPopup({ onClose }) {
  const {
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
  } = useProductForm();

  //The function check if the form is valid if it does, call the createUser function
  async function handleSubmit(e) {
    e.preventDefault();

    if (!isFormValid) return;
    const productData = {
      product_id: InventoryValidation.checkStr(product.product_id),
      name: InventoryValidation.checkStr(product.name),
      category: product.category,
      color: product.color,
      material: product.material,
      country_origin: product.country_origin,
      size: product.size,
      description: InventoryValidation.checkStr(product.description),
      price: InventoryValidation.checkPrice(product.price),
      cost_price: InventoryValidation.checkPrice(product.cost_price),
      discount: product.discount,
      quantity: InventoryValidation.onlyNumbers(product.quantity),
      min_stock: InventoryValidation.onlyNumbers(product.min_stock),
      status: product.status,
      restock_required: product.restock_required,
      sales_days: InventoryValidation.onlyNumbers(product.sales_days),
      min_sales: InventoryValidation.onlyNumbers(product.min_sales),
      image: InventoryValidation.onlyNumbers(product.image),
    };

    // const data = await createUser(userData);

    // //This part check if the user created and sent texts to the popup according to the success state
    // if (data?.success) {
    //   setDisplayMessagePopup({
    //     show: true,
    //     message: data.message,
    //     type: "success",
    //   });
    // } else {
    //   setDisplayMessagePopup({
    //     show: true,
    //     message: data?.message || "This User already exists",
    //     type: "error",
    //   });
    // }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.removeBtn}>
          <Remove onClick={onClose} />
        </div>

        <h2 className={styles.title}>ADD PRODUCT</h2>
        <form onSubmit={handleSubmit} className={styles.form}>
          <InputField
            label="Product Name"
            placeholder="Enter product name"
            error={errors.name}
            onChange={(e) => handleProductNameChange(e.target.value)}
            onBlur={(e) => handleProductNameChange(e.target.value)}
          />

          <div>
            <InputLabel text="Category" />
            <GeneralSelection
              value={product.category}
              options={Object.values(ProductCategory)}
              error={errors.category}
              onChange={(e) => {
                handleProductCategoryChange(e.target.value);
              }}
            />
          </div>

          <div>
            <InputLabel text="Size" />
            <GeneralSelection
              value={product.size}
              options={Object.values(ProductSize)}
              error={errors.size}
              onChange={(e) => {
                handleProductSizeChange(e.target.value);
              }}
            />
          </div>

          <div>
            <InputLabel text="Country of Origin" />
            <GeneralSelection
              value={product.country_origin}
              options={countries}
              error={errors.country_origin}
              onChange={(e) => {
                handleProductCountryChange(e.target.value);
              }}
            />
          </div>
          <ColorSelect onChange={handleColorChange} value={product.color} />

          <div className={styles.row}>
            <div className={styles.half}>
              <InputField
                label="Price"
                placeholder="0.00"
                type="number"
                error={errors.price}
                onChange={(e) => {
                  handleProductPriceChange(e.target.value);
                }}
                onBlur={(e) => {
                  handleProductPriceChange(e.target.value);
                }}
              />
            </div>

            <div className={styles.half}>
              <InputField
                label="Cost Price"
                placeholder="0.00"
                type="number"
                error={errors.cost_price}
                onChange={(e) => {
                  handleProductPriceChange(e.target.value);
                }}
                onBlur={(e) => {
                  handleProductPriceChange(e.target.value);
                }}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.half}>
              <InputField
                label="Quantity"
                placeholder="0"
                type="number"
                error={errors.quantity}
                onChange={(e) => handleProductQuantityChange(e.target.value)}
                onBlur={(e) => handleProductQuantityChange(e.target.value)}
              />
            </div>

            <div className={styles.half}>
              <InputField
                label="Minimum Stock"
                placeholder="0"
                type="number"
                error={errors.min_stock}
                onChange={(e) => handleProductMinStockChange(e.target.value)}
                onBlur={(e) => handleProductMinStockChange(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.half}>
              <InputField
                label="Discount (Precents)"
                placeholder="0"
                type="number"
                error={errors.discount}
                onChange={(e) => handleProductDiscountChange(e.target.value)}
                onBlur={(e) => handleProductDiscountChange(e.target.value)}
              />
            </div>

            <div className={styles.half}>
              <InputField
                label="Minimum Sales"
                placeholder="0"
                type="number"
                error={errors.min_sales}
                onChange={(e) => handleProductMinSalesChange(e.target.value)}
                onBlur={(e) => handleProductMinSalesChange(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.half}>
              <DateInput
                label="Sales Check Date"
                value={product.sales_check_date}
                onChange={(e) => handleSalesCheckDateChange(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                error={errors.sales_check_date}
              />
            </div>
          </div>

          <div className={styles.description}>
            <TextAreaField
              label="Description"
              placeholder="Enter product description"
              value={product.description}
              onChange={(e) => handleProductDescriptionChange(e.target.value)}
              maxLength={250}
              error={errors.description}
            />
          </div>

          <div className={styles.image}>
            <InputLabel text="Product Image" />

            <label className={styles.fileButton}>
              CHOOSE IMAGE
              <input type="file" />
            </label>
          </div>

          <div>
            <InputLabel text="Status" />
            <GeneralSelection
              value={product.status}
              options={Object.values(ProductStatus)}
              onChange={(e) => handleProductStatusChange(e.target.value)}
            />
          </div>

          <div className={styles.checkboxField}>
            <InputLabel text="Restock Reminder" />
            <CheckBoxField
              text="Required"
              checked={product.restock_required}
              onChange={(e) => handleRestockRequiredChange(e.target.checked)}
            />
          </div>

          <GeneralBtn
            text="ADD PRODUCT"
            type="button"
            className={styles.addBtn}
          />
        </form>
      </div>
    </div>
  );
}

export default AddProductPopup;
