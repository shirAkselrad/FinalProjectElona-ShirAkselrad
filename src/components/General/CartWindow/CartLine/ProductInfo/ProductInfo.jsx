import styles from "./productInfo.module.css";

import ProductPrice from "../../../../Shop-Page/ProductPrice/ProductPrice";

function ProductInfo({ image, name, price }) {
  return (
    <div className={styles.productInfo}>
      <img src={image} alt={name} className={styles.image} />

      <div className={styles.details}>
        <h3 className={styles.name}>{name}</h3>

        <ProductPrice price={price} />
      </div>
    </div>
  );
}

export default ProductInfo;
