import styles from "./removeProduct.module.css";

function RemoveProduct({ onClick }) {
  return (
    <button
      type="button"
      className={styles.removeProduct}
      onClick={onClick}
      aria-label="Remove product from cart"
    >
      ×
    </button>
  );
}

export default RemoveProduct;
