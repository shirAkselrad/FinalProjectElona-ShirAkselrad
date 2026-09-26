import styles from "./productImagesPopup.module.css";
import ImagesPreviewList from "../../../General/ImagesPreviewList/ImagesPreviewList.jsx";
import GeneralBtn from "../../../General/GeneralBtn/GeneralBtn.jsx";
import Remove from "../../../General/Remove/Remove.jsx";
import { useState, useEffect } from "react";

function ProductImagesPopup({ product, onClose, onSave }) {
  const [images, setImages] = useState([]);
  const [unblockSave, setUnblockSave] = useState(false);

  //This function removes ONLY front frontend for now the images which has been clicked to be removed
  function handleOnRemove(index) {
    setImages(images.filter((image, i) => i !== index));
    setUnblockSave(true);
  }

  async function getProduct(product_id) {
    try {
      const response = await fetch(
        `/api/employee/getProductImages/${product_id}`,
        {
          method: "GET",
        },
      );

      const data = await response.json();
      if (data?.success) {
        console.log(data.files);
        setImages(data.files);
      }
    } catch (error) {
      console.error("error getting product: ", error);
    }
  }

  useEffect(() => {
    getProduct(product.product_id);
  }, [product.product_id]);
  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <Remove onClick={onClose} />

        <h2 className={styles.title}>PRODUCT IMAGES</h2>

        <ImagesPreviewList images={images} onRemove={handleOnRemove} />

        <div className={styles.save}>
          <GeneralBtn
            disabled={!unblockSave}
            onClick={async () => {
              const success = await onSave(product.product_id, images);
              if (success) onClose();
            }}
            text="SAVE"
          />
        </div>
      </div>
    </div>
  );
}

export default ProductImagesPopup;
