import { TbCurrencyTaka } from "react-icons/tb";
import { MdOutlineCreditCard } from "react-icons/md";

const PaymentMethodSelector = ({ selectedMethod, onSelect }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Credit/Debit Card */}
      <button
        onClick={() => onSelect("card")}
        className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${
          selectedMethod === "card"
            ? "border-primary bg-primary/10"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-blue-200/70 rounded-lg flex items-center justify-center">
            <MdOutlineCreditCard className="text-blue-700 h-8 w-8" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-sm">Credit/Debit Card</p>
            <p className="text-xs text-gray-500">Visa, Mastercard, Amex etc.</p>
          </div>
        </div>
      </button>

      {/* Cash on Delivery */}
      <button
        onClick={() => onSelect("cod")}
        className={`p-4 border-2 rounded-lg transition-all cursor-pointer ${
          selectedMethod === "cod"
            ? "border-primary bg-primary/10"
            : "border-gray-200 hover:border-gray-300"
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 bg-green-200/70 rounded-lg flex items-center justify-center">
            <TbCurrencyTaka className="w-8 h-8 text-green-700" />
          </div>
          <div className="text-center">
            <p className="font-semibold text-sm">Cash on Delivery</p>
            <p className="text-xs text-gray-500">Pay when you receive</p>
          </div>
        </div>
      </button>
    </div>
  );
};

export default PaymentMethodSelector;