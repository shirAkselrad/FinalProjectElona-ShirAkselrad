import styles from "./imageUploadBtn.module.css";

function ImageUploadBtn({ text = "ADD IMAGE", onChange, multiple = false }) {
  return (
    <label className={styles.button}>
      {text}

      <input
        type="file"
        accept=".jpg,.jpeg,.png,.webp,.mp4,.mov"
        multiple={multiple}
        onChange={onChange}
        hidden
      />
    </label>
  );
}

export default ImageUploadBtn;
