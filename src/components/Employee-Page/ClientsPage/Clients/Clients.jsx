import styles from "./clients.module.css";
import { useState } from "react";
import ClientsTable from "../ClientsTable/ClientsTable.jsx"
import SectionTitle from "../../SectionTitle/SectionTitle.jsx"
import SearchBar from "../../../General/SearchBar/SearchBar.jsx"

function Clients({ clients }) {
  //This part is resposible to the search filter in the clients table
  const [searchValue, setSearchValue] = useState("");
  const filterClients = clients.filter((client) =>
    client.name.includes(searchValue),
  );

  return (
    <div className={styles.clients}>
      <div className={styles.top}>
        <SectionTitle title="Clients" />
      </div>
      <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} />
      <ClientsTable clients={filterClients} />
    </div>
  );
}

export default Clients;
