import styles from "./category.module.css";

function CategoryBtn({ text, active = false, onClick }) {
  return (
    <button
      className={`${styles.categoryBtn} ${active ? styles.active : ""}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default CategoryBtn;
