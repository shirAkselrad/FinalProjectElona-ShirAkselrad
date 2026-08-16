import styles from "./employeePage.module.css";

import Menu from "../../General/ManagerAndEmployee/Menu/Menu.jsx";
import Orders from "../Orders/Orders.jsx";

import { FaUser } from "react-icons/fa";
import { FaBoxesStacked } from "react-icons/fa6";
import { FaBox } from "react-icons/fa";

function EmployeePage() {
  // just for now, till we will enter real values
  const employeeMenu = [
    {
      text: "Edit Clients",
      value: "clients",
      icon: <FaUser />,
    },
    {
      text: "Edit Inventory",
      value: "inventory",
      icon: <FaBoxesStacked />,
    },
    {
      text: "Orders",
      value: "orders",
      icon: <FaBox />,
    },
  ];

  const orders = ["#1001", "#1002", "#1003", "#1004"];

  const clients = ["Noa Azulay", "Roni Peretz", "Yael Mor", "Adi Cohen"];

  const items = [
    "Clover Brooch ×1",
    "Brown Bag ×1",
    "Cream Hat ×1",
    "Clover Brooch ×1, Cream Hat ×1",
  ];

  const dates = ["2026-08-10", "2026-08-11", "2026-08-12", "2026-08-13"];

  const totals = [168, 295, 120, 288];

  const statuses = ["complete", "processing", "canceled", "processing"];

  return (
    <main className={styles.employeePage}>
      <div className={styles.content}>
        <Orders
          orders={orders}
          clients={clients}
          items={items}
          dates={dates}
          totals={totals}
          statuses={statuses}
        />

        <Menu items={employeeMenu} />
      </div>
    </main>
  );
}

export default EmployeePage;
