import styles from "./line.module.css";

import ProductInfo from "../ProductInfo/ProductInfo.jsx";
import Plus from "../../../Plus/Plus.jsx";
import RemoveProduct from "../../RemoveProduct/RemoveProduct.jsx";

function Line({
  product_id,
  image,
  name,
  price,
  quantity,
  onQuantityChange,
  onRemoveProduct,
}) {
  return (
    <div className={styles.line}>
      <div className={styles.product}>
        <ProductInfo image={image} name={name} price={price} />

        <div className={styles.quantity}>
          <Plus
            type="minus"
            disabled={quantity <= 1}
            onClick={() => onQuantityChange(product_id, quantity - 1)}
          />

          <span className={styles.number}>{quantity}</span>

          <Plus
            type="plus"
            onClick={() => onQuantityChange(product_id, quantity + 1)}
          />
        </div>
      </div>

      <RemoveProduct onClick={() => onRemoveProduct(product_id)} />
    </div>
  );
}

export default Line;
