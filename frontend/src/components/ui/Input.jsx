const Input = ({ 
    label, 
    type = "text", 
    value, onChange, 
    placeholder, 
    required = false, 
    name,
    className = ""
 }) => {
  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label className="text-sm font-medium text-gray-700">{label}</label>
      )}
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`border border-gray-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent ${className}`}
      />
    </div>
  );
};

export default Input;