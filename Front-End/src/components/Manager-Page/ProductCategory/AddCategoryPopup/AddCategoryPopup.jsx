import { useState } from "react";
import styles from "./addCategoryPopup.module.css";
import Remove from "../../../General/Remove/Remove";
import GeneralBtn from "../../../General/GeneralBtn/GeneralBtn";
import InputField from "../../../General/InputField/InputField";
import CategoryTypesList from "../CategoryTypesList/CategoryTypesList";
import MessagePopup from "../../../General/MessagePopup/MessagePopup";
import { checkCategoryValidation } from "./categoryValidation";
import { onlyFirstLetterCapital } from "../../../../utils/inputValidation";

function AddCategoryPopup({ onClose, onRefreshCategories }) {
  const [messagePopup, setMessagePopup] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [name, setName] = useState(""); // new category name
  //saving category types
  const [types, setTypes] = useState([
    {
      name: "",
      min_sales: "",
      sales_check_days: "",
    },
  ]);
  const [nameTouched, setNamedTouched] = useState(false);

  //checking if all the inputs are valid and not empty
  const isFormValid = checkCategoryValidation(name, types);

  async function handleSave() {
    //form is not valid
    if (!isFormValid) return;
    //all the category data including category types
    const categoryData = {
      name: onlyFirstLetterCapital(name.trim()),
      types: types.map((type) => ({
        name: onlyFirstLetterCapital(type.name.trim()),
        min_sales: Number(type.min_sales),
        sales_check_days: Number(type.sales_check_days),
      })),
    };
    //saving in back end the new category and it's types
    try {
      const response = await fetch("/api/manager/addCategory", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(categoryData),
      });
      const data = await response.json();
      if (!response.ok) {
        setMessagePopup({
          show: true,
          message: data.message,
          type: "error",
        });
        return;
      }
      setMessagePopup({
        show: true,
        message: data.message || "Category added successfully",
        type: "success",
      });
    } catch (error) {
      console.error("Couldn't add category: ", error);
      setMessagePopup({
        show: true,
        message: "Couldn't add category",
        type: "error",
      });
    }
  }

  function handleCloseMessage() {
    const isSuccess = messagePopup.type === "success";
    setMessagePopup((prev) => ({ ...prev, show: false }));
    if (isSuccess) {
      onRefreshCategories?.();
      onClose();
    }
  }
  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.closeBtn}>
          <Remove onClick={onClose} />
        </div>

        <h2 className={styles.title}>Add Category</h2>

        <div className={styles.content}>
          <InputField
            label="Category Name"
            placeholder="Enter category name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            onBlur={() => setNamedTouched(true)}
            error={
              nameTouched && name.trim() === ""
                ? "Category name is required"
                : ""
            }
          />

          <CategoryTypesList types={types} onChange={setTypes} maxTypes={15} />
        </div>

        <div className={styles.footer}>
          <GeneralBtn
            text="SAVE"
            type="button"
            className={styles.saveBtn}
            disabled={!isFormValid}
            onClick={handleSave}
          />
        </div>
      </div>
      {messagePopup.show && (
        <MessagePopup
          message={messagePopup.message}
          type={messagePopup.type}
          onClose={handleCloseMessage}
        />
      )}
    </div>
  );
}

export default AddCategoryPopup;
