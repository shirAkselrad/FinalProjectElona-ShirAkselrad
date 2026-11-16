import styles from "./employeePage.module.css";
import Menu from "../../General/ManagerAndEmployee/Menu/Menu.jsx";
import { FaUser, FaBox } from "react-icons/fa";
import { FaBoxesStacked } from "react-icons/fa6";
import { FaRegDotCircle } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

function EmployeePage() {
  //in those state variables all of the main info of the shop is saved 
  const [clients, setClients] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [orders, setOrders] = useState([]);


  //this function gets all the orders from BE (no filters)
  async function getOrders() {
    try {
      const response = await fetch("/api/employee/orders",{
        method:"GET"
      });
      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setOrders(data.orders);
    } catch (error) {
      console.error("Error getting orders:", error);
    }
  }


//this function gets all inventory (products) no filters 
  async function getInventory() {
    try {
      const response = await fetch("/api/employee/inventory");

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setInventory(data.inventory);
    } catch (error) {
      console.error("Error getting inventory:", error);
    }
  }

  //this function gets all the clients from BE with no filters 
  async function getClients() {
    try {
      const response = await fetch("/api/employee/clients");

      if (!response.ok)
        throw new Error(`HTTP error! status: ${response.status}`);

      const data = await response.json();
      setClients(data.clients);
    } catch (error) {
      console.error("Error getting clients:", error);
    }
  }


  
  useEffect(() => {
    getClients();
    getInventory();
    getOrders();
  }, []);

  const employeeMenu = [
    {
      text: "Overview",
      value: "Overview",
      path: "/employeePage",
      icon: <FaRegDotCircle />,
    },
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
        <Outlet
          context={{
            clients,
            setClients,
            inventory,
            setInventory,
            orders,
            setOrders,
          }}
        />

        <Menu items={employeeMenu} />
      </div>
    </main>
  );
}

export default EmployeePage;
