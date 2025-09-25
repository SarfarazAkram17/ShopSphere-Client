import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Loader from "../../../Components/Loader/Loader";

const MyStore = () => {
  const axiosSecure = useAxiosSecure();
  const { userEmail } = useAuth();

  const { isPending, data: store } = useQuery({
    queryKey: ["myStore", userEmail],
    queryFn: async () => {
      const res = await axiosSecure.get(`/sellers/myStore?email=${userEmail}`);
      return res.data;
    },
    enabled: !!userEmail,
  });

  if (isPending) return <Loader />;

  return (
    <div className="px-4">
      <h1 className="text-3xl sm:text-4xl text-primary font-bold text-center mb-5">
        My Store
      </h1>

      {/* Personal Infos */}
      <div className="bg-white shadow-md border border-primary rounded-xl p-6 space-y-4 mb-6">
        <h2 className="text-2xl font-bold mb-6">Personal Infos</h2>
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

      {/* Working Infos */}
      <div className="bg-white shadow-md border border-primary rounded-xl p-6 space-y-4">
        <h2 className="text-2xl font-bold mb-6">Working Infos</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <p>
            <span className="font-medium">Phone:</span> {store?.phone}
          </p>
          <p>
            <span className="font-medium">Experience:</span> {store?.experience}{" "}
            years
          </p>
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
            <span className="font-medium">Categories:</span>{" "}
            <span className="capitalize">{store?.categories?.join(", ")}</span>
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
    </div>
  );
};

export default MyStore;
