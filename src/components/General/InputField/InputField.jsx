function InputField({ label, placeholder, type = "text" }) {
  return (
    <div className={styles.field}>
      <label className={styles.label}>{label}</label>

      <input className={styles.input} type={type} placeholder={placeholder} />
    </div>
  );
}
