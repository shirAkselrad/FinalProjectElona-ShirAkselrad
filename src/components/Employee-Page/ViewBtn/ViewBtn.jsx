import styles from "./viewBtn.module.css";

function ViewBtn({ onClick }) {
  return (
    <button className={styles.view} onClick={onClick}>
      View
    </button>
  );
}

export default ViewBtn;
