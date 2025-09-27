import { FaRegEdit } from "react-icons/fa";

const SellerPersonalInfoCard = ({ store, handleEdit }) => {
  return (
    <div>
      <div className="bg-white shadow-md border border-primary rounded-xl p-6 space-y-4 mb-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Personal Information</h2>
          <FaRegEdit
            size={25}
            className="cursor-pointer text-primary"
            onClick={() => handleEdit("personal")}
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p>
            <span className="font-medium">Name:</span> {store?.name}
          </p>
          <p>
            <span className="font-medium">Email:</span> {store?.email}
          </p>
          <p>
            <span className="font-medium">Age:</span> {store?.age}
          </p>
          <p>
            <span className="font-medium">Experience:</span> {store?.experience}{" "}
            years
          </p>
          <p>
            <span className="font-medium">Phone:</span> {store?.phone}
          </p>
          <p>
            <span className="font-medium">Status:</span>{" "}
            <span
              className={`capitalize font-semibold ${
                store?.status === "active" ? "text-green-600" : "text-red-500"
              }`}
            >
              {store?.status}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SellerPersonalInfoCard;