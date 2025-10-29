export const FormSection = ({
  // eslint-disable-next-line no-unused-vars
  icon: Icon,
  title,
  children,
  iconColor = "text-blue-600",
}) => {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
        <Icon className={`w-5 h-5 ${iconColor}`} />
        <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  );
};