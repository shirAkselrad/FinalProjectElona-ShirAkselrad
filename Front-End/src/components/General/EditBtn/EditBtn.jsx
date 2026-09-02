import styles from "./editBtn.module.css";

import { FiEdit3 } from "react-icons/fi";
/**
 *
 * @param {onClick} onClick oprate the event algoritem
 * @returns
 */
function EditBtn({ onClick, className = "" }) {
  return (
    <button
      className={`${styles.edit} ${className}`}
      onClick={onClick}
      type="button"
    >
      <FiEdit3 />
    </button>
  );
}

export default EditBtn;
