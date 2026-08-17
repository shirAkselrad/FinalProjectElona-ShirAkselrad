import styles from "./orderPopupTableEdit.module.css";

import OrderPopupRowEdit from "../OrderPopupRowEdit/OrderPopupRowEdit.jsx";

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
