import styles from "../AddProductPopup/AddProduct/addProduct.module.css";
import Remove from "../../../General/Remove/Remove.jsx";
import AddProductDetails from "../AddProductPopup/AddProductDetails/AddProductDetails.jsx";
import AddProductFrontImg from "../AddProductPopup/AddProductFrontImg/AddProductFrontImg.jsx";
import AddProductImages from "../AddProductPopup/AddProductImages/AddProductImages.jsx";
import { useEffect, useState } from "react";

function EditInventoryPopup({ onClose, product, onSave, isManager = false }) {
  const [step, setStep] = useState(1);
  const [productDetails, setProductDetails] = useState({
    ...product,
    colors: Array.isArray(product.colors)
      ? product.colors
      : product.colors.split(",").map((color) => color.trim()),
  });
  const [productImgs, setProductImgs] = useState([]);

  useEffect(() => {
    async function getProductImgs() {
      try {
        const url = isManager
          ? `/api/manager/getProductImages/${product.product_id}`
          : `/api/employee/getProductImages/${product.product_id}`;
        const response = await fetch(url, { method: "GET" });
        const data = await response.json();
        if (!response.ok) throw new Error(data.message);
        setProductImgs(
          data.files.sort((a, b) => a.file_number - b.file_number),
        );
      } catch (error) {
        console.error("Couldn't get product images: ", error);
      }
    }
    getProductImgs();
  }, [product.product_id, isManager]);

  function handleDetailsNext(details) {
    setProductDetails(details);
    setStep(2);
  }
  function handleNext() {
    setStep((prev) => prev + 1);
  }
  function handleBack() {
    setStep((prev) => prev - 1);
  }

  function handleImagesReorder(fromIndex, toIndex) {
    setProductImgs((prev) => {
      const frontImg = prev.find((img) => img.file_number === 1);
      const otherImgs = prev.filter((img) => img.file_number !== 1);
      const updatedImgs = [...otherImgs];
      const [draggedImg] = updatedImgs.splice(fromIndex, 1);
      updatedImgs.splice(toIndex, 0, draggedImg);
      return [frontImg, ...updatedImgs];
    });
  }

  async function savedEditedProduct(productToSave) {
    try {
      const formData = new FormData();
      const { images, ...productData } = productToSave;
      formData.append("product", JSON.stringify(productData));
      formData.append(
        "images",
        JSON.stringify(
          images.map((img) => ({
            file_name: img.file_name,
            file_number: img.file_number,
            path: img.path || null,
          })),
        ),
      );
      images.forEach((img) => {
        if (img.file instanceof File)
          formData.append("uploading-files", img.file);
      });
      const url = isManager
        ? `/api/manager/editedProduct/${product.product_id}`
        : `/api/employee/editedProduct/${product.product_id}`;
      const response = await fetch(url, {
        method: "PUT",
        body: formData,
      });
      const responseText = await response.text();
      console.log("Server response:", response.status, responseText);

      const data = JSON.parse(responseText);0

      if (data.success) {
        await onSave({
          ...productData,
          colors: productData.colors.join(","),
        });
        onClose();
      } else console.error(data.message);
      return data;
    } catch (error) {
      console.error("Couldn't update product: ", error);
      return {
        success: false,
        message: "Couldn't update product",
      };
    }
  }
  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.closeBtn}>
          <Remove onClick={onClose} />
        </div>

        {step === 1 && (
          <AddProductDetails
            savedDetails={productDetails}
            onNext={handleDetailsNext}
            isManager={isManager}
            isEdit={true}
          />
        )}

        {step === 2 && (
          <AddProductFrontImg
            product={productDetails}
            productImgs={productImgs}
            setProductImgs={setProductImgs}
            onNext={handleNext}
            onBack={handleBack}
          />
        )}

        {step === 3 && (
          <AddProductImages
            product={productDetails}
            productImgs={productImgs}
            setProductImgs={setProductImgs}
            onReorder={handleImagesReorder}
            onBack={handleBack}
            onClose={onClose}
            isManager={isManager}
            isEdit={true}
            onSaveEdited={savedEditedProduct}
          />
        )}
      </div>
    </div>
  );
}

export default EditInventoryPopup;
