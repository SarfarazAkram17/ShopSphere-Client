import AddressCard from "./AddressCard";

const AddressGrid = ({ addresses, onEdit }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {addresses.map((address) => (
        <AddressCard key={address._id} address={address} onEdit={onEdit} />
      ))}
    </div>
  );
};

export default AddressGrid;