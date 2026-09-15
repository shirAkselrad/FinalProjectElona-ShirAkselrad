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
            {image.file.name}
          </option>
        ))
      )}
    </select>
  );
}

export default FileSelection;
