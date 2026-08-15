import styles from "./clients.module.css";

import ClientsTable from "../ClientsTable/ClientsTable.jsx";
import SectionTitle from "../SectionTitle/SectionTitle.jsx";

function Clients({ names, phones, addresses, emails, roles }) {
  return (
    <div className={styles.clients}>
      <div className={styles.top}>
        <SectionTitle title="Clients" />

        <button className={styles.addClient}>+ ADD CLIENT</button>
      </div>

      <ClientsTable
        names={names}
        phones={phones}
        addresses={addresses}
        emails={emails}
        roles={roles}
      />
    </div>
  );
}

export default Clients;
