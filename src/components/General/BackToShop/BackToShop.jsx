import styles from "./BackToShop.module.css";

function BackToShop() {
  return (
    <button className={styles.backToShop}>
      <span className={styles.arrow}>←</span>
      <span>BACK TO SHOP</span>
    </button>
  );
}

export default BackToShop;
