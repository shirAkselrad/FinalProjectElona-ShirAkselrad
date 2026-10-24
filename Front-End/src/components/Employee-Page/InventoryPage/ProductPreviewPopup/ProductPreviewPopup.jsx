import styles from "./productPreviewPopup.module.css";
import ProductCard from "../../../Shop-Page/ProductCard/ProductCard";
import ProductPopup from "../../../Shop-Page/ProductInfoPopup/ProductPopup/ProductPopup";
import Remove from "../../../General/Remove/Remove";
import { useState, useEffect } from "react";
function ProductPreviewPopup({ product, onClose, isManager = false }) {
  const [images, setImages] = useState([]);

  useEffect(() => {
    async function getProductImages() {
      try {
        const url = isManager
          ? `/api/manager/getProductImages/${product.product_id}`
          : `/api/employee/getProductImages/${product.product_id}`;
        const response = await fetch(url, {
          method: "GET",
        });
        const data = await response.json();
        if (data?.success) setImages(data.files);
      } catch (error) {
        console.error("Error getting product images: ", error);
      }
    }
    getProductImages();
  }, [product.product_id, isManager]);
  const frontImg =
    images.find((img) => Number(img.file_number) === 1) ?? images[0];

  const previewProduct = {
    ...product,
    colors:
      typeof product.colors == "string"
        ? product.colors.split(",").map((color) => color.trim())
        : (product.colors ?? []),
  };
  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.popup} onClick={(e) => e.stopPropagation()}>
        <Remove onClick={onClose} className={styles.closeBtn} />
        <h2 className={styles.title}>PRODUCT PREVIEW</h2>
        {images.length > 0 && (
          <div className={styles.content}>
            <div className={styles.cardSection}>
              <h3>PRODUCT CARD</h3>
              <div className={styles.sectionFrame}>
                <ProductCard
                  product={previewProduct}
                  image={frontImg}
                  previewMode={true}
                />
              </div>
            </div>

            <div className={styles.detailsSection}>
              <h3>PRODUCT DETAILS</h3>
              <div className={styles.sectionFrame}>
                <ProductPopup
                  product={previewProduct}
                  images={images}
                  previewMode={true}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default ProductPreviewPopup;
