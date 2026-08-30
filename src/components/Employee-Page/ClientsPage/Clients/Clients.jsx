import styles from "./clients.module.css";
import { useState } from "react";
import ClientsTable from "../ClientsTable/ClientsTable.jsx";
import SectionTitle from "../../SectionTitle/SectionTitle.jsx";
import SearchBar from "../../../General/SearchBar/SearchBar.jsx";
import { useOutletContext } from "react-router-dom";
function Clients() {
  //This variable state gets the clients and after one of the clients gets updated, the whole clients view is updated as well for front-end
  const { clients, setClients } = useOutletContext();
  //This part is resposible to the search filter in the clients table
  const [searchValue, setSearchValue] = useState("");

  //for the search bar
  const matchedClients = clients.filter((client) =>
    Object.entries(client).some(([key, value]) => {
      const currentValue = String(value).toLowerCase();
      const search = searchValue.toLowerCase();

      if (key === "status") {
        return currentValue === search;
      }

      return currentValue.includes(search);
    }),
  );

  const filterClients = matchedClients.length > 0 ? matchedClients : clients;

  //the function which update the clients array after updating a client
  function handleUpdateClient(updateClient) {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client.user_id === updateClient.user_id ? updateClient : client,
      ),
    );
  }

  return (
    <div className={styles.clients}>
      <div className={styles.top}>
        <SectionTitle title="Clients" />

        <button className={styles.addClient}>+ ADD CLIENT</button>
      </div>

      <div className={styles.search}>
        <SearchBar searchValue={searchValue} setSearchValue={setSearchValue} />
      </div>

      <ClientsTable onSave={handleUpdateClient} clients={filterClients} />
    </div>
  );
}

export default Clients;
