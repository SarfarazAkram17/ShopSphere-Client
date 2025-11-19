const ShippingAddressCard = ({ shippingAddress, onEdit }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Shipping Address</h2>
        <button
          onClick={onEdit}
          className="text-blue-600 hover:text-blue-700 font-medium text-sm cursor-pointer"
        >
          EDIT
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <p className="font-medium">{shippingAddress.name}</p>
          <span className="text-sm">{shippingAddress.phone}</span>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`${
              shippingAddress.label === "HOME" ? "bg-orange-500" : "bg-primary"
            } text-white text-xs px-2 py-0.5 rounded-full`}
          >
            {shippingAddress.label}
          </span>
          <p className="text-sm text-gray-600">
            {shippingAddress.address}, {shippingAddress.thana},{" "}
            {shippingAddress.district}, {shippingAddress.region}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingAddressCard;