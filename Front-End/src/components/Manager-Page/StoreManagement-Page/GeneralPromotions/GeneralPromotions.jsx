import { useState, useEffect } from "react";
import styles from "./generalPromotions.module.css";
import InputField from "../../../General/InputField/InputField";
import GeneralBtn from "../../../General/GeneralBtn/GeneralBtn";
import { emptyPromotion, validatePromotion } from "./generalPromotions.js";
import GeneralPromotionsTable from "../GeneralPromotionsTable/GeneralPromotionsTable.jsx";
import MessagePopup from "../../../General/MessagePopup/MessagePopup.jsx";
import DateTimePicker from "../../../General/DateTimePicker/DateTimePicker.jsx";
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
        ...prev,
        {
          ...promotion,
          status: "Not Active",
          promotion_id: data.promotion_id,
        },
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

  const handleActivate = async (promotion_id) => {
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
        prev.map((item) => ({
          ...item,
          status: item.promotion_id === promotion_id ? "Active" : "Not Active",
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

  const handleDeactivate = async (promotion_id) => {
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
        prev.map((item) =>
          item.promotion_id === promotion_id
            ? { ...item, status: "Not Active" }
            : item,
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

  const now = new Date();
  const localNow = new Date(now.getTime() - now.getTimezoneOffset() * 60000)
    .toISOString()
    .slice(0, 16);
  const isFormValid =
    Object.keys(validatePromotion(promotion, promotions)).length == 0;

  const currentPromotions = promotions.filter(
    (item) => new Date(item.end_date) >= new Date(),
  );
  const promotionHistory = promotions.filter(
    (item) => new Date(item.end_date) < new Date(),
  );
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
            min="1"
            max="100"
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
            min="0"
            error={errors.min_order_price}
            value={promotion.min_order_price}
            onChange={(e) => handleChange("min_order_price", e.target.value)}
          />

          <DateTimePicker
            label="Start Date"
            value={promotion.start_date}
            onChange={(value) => handleChange("start_date", value)}
            minDate={new Date()}
            maxDate={promotion.end_date || undefined}
            error={errors.start_date}
          />

          <DateTimePicker
            label="End Date"
            value={promotion.end_date}
            onChange={(value) => handleChange("end_date", value)}
            minDate={
              promotion.start_date &&
              new Date(promotion.start_date) > new Date()
                ? promotion.start_date
                : new Date()
            }
            error={errors.end_date}
          />
        </div>

        <div className={styles.actions}>
          <GeneralBtn
            text="CREATE PROMOTION"
            onClick={handleAdd}
            disabled={!isFormValid}
          />
        </div>

        <div className={styles.list}>
          <h3>Current & Upcoming Promotions</h3>
          <div className={styles.promotionNote}>
            <strong>Important Notes:</strong>
            <ul>
              <li>Only one promotion can be active at a time.</li>
              <li>
                Promotions can only be activated or deactivated during their
                date range.
              </li>
              <li>
                Promotions do not start automatically. Click ACTIVATE to enable
                a promotion.
              </li>
            </ul>
          </div>
          <GeneralPromotionsTable
            promotions={currentPromotions}
            onActivate={handleActivate}
            onDeactivate={handleDeactivate}
          />

          <h3>Promotions History</h3>
          <GeneralPromotionsTable
            promotions={promotionHistory}
            readOnly={true}
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
