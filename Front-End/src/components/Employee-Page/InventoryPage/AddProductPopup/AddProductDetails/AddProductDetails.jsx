import styles from "./addProductDetails.module.css";
import InputField from "../../../../General/InputField/InputField.jsx";
import InputLabel from "../../../../General/InputLabel/InputLabel.jsx";
import GeneralBtn from "../../../../General/GeneralBtn/GeneralBtn.jsx";
import CheckBoxField from "../../../../General/CheckBoxField/CheckBoxField.jsx";
import GeneralSelection from "../../../../General/GeneralSelection/GeneralSelection.jsx";
import TextAreaField from "../../../../General/TextAreaField/TextAreaField.jsx";
import ColorsCheckBoxList from "../../../../General/Colors/ColorsCheckBoxList/ColorsCheckBoxList.jsx";
import { ProductSize } from "../../../../../Enums/products.js";
import { countries } from "../../../../../data/countries.js";
import { colors } from "../../../../../data/colors.js";
import { useEffect, useState } from "react";
import useProductDetails from "./useProductDetails.js";

function AddProductDetails({ savedDetails, onNext }) {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function getCategories() {
      try {
        const response = await fetch("/api/employee/categories", {
          method: "GET",
        });

        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);

        const data = await response.json();
        console.log("Categories from DB:", data.categories);
        setCategories(data.categories);
      } catch (error) {
        console.error("Couldn't get categories: ", error);
      }
    }

    getCategories();
  }, []);

  const {
    details,
    errors,
    handleColorsChange,
    handleProductCategoryChange,
    handleProductTypeChange,
    handleProductCostPriceChange,
    handleProductCountryChange,
    handleProductDescriptionChange,
    handleProductDiscountChange,
    handleProductIdChange,
    handleProductMinStockChange,
    handleProductNameChange,
    handleProductPriceChange,
    handleProductQuantityChange,
    handleProductSizeChange,
    handleRestockRequiredChange,
    checkInputDetailsValidation,
  } = useProductDetails(savedDetails);

  const selectedCategory = categories.find(
    (category) => category.name === details.category,
  );

  const selectedType = selectedCategory?.types.find(
    (type) => type.name === details.type,
  );

  const minSales = selectedType
    ? details.quantity === ""
      ? selectedType.min_sales
      : Math.min(selectedType.min_sales, Number(details.quantity))
    : "";

  const salesCheckDate = selectedType
    ? (() => {
        const date = new Date();
        date.setDate(date.getDate() + Number(selectedType.sales_check_days));

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");

        return `${day}-${month}-${year}`;
      })()
    : "";

  return (
    <div className={styles.container}>
      <h2>Add Product</h2>

      <form className={styles.form}>
        <div className={styles.sections}>
          <div className={styles.column}>
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>01 — Basic Information</h3>

              <div className={styles.sectionFields}>
                <InputField
                  value={details.name}
                  label="Product Name"
                  placeholder="Enter product name"
                  error={errors.name}
                  onChange={(e) => handleProductNameChange(e.target.value)}
                  onBlur={(e) => handleProductNameChange(e.target.value)}
                />

                <InputField
                  label="Product ID"
                  value={details.product_id}
                  placeholder="Enter product ID"
                  error={errors.product_id}
                  onChange={(e) => handleProductIdChange(e.target.value)}
                  onBlur={(e) => handleProductIdChange(e.target.value)}
                />

                <div>
                  <InputLabel text="Category" />
                  <GeneralSelection
                    value={details.category}
                    options={[
                      "None",
                      ...categories.map((category) => category.name),
                    ]}
                    error={errors.category}
                    onChange={(e) =>
                      handleProductCategoryChange(e.target.value)
                    }
                  />

                  <div>
                    <InputLabel text="Type" />
                    <GeneralSelection
                      value={details.type}
                      options={[
                        "None",
                        ...(selectedCategory?.types ?? []).map((t) => t.name),
                      ]}
                      error={errors.type}
                      disabled={!selectedCategory}
                      onChange={(e) => handleProductTypeChange(e.target.value)}
                    />
                  </div>
                </div>

                <div>
                  <InputLabel text="Country of Origin" />
                  <GeneralSelection
                    value={details.country_origin}
                    options={countries}
                    error={errors.country_origin}
                    onChange={(e) => handleProductCountryChange(e.target.value)}
                  />
                </div>
              </div>
            </section>

            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>03 — Pricing & Quantity</h3>

              <div className={styles.pricingGrid}>
                <InputField
                  label="Cost Price"
                  value={details.cost_price}
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  error={errors.cost_price}
                  onChange={(e) => handleProductCostPriceChange(e.target.value)}
                  onBlur={(e) => handleProductCostPriceChange(e.target.value)}
                />

                <InputField
                  label="Price"
                  value={details.price}
                  placeholder="0.00"
                  type="number"
                  step="0.01"
                  error={errors.price}
                  onChange={(e) => handleProductPriceChange(e.target.value)}
                  onBlur={(e) => handleProductPriceChange(e.target.value)}
                />

                <InputField
                  label="Discount (Precents)"
                  value={details.discount}
                  placeholder="0"
                  type="number"
                  error={errors.discount}
                  onChange={(e) => handleProductDiscountChange(e.target.value)}
                  onBlur={(e) => handleProductDiscountChange(e.target.value)}
                />

                <InputField
                  label="Quantity"
                  value={details.quantity}
                  placeholder="0"
                  type="number"
                  error={errors.quantity}
                  onChange={(e) => handleProductQuantityChange(e.target.value)}
                  onBlur={(e) => handleProductQuantityChange(e.target.value)}
                />
              </div>
            </section>
          </div>

          <div className={styles.column}>
            <section className={styles.section}>
              <h3 className={styles.sectionTitle}>
                02 — Product Characteristics
              </h3>

              <div className={styles.sectionFields}>
                <div>
                  <InputLabel text="Size" />
                  <GeneralSelection
                    value={details.size}
                    options={Object.values(ProductSize)}
                    error={errors.size}
                    onChange={(e) => handleProductSizeChange(e.target.value)}
                  />
                </div>

                <div>
                  <InputLabel text="Product's colors" />
                  <ColorsCheckBoxList
                    colors={colors}
                    selectedColors={details.colors}
                    onChange={handleColorsChange}
                    error={errors.colors}
                  />
                </div>

                <div className={styles.description}>
                  <TextAreaField
                    label="Description"
                    placeholder="Enter product description"
                    value={details.description}
                    onChange={(e) =>
                      handleProductDescriptionChange(e.target.value)
                    }
                    maxLength={250}
                    error={errors.description}
                  />
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Sales monitoring and restock settings */}
        <div className={styles.monitoringSections}>
          <section className={`${styles.section} ${styles.salesSection}`}>
            <h3 className={styles.sectionTitle}>04 — Sales Monitoring</h3>

            <p className={styles.salesDescription}>
              Sales targets are automatically calculated based on the selected
              product type.
            </p>

            <div className={styles.sectionFields}>
              <InputField
                label="Minimum Sales"
                placeholder="Automatically calculated"
                type="text"
                value={minSales}
                disabled
              />

              <InputField
                label="Sales Check Date"
                placeholder="Automatically calculated"
                type="text"
                value={salesCheckDate}
                disabled
              />
            </div>
          </section>

          <section className={styles.section}>
            <h3 className={styles.sectionTitle}>05 — Restock Settings</h3>

            <div className={styles.restockSection}>
              <div className={styles.checkboxField}>
                <InputLabel text="Restock Reminder" />
                <CheckBoxField
                  text="Required"
                  checked={details.restock_required}
                  onChange={(e) =>
                    handleRestockRequiredChange(e.target.checked)
                  }
                />
              </div>

              <div
                className={`${styles.minStockField} ${
                  !details.restock_required ? styles.hiddenField : ""
                }`}
              >
                <InputField
                  label="Minimum Stock"
                  value={details.min_stock}
                  placeholder="0"
                  type="number"
                  error={
                    details.restock_required ? errors.min_stock : undefined
                  }
                  onChange={(e) => handleProductMinStockChange(e.target.value)}
                  onBlur={(e) => handleProductMinStockChange(e.target.value)}
                />
              </div>
            </div>
          </section>
        </div>

        <GeneralBtn
          text="NEXT"
          type="button"
          className={styles.addBtn}
          disabled={!checkInputDetailsValidation()}
          onClick={() =>
            onNext({
              ...details,
              min_sales: minSales,
              sales_check_date: salesCheckDate,
            })
          }
        />
      </form>
    </div>
  );
}

export default AddProductDetails;
