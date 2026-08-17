import styles from "./line.module.css";

import ProductInfo from "../ProductInfo/ProductInfo.jsx";
import MinusOrPlus from "../MinusOrPlus/MinusOrPlus.jsx";
import Remove from "../../../../General/Remove/Remove.jsx";

function Line({ image, name, price, quantity }) {
  return (
    <div className={styles.line}>
      <div className={styles.product}>
        <ProductInfo image={image} name={name} price={price} />

        <div className={styles.quantity}>
          <MinusOrPlus symbol="-" />

          <span className={styles.number}>{quantity}</span>

          <MinusOrPlus symbol="+" />
        </div>
      </div>

      <Remove />
    </div>
  );
}

export default Line;
