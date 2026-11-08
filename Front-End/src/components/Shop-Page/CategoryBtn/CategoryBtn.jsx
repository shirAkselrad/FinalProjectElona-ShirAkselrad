import styles from "./category.module.css";

function CategoryBtn({ text, active = false, onClick, variant = "dark" }) {
  return (
    <button
      className={`${styles.categoryBtn} ${styles[variant]} ${
        active ? styles.active : ""
      }`}
      onClick={onClick}
    >
      {text}
    </button>
  );
}

export default CategoryBtn;
