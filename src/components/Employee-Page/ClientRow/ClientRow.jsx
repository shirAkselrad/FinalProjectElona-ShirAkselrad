import styles from "./clientRow.module.css";

import EditBtn from "../../General/EditBtn/EditBtn.jsx";

function ClientRow({ name, phone, address, email, role }) {
  return (
    <tr className={styles.row}>
      <td>{name}</td>
      <td>{phone}</td>
      <td>{address}</td>
      <td>{email}</td>
      <td>{role}</td>

      <td>
        <EditBtn />
      </td>
    </tr>
  );
}

export default ClientRow;
