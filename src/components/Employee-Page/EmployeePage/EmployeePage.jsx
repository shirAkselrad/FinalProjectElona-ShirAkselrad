import styles from "./employeePage.module.css";

import brownBagImg from "../../../assets/brownBagImg.png";
import cloverBroochImg from "../../../assets/cloverBroochImg.png";
import creamHatImg from "../../../assets/creamHatImg.png";
import Menu from "../../General/ManagerAndEmployee/Menu/Menu.jsx";

import Clients from "../ClientsPage/Clients/Clients.jsx";
import Inventory from "../InventoryPage/Inventory/Inventory.jsx";
import Orders from "../OrdersPage/Orders/Orders.jsx";

import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { FaBoxesStacked } from "react-icons/fa6";
import { FaBox } from "react-icons/fa";

function EmployeePage() {
  const employeeMenu = [
    {
      text: "Edit Clients",
      value: "Clients",
      icon: <FaUser />,
    },
    {
      text: "Edit Inventory",
      value: "Inventory",
      icon: <FaBoxesStacked />,
    },
    {
      text: "Orders",
      value: "Orders",
      icon: <FaBox />,
    },
  ];

  const clients = [
    {
      id: 1,
      name: "Noa Azulay",
      phone: "050-1234567",
      address: "Haifa",
      email: "noa@email.com",
      role: "Client",
    },
    {
      id: 2,
      name: "Roni Peretz",
      phone: "052-2345678",
      address: "Tel Aviv",
      email: "roni@email.com",
      role: "Client",
    },
    {
      id: 3,
      name: "Yael Mor",
      phone: "054-3456789",
      address: "Jerusalem",
      email: "yael@email.com",
      role: "Client",
    },
    {
      id: 4,
      name: "Adi Cohen",
      phone: "053-4567890",
      address: "Netanya",
      email: "adi@email.com",
      role: "Client",
    },
  ];

  const orders = [
    {
      id: 1001,
      client: "Noa Azulay",
      items: 3,
      date: "2026-08-10",
      total: 168,
      status: "Complete",
    },
    {
      id: 1002,
      client: "Roni Peretz",
      items: 1,
      date: "2026-08-11",
      total: 295,
      status: "Processing",
    },
    {
      id: 1003,
      client: "Yael Mor",
      items: 2,
      date: "2026-08-12",
      total: 120,
      status: "Canceled",
    },
    {
      id: 1004,
      client: "Adi Cohen",
      items: 2,
      date: "2026-08-13",
      total: 288,
      status: "Processing",
    },
  ];

  const inventory = [
    {
      id: 1,
      name: "Clover Brooch",
      category: "Brooch",
      stock: 12,
      price: 168,
      status: "In Stock",
      image: cloverBroochImg,
    },
    {
      id: 2,
      name: "Brown Bag",
      category: "Bag",
      stock: 4,
      price: 295,
      status: "Low Stock",
      image: brownBagImg,
    },
    {
      id: 3,
      name: "Cream Hat",
      category: "Hat",
      stock: 0,
      price: 120,
      status: "Out of Stock",
      image: creamHatImg,
    },
  ];

  const [activePage, setActivePage] = useState("Clients");
  return (
    <main className={styles.employeePage}>
      <div className={styles.content}>
        {activePage === "Clients" && <Clients clients={clients} />}
        {activePage === "Inventory" && <Inventory inventory={inventory} />}
        {activePage === "Orders" && <Orders orders={orders} />}
        <Menu items={employeeMenu} setActivePage={setActivePage} />
      </div>
    </main>
  );
}

export default EmployeePage;
