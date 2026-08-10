import { FiSearch } from "react-icons/fi";
import styles from "./searchBar.module.css";

function SearchBar() {
  return (
    <div className={styles.searchBar}>
      <FiSearch className={styles.searchIcon} />

      <input type="text" placeholder="Search" className={styles.searchInput} />
    </div>
  );
}

export default SearchBar;
