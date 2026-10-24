import styles from "./orderPopupRowEdit.module.css";

import EmptyInput from "../../../../General/EmptyInput/EmptyInput.jsx";
import BrightGeneralBtn from "../../../../General/BrightGeneralBtn/BrightGeneralBtn.jsx";

/**
 *
 * @param {product} product the current product which is being edited
 * @param {products} products the whole products array in the current order
 * @param {setProducts} setProducts function which will save the changes of the current product
 * @returns OrderPopupRowEdit
 */
function OrderPopupRowEdit({ product, products, setProducts }) {
  //The function update the current product which have been edited in the products array

  const updateProduct = (field, value) => {
    const updatedProducts = products.map((item) =>
      item.product_id === product.product_id
        ? { ...item, [field]: value }
        : item,
    );
    setProducts(updatedProducts);
  };

  //changing the state of the product after the user decided to remove it
  const toggleRemove = () => {
    updateProduct("removed", !product.removed);
  };

  return (
    <div className={`${styles.row} ${product.removed ? styles.removed : ""}`}>
      <span>{product.product_name}</span>

      <EmptyInput
        value={product.quantity}
        onChange={(e) => {
          updateProduct("quantity", e.target.value);
          if (Number.isInteger(quantity) && quantity > 0)
            updateProduct("quantity", quantity);
        }}
      />
      <span>${Number(product.product_price).toFixed(2)}</span>

      <span className={styles.total}>
        ${Number(product.product_price) * Number(product.quantity)}
      </span>

      <BrightGeneralBtn
        text={product.removed ? "RESTORE" : "REMOVE"}
        onClick={toggleRemove}
      />
    </div>
  );
}

export default OrderPopupRowEdit;
