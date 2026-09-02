import styles from "./minusOrPlus.module.css";

function MinusOrPlus({ symbol, onClick }) {
  return (
    <button className={styles.minusOrPlus} onClick={onClick} type="button">
      {symbol}
    </button>
  );
}

export default MinusOrPlus;
