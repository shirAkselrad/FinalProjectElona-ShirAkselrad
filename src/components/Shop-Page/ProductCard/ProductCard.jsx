import styles from "./productCard.module.css";

import ProductImg from "../ProductImg/ProductImg.jsx";
import DescriptionProduct from "../DescriptionProduct/DescriptionProduct.jsx";
import ProductPrice from "../ProductPrice/ProductPrice.jsx";
import Plus from "../Plus/Plus.jsx";

function ProductCard({ image, category, name, description, price }) {
  return (
    <div className={styles.productCard}>
      <ProductImg image={image} name={name} />

      <div className={styles.content}>
        <DescriptionProduct
          category={category}
          name={name}
          description={description}
        />

        <div className={styles.bottom}>
          <ProductPrice price={price} />

          <Plus />
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
