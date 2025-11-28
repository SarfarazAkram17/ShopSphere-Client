import Select from "react-select";

const cancellationReasons = [
  { value: "changed_mind", label: "Changed my mind" },
  { value: "found_better_price", label: "Found better price elsewhere" },
  { value: "ordered_by_mistake", label: "Ordered by mistake" },
  { value: "delivery_time_too_long", label: "Delivery time is too long" },
  { value: "product_not_needed", label: "Product no longer needed" },
  { value: "incorrect_item", label: "Ordered incorrect item/size/color" },
  { value: "financial_constraints", label: "Financial constraints" },
  { value: "other", label: "Other reason" },
];

const customSelectStyles = {
  control: (base, state) => ({
    ...base,
    minHeight: "44px",
    borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
    boxShadow: state.isFocused ? "0 0 0 2px rgba(59, 130, 246, 0.5)" : "none",
    "&:hover": {
      borderColor: state.isFocused ? "#3b82f6" : "#d1d5db",
    },
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? "#3b82f6"
      : state.isFocused
      ? "#dbeafe"
      : "white",
    color: state.isSelected ? "white" : "#1f2937",
  }),
};

const CancellationReasonSelector = ({
  cancellationReason,
  onReasonChange,
  customReason,
  onCustomReasonChange,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <label className="block text-sm font-semibold text-gray-900 mb-2">
        Cancellation Reason <span className="text-red-500">*</span>
      </label>
      <Select
        value={cancellationReason}
        onChange={onReasonChange}
        options={cancellationReasons}
        styles={customSelectStyles}
        placeholder="Select a reason..."
        className="mb-3"
      />

      {cancellationReason?.value === "other" && (
        <textarea
          value={customReason}
          onChange={(e) => onCustomReasonChange(e.target.value)}
          placeholder="Please explain your reason..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows="5"
        />
      )}
    </div>
  );
};

export default CancellationReasonSelector;