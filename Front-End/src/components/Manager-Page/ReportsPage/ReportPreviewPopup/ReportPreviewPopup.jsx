import { useState } from "react";
import styles from "./reportPreviewPopup.module.css";
import Remove from "../../../General/Remove/Remove";
import GeneralBtn from "../../../General/GeneralBtn/GeneralBtn";

function ReportPreviewPopup({ url, onClose }) {
  const [loading, setLoading] = useState(true);

  //downloading the report
  function handleDownload() {
    const separator = url.includes("?") ? "&" : "?";
    window.location.href = `${url}${separator}download=true`;
  }

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        <div className={styles.header}>
          <h2 className={styles.title}>Report Preview</h2>
          <Remove onClick={onClose} />
        </div>

        <div className={styles.previewContainer}>
          {loading && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
              <span>Loading report...</span>
            </div>
          )}

          <iframe
            src={url}
            title="PDF Report Preview"
            className={styles.pdfPreview}
            onLoad={() => setLoading(false)}
            style={{ visibility: loading ? "hidden" : "visible" }}
          />
        </div>

        <div className={styles.footer}>
          <GeneralBtn
            text="DOWNLOAD PDF"
            type="button"
            onClick={handleDownload}
            disabled={loading}
            className={styles.downloadBtn}
          />
        </div>
      </div>
    </div>
  );
}

export default ReportPreviewPopup;
