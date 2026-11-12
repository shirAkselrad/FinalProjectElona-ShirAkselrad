import styles from "./managementLegend.module.css";

function ManagementLegend({ items }) {
  return (
    <div className={styles.legend}>
      {items.map((item) => (
        <div
          key={item.label}
          className={`${styles.item} ${item.className || ""}`}
        >
          <span className={styles.dot} />
          <span>{item.label}</span>
          <strong>{item.count}</strong>
        </div>
      ))}
    </div>
  );
}

export default ManagementLegend;
