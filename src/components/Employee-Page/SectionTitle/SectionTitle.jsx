import styles from "./sectionTitle.module.css";

import SearchBar from "../../Shop-Page/SearchBar/SearchBar.jsx"

function SectionTitle({ title }) {
  return (
    <div className={styles.sectionTitle}>
      <h1 className={styles.title}>{title}</h1>

      <SearchBar />
    </div>
  );
}

export default SectionTitle;
