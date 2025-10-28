import { AiOutlinePlus } from "react-icons/ai";
import { HiOutlineLocationMarker } from "react-icons/hi";
import { BsBuilding } from "react-icons/bs";

const AddressBookHeader = ({
  onAddClick,
  onDefaultShippingClick,
  onDefaultBillingClick,
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl mb-8 overflow-hidden">
      <div className="bg-gradient-to-r from-teal-500 to-cyan-500 p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:gap-4 justify-between sm:items-center">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2 flex items-center gap-3">
              <HiOutlineLocationMarker className="w-10 h-10" />
              Address Book
            </h1>
            <p className="text-teal-50">
              Manage your delivery and billing addresses
            </p>
          </div>
          <button
            onClick={onAddClick}
            className="bg-white text-teal-600 px-6 py-3 rounded-xl font-semibold flex items-center gap-2 hover:shadow-lg transition-all hover:scale-105 cursor-pointer"
          >
            <AiOutlinePlus size={22} />
            Add Address
          </button>
        </div>
      </div>

      <div className="p-6 bg-gradient-to-r from-slate-50 to-blue-50 border-t border-slate-200">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-center">
          <button
            onClick={onDefaultShippingClick}
            className="flex items-center gap-2 bg-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all text-teal-600 font-medium hover:scale-105 cursor-pointer"
          >
            <HiOutlineLocationMarker size={20} />
            Set Default Shipping
          </button>
          <button
            onClick={onDefaultBillingClick}
            className="flex items-center gap-2 bg-white px-6 py-3 rounded-xl shadow-md hover:shadow-lg transition-all text-cyan-600 font-medium hover:scale-105 cursor-pointer"
          >
            <BsBuilding size={20} />
            Set Default Billing
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressBookHeader;