import styles from "./employeePage.module.css";
import Menu from "../../General/ManagerAndEmployee/Menu/Menu.jsx";
import { FaUser } from "react-icons/fa";
import { FaBoxesStacked } from "react-icons/fa6";
import { FaBox } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

/**
 *
 * @returns {JSX.Element} EmployeePage
 */
function EmployeePage() {
  //getting the clients for the clients page
  const [clients, setClients] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);

  //The function gets all the orders details
  async function getOrders() {
    try {
      const response = await fetch("/api/employee/orders", {
        method: "GET",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error("Error getting orders: ", error);
    }
  }

  //The function gets all the inventory details
  async function getInventory() {
    try {
      const response = await fetch("/api/employee/inventory", {
        method: "GET",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setInventory(data.inventory);
    } catch (error) {
      console.error("Error getting inventory: ", error);
    }
  }

  //The function gets all the clients details
  async function getClients() {
    try {
      const response = await fetch("/api/employee/clients", {
        method: "GET",
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setClients(data.clients);
    } catch (error) {
      console.error("Error getting clients: ", error);
    }
  }

  useEffect(() => {
    getClients();
    getInventory();
    getOrders();
  }, []);

  //just for now the infomation is given staticly
  const employeeMenu = [
    {
      text: "Edit Clients",
      value: "Clients",
      path: "/employeePage/clients",
      icon: <FaUser />,
    },
    {
      text: "Edit Inventory",
      value: "Inventory",
      path: "/employeePage/inventory",
      icon: <FaBoxesStacked />,
    },
    {
      text: "Orders",
      value: "Orders",
      path: "/employeePage/orders",
      icon: <FaBox />,
    },
  ];

  return (
    <main className={styles.employeePage}>
      <div className={styles.content}>
        <Outlet context={{ clients, setClients, orders, setOrders }} />
        {/*The menu gets the items- the optional sections according to the user role and the setActivePage which gets the function to operate */}
        <Menu items={employeeMenu} />
      </div>
    </main>
  );
}

export default EmployeePage;
