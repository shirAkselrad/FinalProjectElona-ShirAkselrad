import styles from "./addProductPopup.module.css";
import InputField from "../../../General/InputField/InputField.jsx";
import InputLabel from "../../../General/InputLabel/InputLabel.jsx";
import GeneralBtn from "../../../General/GeneralBtn/GeneralBtn.jsx";
import CheckBoxField from "../../../General/CheckBoxField/CheckBoxField.jsx";
import Remove from "../../../General/Remove/Remove.jsx";
import GeneralSelection from "../../../General/GeneralSelection/GeneralSelection.jsx";
import DateInput from "../../../General/DateInput/DateInput.jsx";
import { ProductCategory, ProductSize } from "../../../../Enums/products.js";
import { countries } from "../../../../data/countries.js";
import useProductForm from "./addProductPopupInfo.js";
import TextAreaField from "../../../General/TextAreaField/TextAreaField.jsx";
import ImageUploadBtn from "../../../General/ImageUploadBtn/ImageUploadBtn.jsx";
import { useEffect, useState } from "react";
import BrightGeneralBtn from "../../../General/BrightGeneralBtn/BrightGeneralBtn.jsx";
import ImagesPreviewList from "../../../General/ImagesPreviewList/ImagesPreviewList.jsx";
import MessagePopup from "../../../General/MessagePopup/MessagePopup.jsx";
import FileSelection from "../../../General/FileSelection/FileSelection.jsx";
import ColorsCheckBoxList from "../../../General/Colors/ColorsCheckBoxList/ColorsCheckBoxList.jsx";
import { colors } from "../../../../data/colors.js";

/**
 *
 * @param {function} onClose this function closes the AddProductPopup
 * @param {function} onProductAdded returns the info about the new product back to the inventory page for refreshing the front-end inventory
 * @returns
 */
function AddProductPopup({ onClose, onProductAdded }) {
  const [step, setStep] = useState(1);
  //This function adds a new product to the backend
  async function createProduct(formData) {
    try {
      const response = await fetch("/api/employee/createProduct", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("error ucreating new product, error: ", error);
      return {
        success: false,
        message: "Couldn't add product",
      };
    }
  }
  useEffect(() => {
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  //all the full functions exists on the "addProductPopupInfo"- useProductForm
  const {
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
  } = useProductForm();

  //The function check if the form is valid if it does, call the createUser function
  async function handleSubmit(e) {
    e.preventDefault();

    //if the are no errors or any empty inputs beggining to prepering the new product info to backend
    if (!noErrors || !noEmptyInputs) return;
    const formData = new FormData();

    console.log("FRONT IMG SENT:", frontImg);
    console.log("FILES:", product.files);

    formData.append("product_id", product.product_id.trim());
    formData.append("name", product.name.trim());
    formData.append("category", product.category);
    formData.append("colors", product.colors.join("-"));
    formData.append("country_origin", product.country_origin);
    formData.append("size", product.size);
    formData.append("description", product.description.trim());
    formData.append("price", product.price.trim());
    formData.append("cost_price", product.cost_price.trim());
    formData.append("discount", product.discount.trim());
    formData.append("quantity", product.quantity.trim());
    formData.append("min_stock", product.min_stock.trim());
    formData.append("restock_required", product.restock_required ? 1 : 0);
    formData.append("sales_check_date", product.sales_check_date);
    formData.append("min_sales", product.min_sales.trim());

    //uploading all the files array
    product.files.forEach((file) => {
      formData.append("uploading-files", file.file);
      formData.append("filesId", file.id);
    });
    formData.append("frontImg", frontImg);
    const data = await createProduct(formData);

    //if the adding operation successed so front-end will be refreshed
    if (data?.success) {
      await onProductAdded();

      setPopup({
        show: true,
        message: "Product added successfully",
        type: "success",
      });
    } else {
      setPopup({
        show: true,
        message: data?.message || "Couldn't add product",
        type: "error",
      });
    }
  }

  //checking there is no errors in the inputs before sending it to backend
  const noErrors = Object.values(errors).every((error) => error === "");

  const noEmptyInputs = Object.entries(product)
    .filter(([key]) => key !== "files")
    .every(([, input]) => input !== "" && input != "None");
  return (
    <div className={styles.overlay}>
      {/**opening a popup according to the success status  */}
      {popup.show && (
        <MessagePopup
          message={popup.message}
          type={popup.type}
          onClose={() => {
            const isSuccess = popup.type === "success";

            setPopup({
              show: false,
              message: "",
              type: "",
            });

            if (isSuccess) {
              onClose();
            }
          }}
        />
      )}
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
          <InputField
            label="Product ID"
            placeholder="Enter product ID"
            error={errors.product_id}
            onChange={(e) => handleProductIdChange(e.target.value)}
            onBlur={(e) => handleProductIdChange(e.target.value)}
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

          <InputLabel text="Product's colors" />
          <ColorsCheckBoxList
            colors={colors}
            selectedColors={product.colors}
            onChange={handleColorsChange}
            error={errors.colors}
          />
          <div className={styles.row}>
            <div className={styles.half}>
              <InputField
                label="Price"
                placeholder="0.00"
                type="number"
                step="0.01"
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
                step="0.01"
                error={errors.cost_price}
                onChange={(e) => {
                  handleProductCostPriceChange(e.target.value);
                }}
                onBlur={(e) => {
                  handleProductCostPriceChange(e.target.value);
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
            <InputLabel text="Product Files" />
            <span className={styles.fileInfo}>
              Allowed files: JPG, JPEG, PNG, WEBP
            </span>
            <div className={styles.imageButtons}>
              <ImageUploadBtn
                text="ADD FILES"
                multiple
                onChange={(e) => handleProductFilesChange(e.target.files)}
              />

              {product.files.length > 0 && (
                <BrightGeneralBtn
                  text="REMOVE ALL"
                  onClick={handleRemoveAllFiles}
                />
              )}
            </div>
            <ImagesPreviewList
              images={product.files}
              onRemove={handleRemoveFile}
            />
            <InputLabel text="Front Image" />
            <FileSelection
              files={product.files}
              value={frontImg}
              onChange={setFrontImg}
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
            text="NEXT"
            type="button"
            className={styles.addBtn}
            disabled={!noErrors || !noEmptyInputs}
            onClick={() => setStep(2)}
          />
        </form>
      </div>
    </div>
  );
}

export default AddProductPopup;
