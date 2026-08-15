import styles from "./clientsTable.module.css";
import ClientRow from "../ClientRow/ClientRow.jsx";

function ClientsTable({ names, phones, addresses, emails, roles }) {
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
        {names.map((name, i) => (
          <ClientRow
            name={name}
            phone={phones[i]}
            address={addresses[i]}
            email={emails[i]}
            role={roles[i]}
          />
        ))}
      </tbody>
    </table>
  );
}

export default ClientsTable;
