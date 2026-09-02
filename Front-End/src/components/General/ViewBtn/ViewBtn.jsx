import styles from "./viewBtn.module.css";
/**
 *
 * @param {onClick} onClick the even which happens when the user clicks the btn
 * @returns
 */
function ViewBtn({ onClick }) {
  return (
    <button className={styles.view} onClick={onClick}>
      View
    </button>
  );
}

export default ViewBtn;
