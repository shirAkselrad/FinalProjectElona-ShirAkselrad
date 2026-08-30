import styles from "./clientRow.module.css";

import EditBtn from "../../../General/EditBtn/EditBtn.jsx";
import BrightGeneralBtn from "../../../General/BrightGeneralBtn/BrightGeneralBtn.jsx";

/**
 *
 * @param {client, onEdit, onRemove} param0
 * @returns ClientRow
 */
function ClientRow({ client, onEdit, onRemove }) {
  /**
   * current client from the whole clients in the clients table
   * onEdit-the event which happens when the user clicks on the edit button in the current     client's row
   * onRemove-the event which happens when the user click on the remove button in the current client's row
   */
  return (
    <tr className={styles.row}>
      <td>{client.user_id}</td>
      <td>{client.first_name}</td>
      <td>{client.last_name}</td>
      <td>{client.phone_num}</td>
      <td>{client.city}</td>
      <td>{client.street}</td>
      <td>{client.house_num}</td>
      <td>{client.email}</td>
      <td>{client.status}</td>

      <td>
        <div className={styles.actions}>
          <EditBtn onClick={onEdit} className={styles.editBtn} />

          {/*While the user click on the remove btn the user has the option to "regrates" the removing action*/}
          <BrightGeneralBtn
            text={client.removed ? "RESTORE" : "REMOVE"}
            onClick={onRemove}
          />
        </div>
      </td>
    </tr>
  );
}

export default ClientRow;
