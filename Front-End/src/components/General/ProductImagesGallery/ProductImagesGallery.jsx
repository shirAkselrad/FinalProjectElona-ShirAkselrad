import styles from "./productImagesGallery.module.css";
import ImagesPreviewList from "../ImagesPreviewList/ImagesPreviewList";
import ImageUploadBtn from "../ImageUploadBtn/ImageUploadBtn";
import ImageArrows from "../ImageArrows/ImageArrows";
import { useState } from "react";
function ProductImagesGallery({
  frontImg,
  otherImgs,
  onRemove,
  onReorder,
  onImagesChange,
  editable = false,
}) {
  //saving the index of the current Image which displayed
  const [currentImageIndex, setCurrentIndex] = useState(0);

  //creating an array which includes all the product's images
  const allImages = [frontImg, ...otherImgs];

  //employee interface: all images are static and don't move
  //client interface: this part take care of slicing the images array only for front-end, and while switching between the images the images below are switched as well
  const orderedImages = editable
    ? allImages
    : [
        ...allImages.slice(currentImageIndex),
        ...allImages.slice(0, currentImageIndex),
      ];
  //employee interface: the images will not have the option to be moved by the arrows
  //client interface: the client will be able to switch between the product's images
  const displayedImage = editable ? frontImg : orderedImages[0];

  //This function responsible for moving to the next image
  function handleNextImage() {
    //the modulo is for the circle of the images (after the last image the first image will be displayed)
    setCurrentIndex((prev) => (prev + 1) % allImages.length);
  }

  //This function responsible is for moving back to the image before
  function handlePrevImage() {
    setCurrentIndex((prev) => (prev - 1 + allImages.length) % allImages.length);
  }

  let frontImgSrc = null;

  if (displayedImage)
    if (displayedImage.file instanceof File)
      frontImgSrc = URL.createObjectURL(displayedImage.file);
    else frontImgSrc = displayedImage.path;

  return (
    <div className={styles.container}>
      <div className={styles.frontImgContainer}>
        <div className={styles.imageWrapper}>
          {displayedImage && (
            <img
              src={frontImgSrc}
              alt={displayedImage.file_name}
              className={styles.frontImg}
            />
          )}

          {!editable && allImages.length > 1 && (
            <ImageArrows onNext={handleNextImage} onPrev={handlePrevImage} />
          )}
        </div>
      </div>
      <ImagesPreviewList
        images={editable ? otherImgs : orderedImages.slice(1)}
        onRemove={onRemove}
        onReorder={onReorder}
        editable={editable}
      />
      {editable && (
        <div className={styles.addImage}>
          <ImageUploadBtn
            text="+ADD IMAGE"
            multiple
            onChange={onImagesChange}
          />
        </div>
      )}
    </div>
  );
}
export default ProductImagesGallery;
