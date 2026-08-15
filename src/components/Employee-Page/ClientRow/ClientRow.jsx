import styles from "./clientRow.module.css";
import { FiEdit3 } from "react-icons/fi";

function ClientRow({ name, phone, address, email, role }) {
  return (
    <tr className={styles.row}>
      <td>{name}</td>
      <td>{phone}</td>
      <td>{address}</td>
      <td>{email}</td>
      <td>{role}</td>

      <td>
        <FiEdit3 />
      </td>
    </tr>
  );
}

export default ClientRow;
