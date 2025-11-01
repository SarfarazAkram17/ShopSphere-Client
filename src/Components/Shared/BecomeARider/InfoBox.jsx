export const InfoBox = ({
  // eslint-disable-next-line no-unused-vars
  icon: Icon,
  title,
  description,
  bgColor = "blue",
}) => (
  <div
    className={`bg-${bgColor}-50 border border-${bgColor}-200 rounded-lg p-4`}
  >
    <div className="flex items-start gap-3">
      <Icon className={`w-7 h-7 text-${bgColor}-600 mt-0.5 flex-shrink-0`} />
      <div>
        <p className="text-sm font-semibold text-gray-800 mb-1">{title}</p>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
    </div>
  </div>
);

export default InfoBox;