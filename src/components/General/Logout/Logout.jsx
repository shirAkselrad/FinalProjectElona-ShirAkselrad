import styles from "./logout.module.css";
import { FiLogOut } from "react-icons/fi";

function Logout() {
  return (
    <button className={styles.logout}>
      <FiLogOut className={styles.icon} />
      <span>Logout</span>
    </button>
  );
}

export default Logout;
