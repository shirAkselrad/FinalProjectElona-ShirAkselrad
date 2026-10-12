import styles from "./productPopup.module.css";
import Remove from "../../../General/Remove/Remove";
import ProductDetails from "../ProductDetails/ProductDetails";
import ProductImagesGallery from "../../../General/ProductImagesGallery/ProductImagesGallery";
import { useState } from "react";
import QuantitySelector from "../../QuantitySelector/QuantitySelector";
import GeneralBtn from "../../../General/GeneralBtn/GeneralBtn";
function ProductPopup({ product, images, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState(1);

  //this function responsible of the plus action according the product's quantity
  function handleIncrease() {
    setQuantity((prev) => Math.min(prev + 1, Number(product.quantity)));
  }

  //this function responsible of the minus action (min 1)
  function handleDecrease() {
    setQuantity((prev) => Math.max(prev - 1, 1));
  }
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <Remove onClick={onClose} className={styles.closeBtn} />
        <div className={styles.content}>
          <ProductImagesGallery
            frontImg={images.find((img) => Number(img.file_number) === 1)}
            otherImgs={images.filter((img) => Number(img.file_number) !== 1)}
            editable={false}
          />
          <div className={styles.productInfo}>
            <ProductDetails product={product} />
            <div className={styles.purchaseSection}>
              <div className={styles.quantityRow}>
                <span className={styles.quantityLabel}>QUANTITY</span>

                <QuantitySelector
                  quantity={quantity}
                  onIncrease={handleIncrease}
                  onDecrease={handleDecrease}
                  maxQuantity={Number(product.quantity)}
                />
              </div>

              <GeneralBtn
                text="ADD TO CART"
                type="button"
                className={styles.addToCartBtn}
                disabled={Number(product.quantity) <= 0}
                onClick={() => onAddToCart(product, quantity)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProductPopup;
