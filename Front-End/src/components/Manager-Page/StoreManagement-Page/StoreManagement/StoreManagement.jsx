import styles from "./storeManagement.module.css";
import SectionTitle from "../../../Employee-Page/SectionTitle/SectionTitle";
import ShippingSettings from "../ShippingSettings/ShippingSettings.jsx";
import PointsSettings from "../PointsSettings/PointsSettings.jsx";
import GeneralPromotions from "../GeneralPromotions/GeneralPromotions.jsx";
import ProductsOnSale from "../ProductsOnSale/ProductsOnSale.jsx";
import { useOutletContext } from "react-router-dom";
import { useState } from "react";
import CategoryBtn from "../../../Shop-Page/CategoryBtn/CategoryBtn.jsx";

function StoreManagement() {
  const { inventory, onSave, onRemove } = useOutletContext();
  const [selectedSection, setSelectedSection] = useState("shipping");
  return (
    <div className={styles.storeManagement}>
      <h1>Store Management</h1>

      <div className={styles.filters}>
        <CategoryBtn
          text="SHIPPING SETTINGS"
          active={selectedSection === "shipping"}
          onClick={() => setSelectedSection("shipping")}
        />

        <CategoryBtn
          text="LOYALTY POINTS"
          active={selectedSection === "points"}
          onClick={() => setSelectedSection("points")}
        />

        <CategoryBtn
          text="GENERAL PROMOTIONS"
          active={selectedSection === "promotions"}
          onClick={() => setSelectedSection("promotions")}
        />

        <CategoryBtn
          text="PRODUCTS ON SALE"
          active={selectedSection === "products"}
          onClick={() => setSelectedSection("products")}
        />
      </div>

      <div className={styles.section}>
        {selectedSection === "shipping" && <ShippingSettings />}

        {selectedSection === "points" && <PointsSettings />}

        {selectedSection === "promotions" && <GeneralPromotions />}

        {selectedSection === "products" && (
          <ProductsOnSale
            inventory={inventory}
            onSave={onSave}
            onRemove={onRemove}
          />
        )}
      </div>
    </div>
  );
}
export default StoreManagement;
