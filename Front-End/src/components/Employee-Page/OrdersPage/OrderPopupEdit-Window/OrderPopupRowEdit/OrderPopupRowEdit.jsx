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
    //getting the field and value which changed
    const updatedProducts = products.map(
      (
        item, //finding the edited product
      ) => (item.id === product.id ? { ...item, [field]: value } : item), //updating the product with all the values and the updated value
    );

    setProducts(updatedProducts); // finally, setting all the changes
  };

  //changing the state of the product after the user decided to remove it
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
