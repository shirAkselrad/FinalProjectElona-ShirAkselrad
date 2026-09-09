import styles from "./employeePage.module.css";
import Menu from "../../General/ManagerAndEmployee/Menu/Menu.jsx";
import { FaUser } from "react-icons/fa";
import { FaBoxesStacked } from "react-icons/fa6";
import { FaBox } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import { useEffect, useState } from "react";

/**
 *
 * @returns EmployeePage
 */
function EmployeePage() {
  //getting the clients for the clients page
  const [clients, setClients] = useState([]);
  const [inventory, setInventory] = useState([]);

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

  useEffect(() => {
    getInventory();
  }, []);








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

  const orders = [
    {
      id: 1,
      client: "Noa Azulay",
      items: 3,
      date: "17/08/2026",
      total: 250,
      status: "Processing",

      products: [
        {
          id: 1,
          name: "Amber Oval Brooch",
          quantity: 1,
          price: 100,
          removed: false,
        },
        {
          id: 2,
          name: "Brown Belt",
          quantity: 2,
          price: 75,
          removed: false,
        },
      ],
    },

    {
      id: 2,
      client: "Roni Peretz",
      items: 2,
      date: "16/08/2026",
      total: 180,
      status: "Completed",

      products: [
        {
          id: 1,
          name: "Clover Brooch",
          quantity: 1,
          price: 120,
          removed: false,
        },
        {
          id: 2,
          name: "Cream Hat",
          quantity: 1,
          price: 60,
          removed: false,
        },
      ],
    },
  ];

  // const inventory = [
  //   {
  //     id: 1,
  //     name: "Clover Brooch",
  //     category: "Brooch",
  //     stock: 12,
  //     price: 168,
  //     status: "In Stock",
  //     image: cloverBroochImg,
  //   },
  //   {
  //     id: 2,
  //     name: "Brown Bag",
  //     category: "Bag",
  //     stock: 4,
  //     price: 295,
  //     status: "Low Stock",
  //     image: brownBagImg,
  //   },
  //   {
  //     id: 3,
  //     name: "Cream Hat",
  //     category: "Hat",
  //     stock: 0,
  //     price: 120,
  //     status: "Out of Stock",
  //     image: creamHatImg,
  //   },
  // ];

  return (
    <main className={styles.employeePage}>
      <div className={styles.content}>
        <Outlet context={{ clients, setClients, inventory, setInventory, orders }} />
        {/*The menu gets the items- the optional sections according to the user role and the setActivePage which gets the function to operate */}
        <Menu items={employeeMenu} />
      </div>
    </main>
  );
}

export default EmployeePage;
