import styles from "./generalBtn.module.css";

function GeneralBtn({ text, onClick, className = "", type, disabled }) {
  return (
    <button
      type={type}
      className={`${styles.button} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
}

export default GeneralBtn;
