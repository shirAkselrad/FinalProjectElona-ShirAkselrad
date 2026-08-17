import styles from "./clientsTable.module.css";
import ClientRow from "../ClientRow/ClientRow.jsx";

function ClientsTable({ clients }) {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>Name</th>
          <th>Phone</th>
          <th>Address</th>
          <th>Email</th>
          <th>Role</th>
          <th>Edit</th>
        </tr>
      </thead>

      <tbody>
        {clients.map((client) => (
          <ClientRow key={client.id} client={client} />
        ))}
      </tbody>
    </table>
  );
}

export default ClientsTable;
