import { AiOutlineCheck } from "react-icons/ai";

const DefaultAddressItem = ({ address, isSelected, onSelect, type }) => {
  const borderColor =
    type === "shipping"
      ? isSelected
        ? "border-teal-500"
        : "border-gray-200"
      : isSelected
      ? "border-cyan-500"
      : "border-gray-200";

  const bgGradient =
    type === "shipping" ? "from-teal-50 to-cyan-50" : "from-cyan-50 to-blue-50";

  const checkColor =
    type === "shipping"
      ? "border-teal-500 bg-teal-500"
      : "border-cyan-500 bg-cyan-500";

  return (
    <div
      onClick={onSelect}
      className={`p-6 rounded-2xl border-2 cursor-pointer transition-all ${
        isSelected
          ? `${borderColor} bg-gradient-to-br ${bgGradient} shadow-lg`
          : "border-gray-200 hover:border-gray-300 hover:shadow-md"
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <div className="font-bold text-gray-800 mb-2">{address.name}</div>
            <span
              className={`text-xs font-semibold px-3 py-1 rounded-full ${
                address.label === "HOME"
                  ? "bg-orange-100 text-orange-700"
                  : "bg-teal-100 text-teal-700"
              }`}
            >
              {address.label}
            </span>
          </div>

          <div className="text-gray-700">{address.address}</div>

          <div className="text-gray-600 text-sm">
            {address.region} • {address.district} • {address.thana}
          </div>

          <div>
            <div className="text-gray-700 font-medium">{address.phone}</div>
            <div className="flex flex-col gap-1 mt-2">
              {address.isDefaultShipping && (
                <span className="text-xs px-2 py-1 bg-teal-100 text-teal-700 rounded-full w-fit">
                  {type === "shipping"
                    ? "Current Default Shipping"
                    : "Default Shipping"}
                </span>
              )}
              {address.isDefaultBilling && (
                <span className="text-xs px-2 py-1 bg-cyan-100 text-cyan-700 rounded-full w-fit">
                  {type === "billing"
                    ? "Current Default Billing"
                    : "Default Billing"}
                </span>
              )}
            </div>
          </div>
        </div>

        <div
          className={`ml-4 w-6 h-6 rounded-full border-2 flex items-center justify-center ${
            isSelected ? checkColor : "border-gray-300"
          }`}
        >
          {isSelected && <AiOutlineCheck size={16} className="text-white" />}
        </div>
      </div>
    </div>
  );
};

export default DefaultAddressItem;