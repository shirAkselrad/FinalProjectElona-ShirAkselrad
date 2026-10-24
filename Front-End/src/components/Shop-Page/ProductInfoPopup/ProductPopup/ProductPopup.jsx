import styles from "./productPopup.module.css";
import Remove from "../../../General/Remove/Remove";
import ProductDetails from "../ProductDetails/ProductDetails";
import ProductImagesGallery from "../../../General/ProductImagesGallery/ProductImagesGallery";
import { useState } from "react";
import QuantitySelector from "../../QuantitySelector/QuantitySelector";
import GeneralBtn from "../../../General/GeneralBtn/GeneralBtn";
function ProductPopup({
  product,
  images,
  onClose,
  onAddToCart,
  previewMode = false,
}) {
  const isOutOfStock = Number(product.quantity) <= 0;
  const [quantity, setQuantity] = useState(1);

  //this function responsible of the plus action according the product's quantity
  function handleIncrease() {
    if (previewMode) return;
    setQuantity((prev) => Math.min(prev + 1, Number(product.quantity)));
  }

  //this function responsible of the minus action (min 1)
  function handleDecrease() {
    if (previewMode) return;
    setQuantity((prev) => Math.max(prev - 1, 1));
  }
  return (
    <div
      className={previewMode ? styles.previewWrapper : styles.overlay}
      onClick={previewMode ? undefined : onClose}
    >
      <div
        className={previewMode ? styles.previewPopup : styles.popup}
        onClick={(e) => e.stopPropagation()}
      >
        <Remove
          onClick={previewMode ? () => {} : onClose}
          className={styles.closeBtn}
        />
        <div className={styles.content}>
          <ProductImagesGallery
            frontImg={images.find((img) => Number(img.file_number) === 1)}
            otherImgs={images.filter((img) => Number(img.file_number) !== 1)}
            editable={false}
          />
          <div className={styles.productInfo}>
            <ProductDetails product={product} />
            {!isOutOfStock && (
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
                  onClick={() => {
                    if (!previewMode) onAddToCart?.(product, quantity);
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
export default ProductPopup;
