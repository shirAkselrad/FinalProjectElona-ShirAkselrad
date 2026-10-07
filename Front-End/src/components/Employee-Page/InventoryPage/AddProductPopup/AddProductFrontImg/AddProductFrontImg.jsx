import styles from "./addProductFrontImg.module.css";
import ProductCard from "../../../../Shop-Page/ProductCard/ProductCard";
import GeneralBtn from "../../../../General/GeneralBtn/GeneralBtn";
import { useRef } from "react";
function AddProductFrontImg({
  product,
  productImgs,
  setProductImgs,
  onNext,
  onBack,
}) {
  //This ref gives access to the hidden file input
  const fileInputRef = useRef(null);

  //finding the front image between all the images in the productImgs array
  const frontImg = productImgs.find((image) => image.file_number === 1);

  //This function responsible to use Input while click on the empty image at the product card
  function handleImageClick() {
    fileInputRef.current.click();
  }

  //this function adds the chosen front image into the productImgs array and mark it by number 1
  function handleFrontImageChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    const newFrontImg = {
      file_name: file.name,
      file: file,
      file_number: 1,
    };

    setProductImgs((prev) => [
      //in case the user decided to change the front image picture, then promising there is only one image that set as 1 and the other gets removed
      ...prev.filter((image) => image.file_number !== 1),
      newFrontImg,
    ]);
  }
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Choose Front Image</h2>

      <div className={styles.productPreview}>
        <ProductCard
          product={product}
          image={frontImg}
          editable={true}
          onImageClick={handleImageClick}
        />
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept=".jpg,.jpeg,.png,.webp"
        hidden
        onChange={handleFrontImageChange}
      />

      <div className={styles.buttons}>
        <GeneralBtn text="BACK" onClick={onBack} />

        <GeneralBtn text="NEXT" onClick={onNext} disabled={!frontImg} />
      </div>
    </div>
  );
}
export default AddProductFrontImg;
