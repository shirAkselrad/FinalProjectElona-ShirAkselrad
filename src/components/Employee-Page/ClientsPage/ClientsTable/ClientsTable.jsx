import styles from "./clientsTable.module.css";
import ClientRow from "../ClientRow/ClientRow.jsx";
import EditClientPopup from "../../ClientsPage/EditClientPopup/EditClientPopup.jsx";
import { useState } from "react";
/**
 *
 * @param {clients} param0
 * @returns ClientsTable
 */
function ClientsTable({ clients, onSave }) {
  //state variable which is the selectedClient to have changes in, by default null
  const [selectedClient, setSelectedClient] = useState(null);

  return (
    <div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Phone Number</th>
            <th>City</th>
            <th>Street</th>
            <th>House Number</th>
            <th>Email</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>

        {/*going through all the clients and building the clients table  */}
        <tbody>
          {clients.map((client) => (
            <ClientRow
              key={client.user_id}
              client={client}
              onEdit={() => setSelectedClient(client)}
            />
          ))}
        </tbody>
      </table>
      {selectedClient && (
        <EditClientPopup
          client={selectedClient}
          onClose={() => setSelectedClient(null)}
          onSave={onSave}
        />
      )}
    </div>
  );
}

export default ClientsTable;
