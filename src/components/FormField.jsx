export function FormField({ label, error, touched, children }) {
  return (
    <div className="grid gap-1.5">
      {label && <label className="text-sm font-semibold text-slate-900">{label}</label>}
      {children}
      {error && touched && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function TextInput({
  name,
  label,
  placeholder,
  value,
  onChange,
  error,
  touched,
  disabled,
  type = "text",
  ...props
}) {
  return (
    <FormField label={label} error={error} touched={touched}>
      <input
        type={type}
        name={name}
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange(name, e.target.value)}
        disabled={disabled}
        className={`px-4 py-2 rounded-lg border bg-white text-sm transition-colors focus:outline-none focus-ring ${
          error && touched
            ? "border-red-300 bg-red-50"
            : "border-slate-300 hover:border-slate-400 focus:border-indigo-500"
        } disabled:bg-slate-50 disabled:text-slate-500`}
        {...props}
      />
    </FormField>
  );
}

export function TextArea({
  name,
  label,
  placeholder,
  value,
  onChange,
  error,
  touched,
  disabled,
  rows = 4,
  ...props
}) {
  return (
    <FormField label={label} error={error} touched={touched}>
      <textarea
        name={name}
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange(name, e.target.value)}
        disabled={disabled}
        rows={rows}
        className={`px-4 py-2 rounded-lg border bg-white text-sm transition-colors focus:outline-none focus-ring resize-none ${
          error && touched
            ? "border-red-300 bg-red-50"
            : "border-slate-300 hover:border-slate-400 focus:border-indigo-500"
        } disabled:bg-slate-50 disabled:text-slate-500`}
        {...props}
      />
    </FormField>
  );
}

export function SelectInput({
  name,
  label,
  placeholder,
  options,
  value,
  onChange,
  error,
  touched,
  disabled,
  ...props
}) {
  return (
    <FormField label={label} error={error} touched={touched}>
      <select
        name={name}
        value={value || ""}
        onChange={(e) => onChange(name, e.target.value)}
        disabled={disabled}
        className={`px-4 py-2 rounded-lg border bg-white text-sm transition-colors focus:outline-none focus-ring ${
          error && touched
            ? "border-red-300 bg-red-50"
            : "border-slate-300 hover:border-slate-400 focus:border-indigo-500"
        } disabled:bg-slate-50 disabled:text-slate-500`}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options?.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FormField>
  );
}

export function NumberInput({
  name,
  label,
  placeholder,
  value,
  onChange,
  error,
  touched,
  disabled,
  ...props
}) {
  return (
    <FormField label={label} error={error} touched={touched}>
      <input
        type="number"
        name={name}
        placeholder={placeholder}
        value={value || ""}
        onChange={(e) => onChange(name, e.target.value ? parseFloat(e.target.value) : "")}
        disabled={disabled}
        className={`px-4 py-2 rounded-lg border bg-white text-sm transition-colors focus:outline-none focus-ring ${
          error && touched
            ? "border-red-300 bg-red-50"
            : "border-slate-300 hover:border-slate-400 focus:border-indigo-500"
        } disabled:bg-slate-50 disabled:text-slate-500`}
        {...props}
      />
    </FormField>
  );
}
