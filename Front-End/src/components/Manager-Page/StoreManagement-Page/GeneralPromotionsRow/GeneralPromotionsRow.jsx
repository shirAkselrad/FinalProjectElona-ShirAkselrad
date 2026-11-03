import GeneralBtn from "../../../General/GeneralBtn/GeneralBtn";
import styles from "./generalPromotionsRow.module.css";

function GeneralPromotionsRow({
  promotion,
  onActivate,
  onDeactivate,
  readOnly = false,
}) {
  const isActive = promotion.status === "Active";

  const now = new Date();
  const canActivate =
    new Date(promotion.start_date) <= now && new Date(promotion.end_date) > now;

  const formatDate = (date) =>
    new Date(date).toLocaleString("he-IL", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  return (
    <tr className={styles.row}>
      <td>{promotion.name}</td>
      <td>{promotion.discount_percentage}%</td>
      <td>₪{promotion.min_order_price}</td>
      <td>{formatDate(promotion.start_date)}</td>
      <td>{formatDate(promotion.end_date)}</td>

      <td>
        <span
          className={`${styles.status} ${
            isActive ? styles.active : styles.inactive
          }`}
        >
          {promotion.status}
        </span>
      </td>
      {!readOnly && (
        <td>
          <GeneralBtn
            className={styles.actionBtn}
            text={isActive ? "DEACTIVATE" : "ACTIVATE"}
            disabled={!isActive && !canActivate}
            onClick={() =>
              isActive
                ? onDeactivate(promotion.promotion_id)
                : onActivate(promotion.promotion_id)
            }
          />
        </td>
      )}
    </tr>
  );
}
export default GeneralPromotionsRow;
