import styles from "./quantitySelector.module.css";
import Plus from "../Plus/Plus.jsx";
function QuantitySelector({ quantity, onIncrease, onDecrease, maxQuantity }) {
  return (
    <div className={styles.container}>
      <Plus type="minus" onClick={onDecrease} disabled={quantity <= 1} />
      <span className={styles.quantity}>{quantity}</span>
      <Plus
        type="plus"
        onClick={onIncrease}
        disabled={quantity >= maxQuantity}
      />
    </div>
  );
}
export default QuantitySelector;
