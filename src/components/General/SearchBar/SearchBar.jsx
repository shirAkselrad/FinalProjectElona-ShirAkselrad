import { FiSearch } from "react-icons/fi";
import styles from "./searchBar.module.css";

/**
 *
 * @param {searchValue} searchValue for filtering the lines to present
 * @param {setSearchValue} setSearchValue function which will operate the searching
 * @returns SearchBar
 */
function SearchBar({ searchValue, setSearchValue }) {
  return (
    <div className={styles.searchBar}>
      <FiSearch className={styles.searchIcon} />

      {/*takes what the user entered and returns it back to Inventory.jsx filter function */}
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
