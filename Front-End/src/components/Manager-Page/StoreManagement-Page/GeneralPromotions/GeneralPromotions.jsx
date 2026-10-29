import { useState, useEffect } from "react";
import styles from "./generalPromotions.module.css";
import InputField from "../../../General/InputField/InputField";
import GeneralBtn from "../../../General/GeneralBtn/GeneralBtn";
import { emptyPromotion, validatePromotion } from "./generalPromotions.js";
import GeneralPromotionsTable from "../GeneralPromotionsTable/GeneralPromotionsTable.jsx";
import CheckBoxField from "../../../General/CheckBoxField/CheckBoxField.jsx";
import MessagePopup from "../../../General/MessagePopup/MessagePopup.jsx";
function GeneralPromotions() {
  const [promotion, setPromotion] = useState({ ...emptyPromotion });
  const [promotions, setPromotions] = useState([]);
  const [errors, setErrors] = useState({});
  const [popup, setPopup] = useState(null);

  useEffect(() => {
    const getPromotions = async () => {
      try {
        const response = await fetch("/api/manager/getGeneralPromotions", {
          method: "GET",
        });
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.success) setPromotions(data.promotions);
        else
          setPopup({
            type: "error",
            message: "Couldn't load promotions.",
          });
      } catch (error) {
        console.error("Error getting promotions: ", error);
        setPopup({
          type: "error",
          message: "Couldn't load promotions.",
        });
      }
    };
    getPromotions();
  }, []);

  const handleChange = (field, value) => {
    setPromotion((prev) => ({
      ...prev,
      [field]: value,
    }));

    setErrors((prev) => ({
      ...prev,
      [field]: "",
    }));
  };

  const handleAdd = async () => {
    const validationErrors = validatePromotion(promotion, promotions);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    try {
      const response = await fetch("/api/manager/createPromotion", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...promotion,
          start_date: promotion.start_date.replace("T", " "),
          end_date: promotion.end_date.replace("T", " "),
        }),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (!data.success) throw new Error("Couldn't create promotion");
      setPromotions((prev) => [
        ...prev.map((item) => ({
          ...item,
          status: promotion.status === "Active" ? "Not Active" : item.status,
        })),
        { ...promotion, promotion_id: data.promotion_id },
      ]);
      setPromotion({ ...emptyPromotion });
      setErrors({});
      setPopup({
        type: "success",
        message: "Promotion created successfully!",
      });
    } catch (error) {
      console.error("Error creating promotion: ", error);
      setPopup({
        type: "error",
        message: "Couldn't create promotion.",
      });
    }
  };

  const handleActivate = async (index) => {
    const promotion_id = promotions[index].promotion_id;
    try {
      const response = await fetch("/api/manager/activatePromotion", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ promotion_id }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      if (!data.success) throw new Error("Couldn't activate promotion");
      setPromotions((prev) =>
        prev.map((item, i) => ({
          ...item,
          status: i === index ? "Active" : "Not Active",
        })),
      );
      setPopup({
        type: "success",
        message: "Promotion activated successfully!",
      });
    } catch (error) {
      console.error("Error activating promotion: ", error);
      setPopup({
        type: "error",
        message: "Couldn't activate promotion.",
      });
    }
  };

  const handleDeactivate = async (index) => {
    const promotion_id = promotions[index].promotion_id;
    try {
      const response = await fetch("/api/manager/deactivatePromotion", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ promotion_id }),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();

      if (!data.success) throw new Error("Couldn't deactivate promotion");

      setPromotions((prev) =>
        prev.map((item, i) =>
          i === index ? { ...item, status: "Not Active" } : item,
        ),
      );

      setPopup({
        type: "success",
        message: "Promotion deactivated successfully!",
      });
    } catch (error) {
      console.error("Error deactivating promotion: ", error);
      setPopup({
        type: "error",
        message: "Couldn't deactivate promotion.",
      });
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>General Promotions</h2>
        <p>Create and manage store-wide promotions.</p>
        <div className={styles.fields}>
          <InputField
            label="Promotion Name"
            placeholder="Enter promotion name"
            value={promotion.name}
            error={errors.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <InputField
            label="Discount Percentage (%)"
            type="number"
            step="1"
            error={errors.discount_percentage}
            value={promotion.discount_percentage}
            onChange={(e) =>
              handleChange("discount_percentage", e.target.value)
            }
          />

          <InputField
            label="Minimum Order Price (₪)"
            type="number"
            step="0.01"
            error={errors.min_order_price}
            value={promotion.min_order_price}
            onChange={(e) => handleChange("min_order_price", e.target.value)}
          />

          <InputField
            label="Start Date"
            type="datetime-local"
            value={promotion.start_date}
            error={errors.start_date}
            onChange={(e) => handleChange("start_date", e.target.value)}
          />

          <InputField
            label="End Date"
            type="datetime-local"
            value={promotion.end_date}
            error={errors.end_date}
            onChange={(e) => handleChange("end_date", e.target.value)}
          />

          <div className={styles.checkBox}>
            <CheckBoxField
              text="Activate promotion upon creation"
              checked={promotion.status === "Active"}
              onChange={(e) =>
                handleChange(
                  "status",
                  e.target.checked ? "Active" : "Not Active",
                )
              }
            />
          </div>
        </div>

        <div className={styles.actions}>
          <GeneralBtn text="CREATE PROMOTION" onClick={handleAdd} />
        </div>

        <div className={styles.list}>
          <h3>Existing Promotions</h3>
          <GeneralPromotionsTable
            promotions={promotions}
            onActivate={handleActivate}
            onDeactivate={handleDeactivate}
          />
        </div>
      </div>
      {popup && (
        <MessagePopup
          message={popup.message}
          type={popup.type}
          onClose={() => setPopup(null)}
          autoClose={popup.type === "success"}
        />
      )}
    </div>
  );
}
export default GeneralPromotions;
