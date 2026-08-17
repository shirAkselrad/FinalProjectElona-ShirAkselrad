import { useState } from "react";

import styles from "./inventory.module.css";

import SearchBar from "../../../General/SearchBar/SearchBar.jsx";
import InventoryTable from "../InventoryTable/InventoryTable.jsx";
import SectionTitle from "../../SectionTitle/SectionTitle.jsx";

function Inventory({ inventory }) {
  // This part is responsible for the search filter in the inventory table
  const [searchValue, setSearchValue] = useState("");

  const filterInventory = inventory.filter((inv) =>
    inv.name.includes(searchValue),
  );

  return (
    <div className={styles.inventory}>
      <div className={styles.top}>
        <SectionTitle title="Inventory" />

        <button className={styles.addProduct}>+ ADD PRODUCT</button>
      </div>

      <div className={styles.search}>
        <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} />
      </div>
      <InventoryTable inventory={filterInventory} />
    </div>
  );
}

export default Inventory;
