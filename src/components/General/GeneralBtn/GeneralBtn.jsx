import styles from "./generalBtn.module.css";

function GeneralBtn({ text, onClick, className = "" }) {
  return (
    <button className={`${styles.button} ${className}`} onClick={onClick}>
      {text}
    </button>
  );
}

export default GeneralBtn;
