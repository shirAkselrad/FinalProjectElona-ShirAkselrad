import styles from "./orders.module.css";
import { useState } from "react";
import OrdersTable from "../OrdersTable/OrdersTable.jsx";
import SectionTitle from "../../SectionTitle/SectionTitle.jsx";
import SearchBar from "../../../General/SearchBar/SearchBar.jsx";

//just for now till we will use the DB
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

/**
 *
 * @returns Orders
 */
function Orders() {
  //the state variable is resposible to the search filter in the orders table
  const [searchValue, setSearchValue] = useState("");

  //the state variable is for the updating the order array, by default gets the original orders array
  const [ordersToUpdate, setOrdersToUpdate] = useState(orders);

  //This function filter the orders while the user is search for an orders
  const filterOrders = ordersToUpdate.filter((order) =>
    order.client.includes(searchValue),
  );

  //This function save all the changes while clicking on the SAVE button
  const onSave = (editedOrder) => {
    const updatedOrders = ordersToUpdate.map((order) =>
      order.id === editedOrder.id ? editedOrder : order,
    );
    setOrdersToUpdate(updatedOrders);
  };

  return (
    <div className={styles.orders}>
      {/*gets a title to display */}
      <SectionTitle title="Orders" />
      {/**The searchbar operate the setSearchValue function and returns the searchValue */}
      <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} />
      <div className={styles.tableContainer}>
        {/**gets the onSave function and the filterOrder */}
        <OrdersTable onSave={onSave} orders={filterOrders} />
      </div>
    </div>
  );
}

export default Orders;
