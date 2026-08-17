import styles from "./clientRow.module.css";

import EditBtn from "../../../General/EditBtn/EditBtn.jsx";

function ClientRow({ client }) {
  return (
    <tr className={styles.row}>
      <td>{client.name}</td>
      <td>{client.phone}</td>
      <td>{client.address}</td>
      <td>{client.email}</td>
      <td>{client.role}</td>

      <td>
        <EditBtn />
      </td>
    </tr>
  );
}

export default ClientRow;
