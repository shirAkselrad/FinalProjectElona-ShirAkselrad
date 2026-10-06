import styles from "./addProductImages.module.css";
import GeneralBtn from "../../../../General/GeneralBtn/GeneralBtn.jsx";
import ProductImagesGallery from "../../../../General/ProductImagesGallery/ProductImagesGallery.jsx";
import ProductDetails from "../../../../Shop-Page/ProductInfoPopup/ProductDetails/ProductDetails.jsx";
import MessagePopup from "../../../../General/MessagePopup/MessagePopup.jsx";
import { useState } from "react";
function AddProductImages({
  product,
  productImgs,
  setProductImgs,
  onReorder,
  onBack,
  onClose,
  onProductAdded,
}) {
  const [popup, setPopup] = useState({
    show: false,
    message: "",
    type: "",
  });
  const frontImg = productImgs.find((image) => image.number == 1);
  const otherImgs = productImgs.filter((image) => image.number !== 1);

  //this function update the productImgs array while adding Images
  function handleImagesChange(e) {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => ({
      file_name: file.name,
      file: file,
    }));
    setProductImgs((prev) => [...prev, ...newImages]);
  }

  //this function removes unwanted product's image
  function handleRemoveImage(indexToRemove) {
    setProductImgs((prev) => {
      const frontImg = prev.find((image) => image.number == 1);
      const otherImgs = prev.filter((image) => image.number !== 1);
      //keeping all the images execpt the image that is being removed
      const updatedImgs = otherImgs.filter(
        (_, index) => index !== indexToRemove,
      );
      return [frontImg, ...updatedImgs];
    });
  }

  async function createProduct(productToSave) {
    const formData = new FormData();

    //sperating between products data and it's images (File cannot get into json for multer)
    const { images, ...productData } = productToSave;
    formData.append("product", JSON.stringify(productData));
    const imagesData = images.map((image) => ({
      file_name: image.file_name,
      number: image.number,
    }));

    //the info of the images
    formData.append("images", JSON.stringify(imagesData));
    //the actual images data
    images.forEach((image) => {
      formData.append("uploading-files", image.file);
    });

    try {
      const response = await fetch("/api/employee/createProduct", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error at creating a new product: ", error);
      return {
        success: false,
        message: "Couldn't add product",
      };
    }
  }

  //this function accure while the user press on the save btn, the the numbering of the product's images happens and the info sending to back-end starts
  async function handleSave() {
    const numberedImgs = productImgs.map((img, index) => ({
      ...img,
      number: index + 1,
    }));

    const productToSave = {
      ...product,
      images: numberedImgs,
    };
    const result = await createProduct(productToSave);
    if (result?.success) {
      await onProductAdded();
      setPopup({
        show: true,
        message: result.message,
        type: "success",
      });
    } else {
      setPopup({
        show: true,
        message: result.message,
        type: "error",
      });
    }
  }
  return (
    <div className={styles.container}>
      {popup.show && (
        <MessagePopup
          message={popup.message}
          type={popup.type}
          onClose={() => {
            setPopup({
              show: false,
              message: "",
              type: "",
            });

            if (popup.type === "success") {
              onClose();
            }
          }}
        />
      )}
      <div className={styles.heading}>
        <h2>Add Product Images</h2>
        <p>Preview how the product will appear to customers</p>
      </div>

      <div className={styles.productPreview}>
        <div className={styles.imagesSection}>
          <ProductImagesGallery
            frontImg={frontImg}
            otherImgs={otherImgs}
            onRemove={handleRemoveImage}
            onReorder={onReorder}
            onImagesChange={handleImagesChange}
          />
        </div>

        <div className={styles.detailsSection}>
          <ProductDetails product={product} />
        </div>
      </div>
      <div className={styles.buttons}>
        <div className={styles.button}>
          <GeneralBtn text="BACK" onClick={onBack} />
        </div>

        <div className={styles.button}>
          <GeneralBtn text="SAVE PRODUCT" onClick={handleSave} />
        </div>
      </div>
    </div>
  );
}

export default AddProductImages;
