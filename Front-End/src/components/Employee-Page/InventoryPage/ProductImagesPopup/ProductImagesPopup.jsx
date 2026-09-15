import styles from "./productImagesPopup.module.css";
import ImagesPreviewList from "../../../General/ImagesPreviewList/ImagesPreviewList.jsx";
import GeneralBtn from "../../../General/GeneralBtn/GeneralBtn.jsx";
import Remove from "../../../General/Remove/Remove.jsx";

function ProductImagesPopup({ product, onClose }) {
  async function getProduct(product_id) {
    try {
      const response = await fetch(
        `/api/employee/getProductImages/${product_id}`,
        {
          method: "GET",
        },
      );

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("error getting product: ", error);
    }
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <Remove onClick={onClose} />

        <h2 className={styles.title}>PRODUCT IMAGES</h2>

        <ImagesPreviewList images={getProduct(product.product_id)} onRemove={() => {}} />

        <div className={styles.save}>
          <GeneralBtn text="SAVE" />
        </div>
      </div>
    </div>
  );
}

export default ProductImagesPopup;
