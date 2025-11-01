// eslint-disable-next-line no-unused-vars
export const SectionHeader = ({ icon: Icon, title, color }) => (
  <div className="flex items-center gap-2 pb-3 border-b border-gray-200">
    <Icon className={`w-5 h-5 text-${color}-600`} />
    <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
  </div>
);

export default SectionHeader;