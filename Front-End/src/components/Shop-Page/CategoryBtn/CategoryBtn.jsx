import styles from "./category.module.css";

function CategoryBtn({ text, active = false }) {
  return (
    <button className={`${styles.categoryBtn} ${active ? styles.active : ""}`}>
      {text}
    </button>
  );
}

export default CategoryBtn;
