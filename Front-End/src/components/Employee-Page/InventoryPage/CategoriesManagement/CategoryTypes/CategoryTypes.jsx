import styles from "./categoryTypes.module.css";
import AddCategoryTypeRow from "../AddCategoryTypeRow/AddCategoryTypeRow";
function CategoryTypes({
  types = [],
  isAddingType = false,
  isManager = false,
  categoryId,
  onCancel,
  onSaved,
  onRefreshCategories,
}) {
  const handleStatusChange = async (type) => {
    const newStatus = type.status === "Active" ? "Not Active" : "Active";
    try {
      const response = await fetch("/api/manager/changeCategoryTypeStatus", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type_id: type.type_id,
          status: newStatus,
        }),
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      onRefreshCategories?.();
    } catch (error) {
      console.error("Couldn't update category type status", error);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.typesTable}>
        <div className={styles.header}>
          <span>Type Name</span>
          <span>Minimum Sales</span>
          <span>Check After (Days)</span>
          <span>Status</span>
        </div>

        {types.map((type) => (
          <div className={styles.row} key={type.type_id}>
            <span>{type.name}</span>
            <span>{type.min_sales}</span>
            <span>{type.sales_check_days}</span>
            <button
              type="button"
              className={`${styles.statusBtn} ${type.status === "Active" ? styles.active : styles.inactive}`}
              onClick={() => handleStatusChange(type)}
              disabled={!isManager}
            >
              {type.status}
            </button>
          </div>
        ))}
        {isAddingType && (
          <AddCategoryTypeRow
            categoryId={categoryId}
            onCancel={onCancel}
            onSaved={onSaved}
          />
        )}
      </div>
    </div>
  );
}

export default CategoryTypes;
