import GeneralBtn from "../../../General/GeneralBtn/GeneralBtn";
import styles from "./generalPromotionsRow.module.css";

function GeneralPromotionsRow({ promotion, index, onActivate, onDeactivate }) {
  const isActive = promotion.status === "Active";
  return (
    <tr>
      <td>{promotion.name}</td>
      <td>{promotion.discount_percentage}%</td>
      <td>₪{promotion.min_order_price}</td>
      <td>{new Date(promotion.start_date).toLocaleString("he-IL")}</td>
      <td>{new Date(promotion.end_date).toLocaleString("he-IL")}</td>

      <td>
        <span
          className={`${styles.status} ${
            isActive ? styles.active : styles.inactive
          }`}
        >
          {promotion.status}
        </span>
      </td>

      <td>
        <GeneralBtn
          text={isActive ? "DEACTIVATE" : "ACTIVATE"}
          onClick={() => (isActive ? onDeactivate(index) : onActivate(index))}
        />
      </td>
    </tr>
  );
}
export default GeneralPromotionsRow; 