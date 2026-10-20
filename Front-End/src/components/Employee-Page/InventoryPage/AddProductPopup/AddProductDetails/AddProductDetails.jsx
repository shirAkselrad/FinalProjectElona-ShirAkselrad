import styles from "./addProductDetails.module.css";
import InputField from "../../../../General/InputField/InputField.jsx";
import InputLabel from "../../../../General/InputLabel/InputLabel.jsx";
import GeneralBtn from "../../../../General/GeneralBtn/GeneralBtn.jsx";
import CheckBoxField from "../../../../General/CheckBoxField/CheckBoxField.jsx";
import GeneralSelection from "../../../../General/GeneralSelection/GeneralSelection.jsx";
import DateInput from "../../../../General/DateInput/DateInput.jsx";
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
    handleProductMinSalesChange,
    handleProductMinStockChange,
    handleProductNameChange,
    handleProductPriceChange,
    handleProductQuantityChange,
    handleProductSizeChange,
    handleRestockRequiredChange,
    handleSalesCheckDateChange,
    checkInputDetailsValidation,
  } = useProductDetails(savedDetails);

  const selectedCategory = categories.find(
    (category) => category.name === details.category,
  );

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
                    onChange={(e) => {
                      handleProductCategoryChange(e.target.value);
                    }}
                  />

                  {selectedCategory?.types.length > 0 && (
                    <div>
                      <InputLabel text="Type" />
                      <GeneralSelection
                        value={details.type}
                        options={["None", ...selectedCategory.types]}
                        error={errors.type}
                        onChange={(e) =>
                          handleProductTypeChange(e.target.value)
                        }
                      />
                    </div>
                  )}
                </div>

                <div>
                  <InputLabel text="Country of Origin" />
                  <GeneralSelection
                    value={details.country_origin}
                    options={countries}
                    error={errors.country_origin}
                    onChange={(e) => {
                      handleProductCountryChange(e.target.value);
                    }}
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
                  onChange={(e) => {
                    handleProductCostPriceChange(e.target.value);
                  }}
                  onBlur={(e) => {
                    handleProductCostPriceChange(e.target.value);
                  }}
                />

                <InputField
                  label="Price"
                  value={details.price}
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
                    onChange={(e) => {
                      handleProductSizeChange(e.target.value);
                    }}
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

        <section className={styles.section}>
          <h3 className={styles.sectionTitle}>
            04 — Inventory & Sales Monitoring
          </h3>

          <div className={styles.inventoryGrid}>
            <InputField
              label="Minimum Sales"
              placeholder="0"
              type="number"
              value={details.min_sales}
              error={errors.min_sales}
              onChange={(e) => handleProductMinSalesChange(e.target.value)}
              onBlur={(e) => handleProductMinSalesChange(e.target.value)}
            />

            <div className={styles.dateField}>
              <DateInput
                label="Sales Check Date"
                value={details.sales_check_date}
                onChange={(e) => handleSalesCheckDateChange(e.target.value)}
                min={new Date().toISOString().split("T")[0]}
                error={errors.sales_check_date}
              />
            </div>
            <div className={styles.checkboxField}>
              <InputLabel text="Restock Reminder" />
              <CheckBoxField
                text="Required"
                checked={details.restock_required}
                onChange={(e) => handleRestockRequiredChange(e.target.checked)}
              />
            </div>

            <InputField
              label="Minimum Stock"
              value={details.min_stock}
              placeholder="0"
              type="number"
              error={errors.min_stock}
              onChange={(e) => handleProductMinStockChange(e.target.value)}
              onBlur={(e) => handleProductMinStockChange(e.target.value)}
            />
          </div>
        </section>

        <GeneralBtn
          text="NEXT"
          type="button"
          className={styles.addBtn}
          disabled={
            !checkInputDetailsValidation(
              (selectedCategory?.types.length ?? 0) > 0,
            )
          }
          onClick={() => onNext(details)}
        />
      </form>
    </div>
  );
}

export default AddProductDetails;
