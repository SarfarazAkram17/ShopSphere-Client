import { FaRegEdit } from "react-icons/fa";

const StoreInfoCard = ({ store, handleEdit }) => {
  return (
    <div className="bg-white shadow-md border border-primary rounded-xl p-6 space-y-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Store Information</h2>
        <FaRegEdit
          size={25}
          className="cursor-pointer text-primary"
          onClick={() => handleEdit("store")}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <p>
          <span className="font-medium">Store Address:</span>{" "}
          {store?.storeAddress}
        </p>
        <p>
          <span className="font-medium">Region:</span> {store?.region}
        </p>
        <p>
          <span className="font-medium">District:</span> {store?.district}
        </p>
        <p>
          <span className="font-medium">Thana:</span> {store?.thana}
        </p>
        <p>
          <span className="font-medium">Store Name:</span> {store?.storeName}
        </p>
        <p>
          <span className="font-medium">Stripe Account ID:</span>{" "}
          {store?.stripeAccountId}
        </p>
        <p>
          <span className="font-medium">Categories:</span>{" "}
          <span className="capitalize">{store?.categories?.join(", ")}</span>
        </p>
        <p>
          <span className="font-medium">Status:</span>{" "}
          <span
            className={`capitalize font-semibold ${
              store?.work_status === "available"
                ? "text-green-600"
                : "text-red-500"
            }`}
          >
            {store?.work_status}
          </span>
        </p>
        <div>
          <p className="font-medium mb-2">Store Logo:</p>
          <img
            src={store?.storeLogo}
            alt="Store Logo"
            className="w-auto h-32 object-contain rounded"
          />
        </div>
        <div>
          <p className="font-medium mb-2">Cover Image:</p>
          <img
            src={store?.coverImage}
            alt="Cover"
            className="w-auto h-36 object-cover rounded"
          />
        </div>
      </div>
    </div>
  );
};

export default StoreInfoCard;