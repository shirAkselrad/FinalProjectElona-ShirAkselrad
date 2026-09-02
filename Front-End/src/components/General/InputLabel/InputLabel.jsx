import styles from "./inputLabel.module.css";
/**
 *
 * @param {text} text the text which will be display on the lable
 * @returns InputLabel
 */
function InputLabel({ text }) {
  return <label className={styles.label}>{text}</label>;
}

export default InputLabel;
