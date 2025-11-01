export const FormField = ({
  label,
  icon: Icon,
  error,
  children,
  required = false,
}) => (
  <div>
    <label className="flex items-center gap-2 font-semibold mb-2 text-gray-700">
      {Icon && <Icon className="w-4 h-4" />}
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && (
      <p className="text-red-500 text-sm font-medium mt-2 flex items-center gap-1">
        <span>⚠</span> {error.message}
      </p>
    )}
  </div>
);

export default FormField;