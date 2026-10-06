import { useState } from "react";
import AddProductDetails from "../AddProductDetails/AddProductDetails.jsx";
import styles from "./addProduct.module.css";
import AddProductFrontImg from "../AddProductFrontImg/AddProductFrontImg.jsx";
import AddProductImages from "../AddProductImages/AddProductImages.jsx";
import Remove from "../../../../General/Remove/Remove.jsx";
function AddProduct({ onClose, onProductAdded }) {
  //this state variable save the "step" of the addProductPopup component (details/images)
  const [step, setStep] = useState(1);
  //this state variable will save the product details (starts null)
  const [productDetails, setProductDetails] = useState(null);

  //this state variable save all the product's images
  const [productImgs, setProductImgs] = useState([]);

  //While all the inputs in step 1 are valid and the user clicked on the next btn, saving all the details of step 1 and continue to step 2
  function handleDetailsNext(details) {
    setProductDetails(details);
    setStep(2);
  }

  //This function changes the steps (goes one step next)
  function handleNext() {
    setStep((prev) => prev + 1);
  }

  //In case the user decided to go back one step
  function handleBack() {
    setStep((prev) => prev - 1);
  }

  //this function update the proudctImgs according to the user changes
  function handleImagesReorder(fromIndex, toIndex) {
    setProductImgs((prev) => {
      const frontImg = prev.find((image) => image.number === 1);
      const otherImgs = prev.filter((image) => image.number !== 1);
      const updatedImgs = [...otherImgs];

      //removing the dragged image from it's current position
      const [draggedImg] = updatedImgs.splice(fromIndex, 1);

      //adding the dragged image to it's new position
      updatedImgs.splice(toIndex, 0, draggedImg);
      return [frontImg, ...updatedImgs];
    });
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
            onProductAdded={onProductAdded}
          />
        )}
      </div>
    </div>
  );
}
export default AddProduct;
