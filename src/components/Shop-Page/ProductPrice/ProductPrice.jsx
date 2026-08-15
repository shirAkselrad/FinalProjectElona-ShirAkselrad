import styles from "./productPrice.module.css";

function ProductPrice({ price }) {
  return <p className={styles.price}>${price}</p>;
}

export default ProductPrice;
