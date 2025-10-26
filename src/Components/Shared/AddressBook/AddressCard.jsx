import { AiOutlineHome, AiOutlinePhone, AiOutlineEdit } from "react-icons/ai";
import { BsBriefcase } from "react-icons/bs";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BiMap } from "react-icons/bi";

const AddressCard = ({ address, onEdit }) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group hover:scale-105 flex flex-col">
      <div className="p-6 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`p-3 rounded-xl ${
                address.label === "HOME" ? "bg-orange-100" : "bg-teal-100"
              }`}
            >
              {address.label === "HOME" ? (
                <AiOutlineHome
                  className={`w-6 h-6 ${
                    address.label === "HOME"
                      ? "text-orange-600"
                      : "text-teal-600"
                  }`}
                />
              ) : (
                <BsBriefcase className="w-6 h-6 text-teal-600" />
              )}
            </div>
            <div>
              <h3 className="font-bold text-gray-800 text-lg">
                {address.name}
              </h3>
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
          </div>
        </div>

        <div className="space-y-3 mb-4 flex-1">
          <div className="flex items-start gap-2 text-gray-600">
            <HiOutlineLocationMarker className="w-4 h-4 mt-1 flex-shrink-0 text-teal-500" />
            <p className="text-sm leading-relaxed">{address.address}</p>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <BiMap className="w-4 h-4 flex-shrink-0 text-cyan-500" />
            <p className="text-sm">
              {address.region} • {address.district} • {address.thana}
            </p>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <AiOutlinePhone className="w-4 h-4 flex-shrink-0 text-purple-500" />
            <p className="text-sm font-medium">{address.phone}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {address.isDefaultShipping && (
            <span className="text-xs px-3 py-1 bg-teal-50 text-teal-700 rounded-full font-medium border border-teal-200">
              ✓ Default Shipping
            </span>
          )}
          {address.isDefaultBilling && (
            <span className="text-xs px-3 py-1 bg-cyan-50 text-cyan-700 rounded-full font-medium border border-cyan-200">
              ✓ Default Billing
            </span>
          )}
        </div>

        <button
          onClick={() => onEdit(address)}
          className="w-full bg-gradient-to-r from-teal-500 to-cyan-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 hover:shadow-lg transition-all group-hover:scale-105 cursor-pointer mt-auto"
        >
          <AiOutlineEdit size={18} />
          Edit Address
        </button>
      </div>
    </div>
  );
};

export default AddressCard;