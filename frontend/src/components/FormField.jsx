function FormField({ label, name, type = 'text', value, onChange, error, children }) {
  return (
    <div className="form-field">
      <label htmlFor={name}>{label}</label>
      {children || (
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
        />
      )}
      {error && <p className="field-error">{error}</p>}
    </div>
  );
}

export default FormField;
