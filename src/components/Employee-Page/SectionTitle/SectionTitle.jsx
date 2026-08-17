import styles from "./sectionTitle.module.css";


function SectionTitle({ title }) {
  return (
    <div className={styles.sectionTitle}>
      <h1 className={styles.title}>{title}</h1>
    </div>
  );
}

export default SectionTitle;
