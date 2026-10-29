import GeneralPromotionsRow from "../GeneralPromotionsRow/GeneralPromotionsRow.jsx";
import styles from "./generalPromotionsTable.module.css";

function GeneralPromotionsTable({ promotions, onActivate, onDeactivate }) {
  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>Promotion Name</th>
            <th>Discount</th>
            <th>Minimum Order</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {promotions.length === 0 ? (
            <tr>
              <td colSpan={7} className={styles.empty}>
                No promotions avaliable.
              </td>
            </tr>
          ) : (
            promotions.map((promotion, index) => (
              <GeneralPromotionsRow
                key={promotion.promotion_id}
                promotion={promotion}
                index={index}
                onActivate={onActivate}
                onDeactivate={onDeactivate}
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
export default GeneralPromotionsTable;
