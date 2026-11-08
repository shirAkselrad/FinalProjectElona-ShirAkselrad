import { useState } from "react";
import GeneralBtn from "../../../../General/GeneralBtn/GeneralBtn.jsx";
import MessagePopup from "../../../../General/MessagePopup/MessagePopup";
import styles from "./addCategoryTypeRow.module.css";
import InputField from "../../../../General/InputField/InputField";
import { validationCategoryType } from "./categoryTypeValidation";
function AddCategoryTypeRow({ categoryId, onCancel, onSaved }) {
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "",
  });
  const [type, setType] = useState({
    name: "",
    min_sales: "",
    sales_check_days: "",
  });

  const errors = validationCategoryType(type);
  const isFormValid = Object.keys(errors).length === 0;

  const handleSave = async () => {
    if (!isFormValid) return;
    try {
      const response = await fetch("/api/manager/addCategoryType", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category_id: categoryId,
          name: type.name.trim(),
          min_sales: Number(type.min_sales),
          sales_check_days: Number(type.sales_check_days),
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        setPopup({
          show: true,
          message: data.message || "Couldn't add category type",
          type: "error",
        });
        return;
      }
      setPopup({
        show: true,
        message: "Category type added successfully",
        type: "success",
      });
    } catch (error) {
      setPopup({
        show: true,
        message: "Couldn't add category type",
        type: "error",
      });
    }
  };
  return (
    <div className={styles.row}>
      <InputField
        placeholder="Type Name"
        value={type.name}
        onChange={(e) => {
          setType({ ...type, name: e.target.value });
        }}
        error={type.name !== "" ? errors.name : ""}
        maxLength={50}
      />
      <InputField
        placeholder="Min Sales"
        type="number"
        min={0}
        step={1}
        value={type.min_sales}
        onChange={(e) => {
          setType({ ...type, min_sales: e.target.value });
        }}
        error={type.min_sales !== "" ? errors.min_sales : ""}
      />
      <InputField
        placeholder="Check Days"
        type="number"
        min={1}
        step={1}
        value={type.sales_check_days}
        onChange={(e) => {
          setType({ ...type, sales_check_days: e.target.value });
        }}
        error={type.sales_check_days !== "" ? errors.min_sales : ""}
      />
      <div className={styles.actions}>
        <GeneralBtn
          text="SAVE"
          type="button"
          onClick={handleSave}
          disabled={!isFormValid}
        />
        <GeneralBtn
          text="CANCEL"
          type="button"
          onClick={onCancel}
          className={styles.cancelBtn}
        />
      </div>
      {popup.show && (
        <MessagePopup
          message={popup.message}
          type={popup.type}
          autoClose={popup.type === "success"}
          onClose={() => {
            const success = popup.type === "success";

            setPopup({
              show: false,
              message: "",
              type: "",
            });

            if (success) onSaved();
          }}
        />
      )}
    </div>
  );
}
export default AddCategoryTypeRow;
