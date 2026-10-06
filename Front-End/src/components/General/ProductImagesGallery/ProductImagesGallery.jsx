import styles from "./productImagesGallery.module.css";
import ImagesPreviewList from "../ImagesPreviewList/ImagesPreviewList";
import ImageUploadBtn from "../ImageUploadBtn/ImageUploadBtn";
function ProductImagesGallery({
  frontImg,
  otherImgs,
  onRemove,
  onReorder,
  onImagesChange,
}) {
  let frontImgSrc = null;
  if (frontImg)
    if (frontImg.file instanceof File)
      frontImgSrc = URL.createObjectURL(frontImg.file);
    else frontImgSrc = frontImg.path;

  return (
    <div className={styles.container}>
      <div className={styles.frontImgContainer}>
        {frontImg && (
          <img
            src={frontImgSrc}
            alt={frontImg.file_name}
            className={styles.frontImg}
          />
        )}
      </div>
      <ImagesPreviewList
        images={otherImgs}
        onRemove={onRemove}
        onReorder={onReorder}
      />
      <div className={styles.addImage}>
        <ImageUploadBtn text="+ADD IMAGE" multiple onChange={onImagesChange} />
      </div>
    </div>
  );
}
export default ProductImagesGallery;
