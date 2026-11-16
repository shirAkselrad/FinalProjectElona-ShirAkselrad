import styles from "./managerPage.module.css";
import { Outlet } from "react-router-dom";
import StoreOverview from "../OverViewPart/StoreOverview/StoreOverview.jsx";
import Menu from "../../General/ManagerAndEmployee/Menu/Menu.jsx";
import { useState, useEffect } from "react";
import { FaRegDotCircle } from "react-icons/fa";
import { FaUser } from "react-icons/fa";
import { FaBoxesStacked } from "react-icons/fa6";
import { FaBox } from "react-icons/fa";
import { FiClipboard } from "react-icons/fi";
import { FaRegStar } from "react-icons/fa";
import { FiSettings } from "react-icons/fi";
import { FiRotateCcw } from "react-icons/fi";

function ManagerPage() {
  const [users, setUsers] = useState([]); //all users
  const [managerOrders, setManagerOrders] = useState([]); //orders
  const [inventory, setInventory] = useState([]); //inventory

  //getting all the inventory (no filters)
  useEffect(() => {
    async function getInventory() {
      try {
        const response = await fetch("/api/manager/inventory", {
          method: "GET",
        });
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.success) setInventory(data.inventory);
      } catch (error) {
        console.error("Error getting inventory: ", error);
      }
    }
    getInventory();
  }, []);

  //getting all the orders (no filters)
  useEffect(() => {
    async function getOrders() {
      try {
        const response = await fetch("/api/manager/orders", {
          method: "GET",
        });
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        console.log([...new Set(data.orders.map((order) => order.status))]);
        setManagerOrders(data.orders);
      } catch (error) {
        console.error("Error getting orders: ", error);
      }
    }
    getOrders();
  }, []);

  //getting all the users (no filters)
  useEffect(() => {
    async function getUsers() {
      try {
        const response = await fetch("/api/manager/users", {
          method: "GET",
        });
        if (!response.ok)
          throw new Error(`HTTP error! status: ${response.status}`);
        const data = await response.json();
        if (data.success) setUsers(data.users);
      } catch (error) {
        console.error("Error getting users: ", error);
      }
    }
    getUsers();
  }, []);

  const managerMenu = [
    {
      text: "Overview",
      value: "overview",
      path: "/managerPage/overview",
      icon: <FaRegDotCircle />,
    },
    {
      text: "Edit Users",
      value: "users",
      path: "/managerPage/users",
      icon: <FaUser />,
    },
    {
      text: "Edit Inventory",
      value: "inventory",
      path: "/managerPage/inventory",
      icon: <FaBoxesStacked />,
    },
    {
      text: "Orders",
      value: "orders",
      path: "/managerPage/orders",
      icon: <FaBox />,
    },
    {
      value: "refunds",
      text: "Refunds",
      icon: <FiRotateCcw />,
      path: "/managerPage/refunds",
    },
    {
      text: "Customer Reviews",
      value: "reviews",
      path: "/managerPage/reviews",
      icon: <FaRegStar />,
    },
    {
      text: "Issuing Reports",
      value: "reports",
      path: "/managerPage/reports",
      icon: <FiClipboard />,
    },
    {
      text: "Store Management",
      value: "storeManagement",
      path: "/managerPage/storeManagement",
      icon: <FiSettings />,
    },
  ];

  //saving edited product info
  const onSave = (editedInv) => {
    setInventory((prevInventory) =>
      prevInventory.map((inv) =>
        inv.product_id === editedInv.product_id ? editedInv : inv,
      ),
    );
  };

  //updating the inventory after change
  const onRemove = (updatedInv) => {
    setInventory((prevInventory) =>
      prevInventory.map((inv) =>
        inv.product_id === updatedInv.product_id ? updatedInv : inv,
      ),
    );
  };
  return (
    <main className={styles.managerPage}>
      <div className={styles.content}>
        <div className={styles.pageContent}>
          <Outlet
            context={{
              users,
              setUsers,
              managerOrders,
              setManagerOrders,
              inventory,
              setInventory,
              onSave,
              onRemove,
            }}
          />
        </div>

        <Menu items={managerMenu} />
      </div>
    </main>
  );
}

export default ManagerPage;
