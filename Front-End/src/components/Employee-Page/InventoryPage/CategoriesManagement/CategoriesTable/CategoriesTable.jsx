import styles from "./categoriesTable.module.css";
import CategoryRow from "../CategoryRow/CategoryRow.jsx";

function CategoriesTable({
  categories = [],
  isManager = false,
  onRefreshCategories,
}) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Existing Categories</h2>
        <p>View existing categories and their types.</p>

        {isManager && (
          <div className={styles.notice}>
            <h3>Important Notice</h3>

            <p>
              Changing a main category's status automatically updates the status
              of all its subcategories.
            </p>

            <p>
              Category status only controls visibility in the customer
              interface. It does not affect adding or editing inventory.
            </p>
          </div>
        )}
      </div>

      <div className={styles.table}>
        <div className={styles.tableHeader}>
          <span>Category</span>
          <span>Types</span>
          <span>{isManager ? "Status / Action" : "Status"}</span>
        </div>

        {categories.length === 0 ? (
          <p className={styles.empty}>No categories available.</p>
        ) : (
          categories.map((category) => (
            <CategoryRow
              key={category.category_id}
              category={category}
              isManager={isManager}
              onRefreshCategories={onRefreshCategories}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default CategoriesTable;
