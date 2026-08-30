import styles from "./managerPage.module.css";

import StoreOverview from "../OverViewPart/StoreOverview/StoreOverview.jsx";
import Menu from "../../General/ManagerAndEmployee/Menu/Menu.jsx";

import { FaRegDotCircle } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaBoxesStacked } from "react-icons/fa6";
import { FaBox } from "react-icons/fa";
import { FiClipboard } from "react-icons/fi";

function ManagerPage() {
  const managerMenu = [
    {
      text: "Overview",
      value: "overview",
      path: "managerPage/overview",
      icon: <FaRegDotCircle />,
    },
    {
      text: "Edit Users",
      value: "users",
      path: "managerPage/users",
      icon: <FaUser />,
    },
    {
      text: "Edit Inventory",
      value: "inventory",
      path: "managerPage/inventory",
      icon: <FaBoxesStacked />,
    },
    {
      text: "Orders",
      value: "orders",
      path: "managerPage/orders",
      icon: <FaBox />,
    },
    {
      text: "Issuing Reports",
      value: "reports",
      path: "managerPage/reports",
      icon: <FiClipboard />,
    },
  ];

  const orders = ["#1002", "#1003", "#1006", "#1007"];

  const clients = ["Roni Peretz", "Yael Mor", "Roni Peretz", "Yael Mor"];

  const dates = ["2025-07-18", "2025-07-21", "2025-08-03", "2025-08-05"];

  const totals = [490, 490, 335, 465];

  const items = [
    "Gold Wrist Watch",
    "Rose Agate Pendant, Cream Fedora Hat",
    "Cream Fedora Hat, Tan Leather Belt",
    "Golden Leaf Brooch",
  ];

  const products = [
    "Gold Wrist Watch",
    "Rose Agate Pendant",
    "Art Deco Crystal Brooch",
  ];

  const statuses = ["OUT OF STOCK", "LOW STOCK", "LOW STOCK"];

  const stocks = [0, 3, 2];

  return (
    <main className={styles.managerPage}>
      <div className={styles.content}>
        <StoreOverview
          orders={orders}
          clients={clients}
          dates={dates}
          totals={totals}
          items={items}
          products={products}
          statuses={statuses}
          stocks={stocks}
        />

        <Menu items={managerMenu} />
      </div>
    </main>
  );
}

export default ManagerPage;
