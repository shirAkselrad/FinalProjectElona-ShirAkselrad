import { useState } from "react";

import styles from "./inventory.module.css";

import SearchBar from "../../../General/SearchBar/SearchBar.jsx";
import InventoryTable from "../InventoryTable/InventoryTable.jsx";
import SectionTitle from "../../SectionTitle/SectionTitle.jsx";

/**
 *
 * @param {inventory} inventory array
 * @returns Inventory
 */
function Inventory({ inventory }) {
  // This part is responsible for the search filter in the inventory table begins empty as default
  const [searchValue, setSearchValue] = useState("");

  //resposible to update the inventory
  const [inventoryToUpdate, setInventoryToUpdate] = useState(inventory);

  //for the search bar
  const filterInventory = inventoryToUpdate.filter((inv) =>
    inv.name.includes(searchValue),
  );

  //This function save all the changes while clicking on the SAVE button
  const onSave = (editedInv) => {
    const updatedInventory = inventoryToUpdate.map((inv) =>
      inv.id === editedInv.id ? editedInv : inv,
    );

    setInventoryToUpdate(updatedInventory);
  };

  //This function removes the inv which it's remove btn was pressed
  const onRemove = (invToRemove) => {
    const updatedInventory = inventoryToUpdate.map((inv) =>
      inv.id === invToRemove.id ? { ...inv, removed: !inv.removed } : inv,
    );

    setInventoryToUpdate(updatedInventory);
  };
  return (
    <div className={styles.inventory}>
      <div className={styles.top}>
        <SectionTitle title="Inventory" />

        <div className={styles.topActions}>
          <button className={styles.saveBtn}>SAVE</button>

          <button className={styles.addProduct}>+ ADD PRODUCT</button>
        </div>
      </div>

      <div className={styles.search}>
        {/*The search bar will return the value which has been search and will store it in the searchValue for filtering when the rendering accure */}
        <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} />
      </div>

      {/*The onSave and onRemove will operate only when the save and remove btns will be click */}
      <InventoryTable
        onSave={onSave}
        onRemove={onRemove}
        inventory={filterInventory}
      />
    </div>
  );
}

export default Inventory;
