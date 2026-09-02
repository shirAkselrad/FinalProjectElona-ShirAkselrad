import styles from "./clientRow.module.css";

import EditBtn from "../../../General/EditBtn/EditBtn.jsx";
import BrightGeneralBtn from "../../../General/BrightGeneralBtn/BrightGeneralBtn.jsx";
import MessagePopup from "../../../General/MessagePopup/MessagePopup.jsx";
import { useState } from "react";

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

  const [displayMesssagePopup, setDisplayMessagePopup] = useState({
    show: false,
    message: "",
    type: "",
  });

  //The function send the new status to backend
  async function updateClientStatus(clientData) {
    try {
      const response = await fetch("/api/employee/changeStatus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(clientData),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("error updating client's details: ", error);
    }
  }

  //The function check if the form is valid if it does, call the createUser function
  async function changeStatus() {
    const newStatus = client.status === "Active" ? "Not Active" : "Active";
    const userData = {
      email: client.email,
      status: newStatus,
    };
    const data = await updateClientStatus(userData);
    if (data?.success) {
      onRemove({
        ...client,
        status: newStatus,
      });
    } else {
      setDisplayMessagePopup({
        show: true,
        message: data?.message,
        type: "error",
      });
    }
  }

  return (
    <tr
      className={`${styles.row} ${
        client.status === "Not Active" ? styles.removedRow : ""
      }`}
    >
      <td>{client.first_name}</td>
      <td>{client.last_name}</td>
      <td>{client.phone_num}</td>
      <td>{client.city}</td>
      <td>{client.street}</td>
      <td>{client.house_num}</td>
      <td>{client.email}</td>

      <td>
        <div className={styles.actions}>
          <EditBtn onClick={onEdit} className={styles.editBtn} />

          {/*While the user click on the remove btn the user has the option to "regrates" the removing action*/}
          <BrightGeneralBtn
            text={client.status === "Active" ? "REMOVE" : "RESTORE"}
            onClick={changeStatus}
          />
        </div>
        {displayMesssagePopup.show && (
          <MessagePopup
            message={displayMesssagePopup.message}
            type={displayMesssagePopup.type}
            onClose={() =>
              setDisplayMessagePopup({
                show: false,
                message: "",
                type: "",
              })
            }
          />
        )}
      </td>
    </tr>
  );
}

export default ClientRow;
