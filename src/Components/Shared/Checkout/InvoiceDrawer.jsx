import { FaXmark } from "react-icons/fa6";

const InvoiceDrawer = ({
  isOpen,
  isClosing,
  userEmail,
  billingAddress,
  onEditBilling,
  onSave,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/10 bg-opacity-50 z-40 transition-opacity duration-300 ${
          isClosing ? "opacity-0" : "opacity-100"
        }`}
        onClick={onCancel}
      />
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-[300px] sm:max-w-sm bg-white animate-slide-in-right shadow-2xl z-50 overflow-y-auto hide-scrollbar transition-transform duration-300 ease-in-out ${
          isClosing ? "translate-x-full" : "translate-x-0"
        }`}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Invoice and Contact Info</h2>
            <button
              onClick={onCancel}
              className="text-gray-400 hover:text-red-500 cursor-pointer"
            >
              <FaXmark size={24} />
            </button>
          </div>

          <div className="space-y-6">
            {/* Email Section */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={userEmail}
                readOnly
                placeholder="Enter your email"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter your email to get delivery status updates
              </p>
            </div>

            {/* Billing Address Section */}
            <div>
              <div className="flex justify-between items-center mb-3">
                <label className="block text-sm font-medium text-gray-700">
                  Billing Address <span className="text-red-500">*</span>
                </label>
                <button
                  onClick={onEditBilling}
                  className="text-blue-600 hover:text-blue-700 font-medium text-sm cursor-pointer"
                >
                  EDIT
                </button>
              </div>

              {billingAddress ? (
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium">{billingAddress.name}</p>
                    <span className="text-sm text-gray-600">
                      {billingAddress.phone}
                    </span>
                  </div>
                  <span
                    className={`${
                      billingAddress.label === "HOME"
                        ? "bg-orange-500"
                        : "bg-primary"
                    } text-white text-xs px-2 py-0.5 rounded-full inline-block mb-2`}
                  >
                    {billingAddress.label}
                  </span>
                  <p className="text-sm text-gray-600">
                    {billingAddress.address}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {billingAddress.thana} - {billingAddress.district} -{" "}
                    {billingAddress.region}
                  </p>
                </div>
              ) : (
                <div className="border border-dashed border-gray-300 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">
                    Please edit your billing address
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={onCancel}
              className="flex-1 btn btn-outline disabled:text-black/50"
            >
              CANCEL
            </button>
            <button
              onClick={onSave}
              disabled={!userEmail || !billingAddress}
              className="flex-1 btn text-white btn-primary disabled:text-black/50"
            >
              SAVE
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default InvoiceDrawer;