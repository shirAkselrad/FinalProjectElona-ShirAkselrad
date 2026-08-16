import styles from "./overViewItem.module.css";

function OverviewItem({ title, number, type }) {
  return (
    <div className={styles.item}>
      <p className={styles.title}>{title}</p>

      <p className={`${styles.number} ${styles[type]}`}>{number}</p>
    </div>
  );
}

export default OverviewItem;
