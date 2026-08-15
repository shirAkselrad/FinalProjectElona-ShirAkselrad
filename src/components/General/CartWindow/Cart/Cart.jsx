import styles from "./cart.module.css";

import Amount from "../Amount/Amount.jsx";
import Line from "../CartLine/Line/Line.jsx"
import CartTotal from "../CartTotal/CartTotal.jsx";

import products from "../../../Shop-Page/proudcts.js";

function Cart() {
  const cartProducts = [
    {
      ...products[2],
      quantity: 2,
    },
  ];

  const total = cartProducts.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0,
  );

  return (
    <div className={styles.cart}>
      <Amount amount={cartProducts.length} />

      <div className={styles.products}>
        {cartProducts.map((product) => (
          <Line
            key={product.id}
            image={product.image}
            name={product.name}
            price={product.price}
            quantity={product.quantity}
          />
        ))}
      </div>

      <CartTotal total={total} />
    </div>
  );
}

export default Cart;
