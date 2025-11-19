const CODInstructions = () => {
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 space-y-2">
      <h4 className="font-semibold text-amber-900">
        Cash on Delivery Instructions:
      </h4>
      <ul className="text-sm text-amber-800 space-y-1 list-disc list-inside">
        <li>
          You may pay in cash to our rider upon receiving your parcel at the
          doorstep
        </li>
        <li>
          Before agreeing to receive the parcel, check if your delivery status
          has been updated to 'Out for Delivery'
        </li>
        <li>
          Before receiving, confirm that the airway bill shows that the parcel
          is from ShopSphere
        </li>
        <li>
          Before making payment to the rider, confirm that the order number,
          sender information and tracking number on the parcel
        </li>
      </ul>
    </div>
  );
};

export default CODInstructions;