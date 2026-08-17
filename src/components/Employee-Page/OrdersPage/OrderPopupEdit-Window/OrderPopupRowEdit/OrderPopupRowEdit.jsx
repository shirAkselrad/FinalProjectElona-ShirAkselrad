import styles from "./orderPopupRowEdit.module.css";

import EmptyInput from "../../../../General/EmptyInput/EmptyInput.jsx";
import BrightGeneralBtn from "../../../../General/BrightGeneralBtn/BrightGeneralBtn.jsx";

function OrderPopupRowEdit({ product, products, setProducts }) {
  const updateProduct = (field, value) => {
    const updatedProducts = products.map((item) =>
      item.id === product.id ? { ...item, [field]: value } : item,
    );

    setProducts(updatedProducts);
  };

  const toggleRemove = () => {
    updateProduct("removed", !product.removed);
  };

  return (
    <div className={`${styles.row} ${product.removed ? styles.removed : ""}`}>
      <EmptyInput
        value={product.name}
        onChange={(e) => updateProduct("name", e.target.value)}
      />

      <EmptyInput
        value={product.quantity}
        onChange={(e) => updateProduct("quantity", e.target.value)}
      />

      <EmptyInput
        value={product.price}
        onChange={(e) => updateProduct("price", e.target.value)}
      />

      <span className={styles.total}>
        ${Number(product.price) * Number(product.quantity)}
      </span>

      <BrightGeneralBtn
        text={product.removed ? "RESTORE" : "REMOVE"}
        onClick={toggleRemove}
      />
    </div>
  );
}

export default OrderPopupRowEdit;
