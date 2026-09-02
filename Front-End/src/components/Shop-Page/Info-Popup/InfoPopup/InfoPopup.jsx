import styles from "./infoPopup.module.css";

import Remove from "../../../General/CartWindow/CartLine/Remove/Remove.jsx";
import ProductTitle from "../ProductTitle/ProductTitle.jsx";
import Description from "../Description/Description.jsx";
import ProductPrice from "../../ProductPrice/ProductPrice.jsx";
import Plus from "../../Plus/Plus.jsx";

function InfoPopup({ product, onClose }) {
  if (!product) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.infoPopup}>
        <div className={styles.imageSide}>
          <img
            src={product.image}
            alt={product.name}
            className={styles.image}
          />
        </div>

        <div className={styles.contentSide}>
          <div className={styles.close}>
            <Remove onClick={onClose} />
          </div>

          <ProductTitle
            category={product.category}
            name={product.name}
            description={product.description}
          />

          <Description text={product.details} materials={product.materials} />

          <div className={styles.bottom}>
            <ProductPrice price={product.price} />

            <Plus />
          </div>
        </div>
      </div>
    </div>
  );
}

export default InfoPopup;
