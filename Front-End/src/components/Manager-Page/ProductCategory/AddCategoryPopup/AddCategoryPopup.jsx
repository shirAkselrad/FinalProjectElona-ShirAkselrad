import { useState } from "react";
import styles from "./addCategoryPopup.module.css";
import Remove from "../../../General/Remove/Remove";
import GeneralBtn from "../../../General/GeneralBtn/GeneralBtn";
import InputField from "../../../General/InputField/InputField";
import DynamicInputsList from "../../../General/DynamicInputsList/DynamicInputsList";
import MessagePopup from "../../../General/MessagePopup/MessagePopup";
import { checkCategoryValidation } from "./categoryValidation";
import { onlyFirstLetterCapital } from "../../../../utils/inputValidation";

function AddCategoryPopup({ onClose }) {
  const [messagePopup, setMessagePopup] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [name, setName] = useState("");
  const [types, setTypes] = useState([""]);
  const [nameTouched, setNamedTouched] = useState(false);
  const isFormValid = checkCategoryValidation(name, types);

  async function handleSave() {
    if (!isFormValid) return;
const categoryData = {
  name: onlyFirstLetterCapital(name.trim()),
  types: types
    .map((type) => type.trim())
    .filter((type) => type !== "")
    .map((type) => onlyFirstLetterCapital(type)),
};
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
    if (isSuccess) onClose();
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

          <DynamicInputsList
            values={types}
            onChange={setTypes}
            label="Types"
            placeholder="Enter type"
            addBtnText="+ Add Type"
            maxInputs={15}
          />
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
