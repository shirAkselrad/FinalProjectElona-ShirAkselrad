import styles from "../AddProductPopup/addProductPopup.module.css";
import MessagePopup from "../../../General/MessagePopup/MessagePopup.jsx";
import InputField from "../../../General/InputField/InputField.jsx";
import InputLabel from "../../../General/InputLabel/InputLabel.jsx";
import GeneralBtn from "../../../General/GeneralBtn/GeneralBtn.jsx";
import CheckBoxField from "../../../General/CheckBoxField/CheckBoxField.jsx";
import Remove from "../../../General/Remove/Remove.jsx";
import GeneralSelection from "../../../General/GeneralSelection/GeneralSelection.jsx";
import DateInput from "../../../General/DateInput/DateInput.jsx";
import TextAreaField from "../../../General/TextAreaField/TextAreaField.jsx";
import ImageUploadBtn from "../../../General/ImageUploadBtn/ImageUploadBtn.jsx";
import ColorsCheckBoxList from "../../../General/Colors/ColorsCheckBoxList/ColorsCheckBoxList.jsx";
import ImagesPreviewList from "../../../General/ImagesPreviewList/ImagesPreviewList.jsx";
import FileSelection from "../../../General/FileSelection/FileSelection.jsx";
import { ProductCategory, ProductSize } from "../../../../Enums/products.js";
import { countries } from "../../../../data/countries.js";
import { colors } from "../../../../data/colors.js";
import { useEffect, useState } from "react";
import useEditProductImgs from "./editProductPopup.js";
import useProductForm from "../AddProductPopup/addProductPopupInfo.js";
function EditProductPopup({ onClose, product, onSave }) {
  const [productImgs, setProductImgs] = useState([]);
  async function editProduct(formData) {
    try {
      const response = await fetch(
        `/api/employee/editedProduct/${product.product_id}`,
        {
          method: "PUT",
          body: formData,
        },
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("couldn't update the wanted product, error: ", error);
    }
  }

  async function getProductImgs() {
    try {
      const response = await fetch(
        `/api/employee/getProductImages/${product.product_id}`,
        {
          method: "GET",
        },
      );
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();

      //this operation is for fitting the imgs fomate to FileSelection component
      const formattedImgs = data.files.map((image) => ({
        ...image,
        id: image.auto_file_name,
        file: {
          name: image.file_name,
        },
      }));

      setProductImgs(formattedImgs);
    } catch (error) {
      console.error("Couldn't get product's images, error: ", error);
    }
  }

  useEffect(() => {
    console.log("EDIT PRODUCT USE EFFECT");

    document.body.style.overflow = "hidden";
    getProductImgs();
    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  const frontImg = productImgs.find((img) => img.frontImg === 1);

  //changing the product's formate so it will be fitted to useProductForm object formate
  const initialProduct = {
    ...product,
    colors: product.colors.split("-"),
  };

  const {
    product: editedProduct,
    errors,
    handleProductNameChange,
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
  } = useProductForm(initialProduct);

  const { handleAddFiles, popup, setPopup } =
    useEditProductImgs(setProductImgs);

  return (
    <div className={styles.overlay}>
      {popup.show && (
        <MessagePopup
          message={popup.message}
          type={popup.type}
          onClose={() =>
            setPopup({
              show: false,
              message: "",
              type: "",
            })
          }
        />
      )}
      <div className={styles.popup}>
        <div className={styles.removeBtn}>
          <Remove onClick={onClose} />
        </div>

        <h2 className={styles.title}>EDIT PRODUCT Test</h2>

        <form className={styles.form}>
          <InputField
            label="Product Name"
            placeholder="Enter product name"
            value={editedProduct.name}
            onChange={(e) => handleProductNameChange(e.target.value)}
            error={errors.name}
          />

          <InputField
            label="Product ID"
            placeholder="Enter product ID"
            value={editedProduct.product_id}
            disabled
          />

          <div>
            <InputLabel text="Category" />
            <GeneralSelection
              value={editedProduct.category}
              options={Object.values(ProductCategory)}
              onChange={(e) => handleProductCategoryChange(e.target.value)}
              error={errors.category}
            />
          </div>

          <div>
            <InputLabel text="Size" />
            <GeneralSelection
              value={editedProduct.size}
              options={Object.values(ProductSize)}
              onChange={(e) => handleProductSizeChange(e.target.value)}
              error={errors.size}
            />
          </div>

          <div>
            <InputLabel text="Country of Origin" />
            <GeneralSelection
              value={editedProduct.country_origin}
              options={countries}
              onChange={(e) => handleProductCountryChange(e.target.value)}
            />
          </div>

          <InputLabel text="Product's colors" />

          <ColorsCheckBoxList
            colors={colors}
            selectedColors={editedProduct.colors}
            onChange={handleColorsChange}
            error={errors.colors}
          />

          <div className={styles.row}>
            <div className={styles.half}>
              <InputField
                value={editedProduct.price}
                label="Price"
                placeholder="0.00"
                type="number"
                step="0.01"
                onChange={(e) => handleProductPriceChange(e.target.value)}
                error={errors.price}
              />
            </div>

            <div className={styles.half}>
              <InputField
                value={editedProduct.cost_price}
                label="Cost Price"
                placeholder="0.00"
                type="number"
                step="0.01"
                onChange={(e) => handleProductCostPriceChange(e.target.value)}
                error={errors.cost_price}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.half}>
              <InputField
                value={editedProduct.quantity}
                label="Quantity"
                placeholder="0"
                type="number"
                onChange={(e) => handleProductQuantityChange(e.target.value)}
                error={errors.quantity}
              />
            </div>

            <div className={styles.half}>
              <InputField
                value={editedProduct.min_stock}
                label="Minimum Stock"
                placeholder="0"
                type="number"
                onChange={(e) => handleProductMinStockChange(e.target.value)}
                error={errors.min_stock}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.half}>
              <InputField
                value={editedProduct.discount}
                label="Discount (Precents)"
                placeholder="0"
                type="number"
                onChange={(e) => handleProductDiscountChange(e.target.value)}
                error={errors.discount}
              />
            </div>

            <div className={styles.half}>
              <InputField
                value={editedProduct.min_sales}
                label="Minimum Sales"
                placeholder="0"
                type="number"
                onChange={(e) => handleProductMinSalesChange(e.target.value)}
                error={errors.min_sales}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.half}>
              <DateInput
                value={editedProduct.sales_check_date?.split("T")[0]}
                label="Sales Check Date"
                onChange={(e) => handleSalesCheckDateChange(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                error={errors.sales_check_date}
              />
            </div>
          </div>

          <div className={styles.description}>
            <TextAreaField
              value={editedProduct.description}
              label="Description"
              placeholder="Enter product description"
              maxLength={250}
              onChange={(e) => handleProductDescriptionChange(e.target.value)}
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
                onChange={(e) => handleAddFiles(e.target.files)}
              />
            </div>
            <ImagesPreviewList images={productImgs} />

            <InputLabel text="Front Image" />
            <FileSelection
              files={productImgs}
              value={frontImg}
              onChange={(e) => onChange(e.target.value)}
            />
          </div>

          <div className={styles.checkboxField}>
            <InputLabel text="Restock Reminder" />

            <CheckBoxField
              checked={Boolean(editedProduct.restock_required)}
              text="Required"
              onChange={(e) => handleRestockRequiredChange(e.target.checked)}
            />
          </div>

          <GeneralBtn
            text="SAVE CHANGES"
            type="button"
            className={styles.addBtn}
          />
        </form>
      </div>
    </div>
  );
}

export default EditProductPopup;
