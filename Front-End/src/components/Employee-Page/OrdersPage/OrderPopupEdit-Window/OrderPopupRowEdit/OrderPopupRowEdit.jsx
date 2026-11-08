import styles from "./orderPopupRowEdit.module.css";

import EmptyInput from "../../../../General/EmptyInput/EmptyInput.jsx";
import BrightGeneralBtn from "../../../../General/BrightGeneralBtn/BrightGeneralBtn.jsx";

function OrderPopupRowEdit({ product, products, setProducts }) {
  const updateProduct = (field, value) => {
    setProducts(
      products.map((item) =>
        item.order_item_id === product.order_item_id
          ? { ...item, [field]: value }
          : item,
      ),
    );
  };

  const handleQuantityChange = (e) => {
    const quantity = Number(e.target.value);

    if (
      !Number.isInteger(quantity) ||
      quantity < 0 ||
      quantity > Number(product.original_quantity)
    )
      return;

    updateProduct("quantity", quantity);
  };

  const toggleRemove = () => {
    updateProduct("removed", !product.removed);
  };

  const unitPrice = Number(product.sale_price);
  const total = unitPrice * Number(product.quantity);

  return (
    <div className={`${styles.row} ${product.removed ? styles.removed : ""}`}>
      <span>{product.product_name}</span>

      <EmptyInput value={product.quantity} onChange={handleQuantityChange} />

      <span>{unitPrice.toFixed(2)}₪</span>

      <span className={styles.total}>{total.toFixed(2)}₪</span>

      <BrightGeneralBtn
        text={product.removed ? "RESTORE" : "REMOVE"}
        onClick={toggleRemove}
      />
    </div>
  );
}

export default OrderPopupRowEdit;
