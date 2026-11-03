import GeneralPromotionsRow from "../GeneralPromotionsRow/GeneralPromotionsRow.jsx";
import styles from "./generalPromotionsTable.module.css";

function GeneralPromotionsTable({
  promotions,
  onActivate,
  onDeactivate,
  readOnly = false,
  variant = "default",
}) {
  return (
    <div className={styles.tableContainer}>
      <table className={`${styles.table} ${variant==="overview"? styles.overview:""}`}>
        <thead>
          <tr>
            <th>PROMOTION NAME</th>
            <th>DISCOUNT</th>
            <th>MINIMUM ORDER</th>
            <th>START DATE</th>
            <th>END DATE</th>
            <th>STATUS</th>
            {!readOnly && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {promotions.length === 0 ? (
            <tr>
              <td colSpan={readOnly ? 6 : 7} className={styles.empty}>
                No promotions avaliable.
              </td>
            </tr>
          ) : (
            promotions.map((promotion) => (
              <GeneralPromotionsRow
                key={promotion.promotion_id}
                promotion={promotion}
                onActivate={onActivate}
                onDeactivate={onDeactivate}
                readOnly={readOnly}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
export default GeneralPromotionsTable;
