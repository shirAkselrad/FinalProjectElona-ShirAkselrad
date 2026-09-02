import styles from "./userBtn.module.css";

import { FaUser } from "react-icons/fa";

function UserBtn({ onClick, className = "" }) {
  return (
    <button
      className={`${styles.userBtn} ${className}`}
      onClick={onClick}
      type="button"
    >
      <FaUser />
    </button>
  );
}

export default UserBtn;
