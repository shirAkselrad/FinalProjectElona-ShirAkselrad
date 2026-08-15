import styles from "./employeePage.module.css";
import Menu from "../../General/ManagerAndEmployee/Menu/Menu.jsx"
import Clients from "../Clients/Clients.jsx";

import { FaUser } from "react-icons/fa";
import { FaBoxesStacked } from "react-icons/fa6";
import { FaBox } from "react-icons/fa";

function EmployeePage() {
  //just for now, till we will enter a real values
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
const names = ["Noa Azulay", "Roni Peretz", "Yael Mor", "Adi Cohen"];

const phones = ["050-3456789", "053-4567890", "052-6789012", "050-7890123"];

const addresses = [
  "Jerusalem, Israel",
  "Netanya, Israel",
  "Rishon LeZion, Israel",
  "Tel Aviv, Israel",
];

const emails = [
  "noa@gmail.com",
  "roni@gmail.com",
  "yael@gmail.com",
  "adi@gmail.com",
];

const roles = ["Client", "Client", "Client", "Client"];
  return (
    <main className={styles.employeePage}>
      <div className={styles.content}>
        <Clients
          names={names}
          phones={phones}
          addresses={addresses}
          emails={emails}
          roles={roles}
        />

        <Menu items={employeeMenu} />
      </div>
    </main>
  );
}

export default EmployeePage;
