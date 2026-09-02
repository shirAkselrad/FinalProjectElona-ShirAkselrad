import styles from "./orderPopupTableEdit.module.css";

import OrderPopupRowEdit from "../OrderPopupRowEdit/OrderPopupRowEdit.jsx";
/**
 *
 * @param {products} products the products of the current order which are being edited
 * @param {setProducts} setProducts function that will save the changes of the edits ,which is passed to the orderPopupRowEdit component
 * @returns OrderPopupTableEdit
 */
function OrderPopupTableEdit({ products, setProducts }) {
  return (
    <div className={styles.table}>
      <div className={styles.header}>
        <span>PRODUCT</span>
        <span>QTY</span>
        <span>UNIT PRICE</span>
        <span>TOTAL</span>
        <span></span>
      </div>

      {/*building the rows of the edit table, gets the current product, all the products and the setProducts function which will save the changes of the products  */}
      {products.map((product) => (
        <OrderPopupRowEdit
          key={product.id}
          product={product}
          products={products}
          setProducts={setProducts}
        />
      ))}
    </div>
  );
}

export default OrderPopupTableEdit;
