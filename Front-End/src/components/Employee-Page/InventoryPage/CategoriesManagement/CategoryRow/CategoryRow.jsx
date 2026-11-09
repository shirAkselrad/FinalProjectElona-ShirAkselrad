import styles from "./categoryRow.module.css";
import { useState } from "react";
import { FiChevronDown, FiChevronRight, FiPlus } from "react-icons/fi";
import CategoryTypes from "../CategoryTypes/CategoryTypes.jsx";
import GeneralBtn from "../../../../General/GeneralBtn/GeneralBtn.jsx";

function CategoryRow({ category, isManager = false, onRefreshCategories }) {
  const [isOpen, setIsOpen] = useState(false);
  const [isAddingType, setIsAddingType] = useState(false);
  console.log("Category:", category);

  const handleStatusChange = async () => {
    const newStatus = category.status === "Active" ? "Not Active" : "Active";

    try {
      const response = await fetch("/api/manager/changeCategoryStatus", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category_id: category.category_id,
          status: newStatus,
        }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      onRefreshCategories?.();
    } catch (error) {
      console.error("Couldn't update category status", error);
    }
  };

  return (
    <div className={styles.container}>
      <div className={`${styles.row} ${!isManager ? styles.employee : ""}`}>
        <div className={styles.category} onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <FiChevronDown /> : <FiChevronRight />}
          <span>{category.name}</span>
        </div>

        <span className={styles.typesCount}>{category.types.length} {category.types.length===1?"Type":"Types"}</span>

        <div className={styles.actions}>
          {isManager ? (
            <>
              <GeneralBtn
                text={category.status}
                type="button"
                className={`${styles.statusBtn} ${
                  category.status === "Active" ? styles.active : styles.inactive
                }`}
                onClick={handleStatusChange}
              />

              <GeneralBtn
                text={<FiPlus />}
                type="button"
                className={styles.actionBtn}
                onClick={() => {
                  setIsOpen(true);
                  setIsAddingType(true);
                }}
              />
            </>
          ) : (
            <span
              className={`${styles.statusBtn} ${
                category.status === "Active" ? styles.active : styles.inactive
              }`}
            >
              {category.status}
            </span>
          )}
        </div>
      </div>

      {isOpen && (
        <CategoryTypes
          types={category.types}
          isAddingType={isManager && isAddingType}
          isManager={isManager}
          categoryId={category.category_id}
          onCancel={() => setIsAddingType(false)}
          onSaved={() => {
            setIsAddingType(false);
            onRefreshCategories?.();
          }}
          onRefreshCategories={onRefreshCategories}
        />
      )}
    </div>
  );
}

export default CategoryRow;
