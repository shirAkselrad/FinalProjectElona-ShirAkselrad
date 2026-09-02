import styles from "./logout.module.css";
import { FiLogOut } from "react-icons/fi";
import { Link } from "react-router-dom";

function Logout({ out }) {
  return (
    <Link to="/" className={styles.logout} onClick={out}>
      <FiLogOut className={styles.icon} />
      <span>Logout</span>
    </Link>
  );
}

export default Logout;
