import styles from "./productPrice.module.css";

function ProductPrice({ price, discount }) {
  const hasDiscount = Number(discount) > 0;

  const discountPrice = Number(price) * (1 - Number(discount) / 100);

  return (
    <div className={styles.container}>
      <p className={styles.label}>PRICE</p>

      <p className={hasDiscount ? styles.oldPrice : styles.price}>{price}₪</p>

      {hasDiscount && (
        <p className={styles.discountPrice}>{discountPrice.toFixed(2)}₪</p>
      )}
    </div>
  );
}

export default ProductPrice;
