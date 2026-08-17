import styles from "./brightGeneralBtn.module.css";

function BrightGeneralBtn({ text, onClick, type = "button" }) {
  return (
    <button className={styles.button} onClick={onClick} type={type}>
      {text}
    </button>
  );
}

export default BrightGeneralBtn;
