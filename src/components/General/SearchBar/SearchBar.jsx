import { FiSearch } from "react-icons/fi";
import styles from "./searchBar.module.css";

function SearchBar({ searchValue, setSearchValue }) {
  return (
    <div className={styles.searchBar}>
      <FiSearch className={styles.searchIcon} />

      <input
        type="text"
        placeholder="Search"
        value={searchValue}
        onChange={(e) => setSearchValue(e.target.value)}
        className={styles.searchInput}
      />
    </div>
  );
}

export default SearchBar;
