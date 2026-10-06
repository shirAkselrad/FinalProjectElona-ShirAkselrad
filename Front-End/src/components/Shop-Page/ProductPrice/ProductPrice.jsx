import styles from "./productPrice.module.css";

function ProductPrice({ price, discount }) {
    console.log("price:", price);
    console.log("discount:", discount);

  const hasDiscount = Number(discount) > 0;

  const discountPrice = Number(price) * (1 - Number(discount) / 100);

  return (
    <div className={styles.container}>
      <p>Price:</p>
      <p className={hasDiscount ? styles.oldPrice : styles.price}> ${price}</p>

      {hasDiscount && (
        <p className={styles.discountPrice}>${discountPrice.toFixed(2)}</p>
      )}
    </div>
  );
}

export default ProductPrice;
