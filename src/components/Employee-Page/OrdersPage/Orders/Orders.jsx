import styles from "./orders.module.css";
import { useState } from "react";
import OrdersTable from "../OrdersTable/OrdersTable.jsx";
import SectionTitle from "../../SectionTitle/SectionTitle.jsx";
import SearchBar from "../../../General/SearchBar/SearchBar.jsx";

const orders = [
  {
    id: 1,
    client: "Noa Azulay",
    items: 3,
    date: "17/08/2026",
    total: 250,
    status: "Processing",
  },
  {
    id: 2,
    client: "Roni Peretz",
    items: 2,
    date: "16/08/2026",
    total: 180,
    status: "Completed",
  },
];

function Orders() {
  //This part is resposible to the search filter in the orders table
  const [searchValue, setSearchValue] = useState("");
  const filterOrders = orders.filter((order) =>
    order.client.includes(searchValue),
  );

  return (
    <div className={styles.orders}>
      <SectionTitle title="Orders" />
      <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} />
      <div className={styles.tableContainer}>
        <OrdersTable orders={filterOrders} />
      </div>
    </div>
  );
}

export default Orders;
