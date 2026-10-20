import styles from "./removeInputBtn.module.css";
import { FiTrash2 } from "react-icons/fi";

function RemoveInputBtn({ onClick, disabled = false }) {
  return (
    <button
      type="button"
      className={styles.removeBtn}
      onClick={onClick}
      disabled={disabled}
      aria-label="Remove input"
    >
      <FiTrash2 size={18} />
    </button>
  );
}
export default RemoveInputBtn;
