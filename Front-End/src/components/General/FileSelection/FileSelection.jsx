import styles from "./fileSelection.module.css";

function FileSelection({ files, value, onChange }) {
  return (
    <select
      className={styles.selection}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
    >
      {files.length === 0 ? (
        <option value="">None</option>
      ) : (
        files.map((image) => (
          <option key={image.id} value={image.id}>
            {/**In case it's an img which have been uploaded by the user or an img which came from the data base */}
            {image.file ? image.file.name : image.file_name}
          </option>
        ))
      )}
    </select>
  );
}

export default FileSelection;
