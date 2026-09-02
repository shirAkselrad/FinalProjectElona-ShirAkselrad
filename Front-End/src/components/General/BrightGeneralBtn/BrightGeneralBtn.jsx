import styles from "./brightGeneralBtn.module.css";

/**
 *
 * @param {text} text what will be written in the button
 * @param {onClick} onClick will operate the given function
 * @returns
 */
function BrightGeneralBtn({ text, onClick, type = "button" }) {
  return (
    <button className={styles.button} onClick={onClick} type={type}>
      {text}
    </button>
  );
}

export default BrightGeneralBtn;
