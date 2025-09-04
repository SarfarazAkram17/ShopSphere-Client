import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Loader from "../../../Components/Loader/Loader";
import { FaCheck, FaEye, FaTimes } from "react-icons/fa";
import { Pagination } from "antd";

const PendingSellers = () => {
  const { userEmail } = useAuth();
  const [selectedSeller, setSelectedSeller] = useState(null);
  const axiosSecure = useAxiosSecure();
  const [page, setPage] = useState(1);

  const { isPending, data, refetch } = useQuery({
    queryKey: ["pending-sellers"],
    queryFn: async () => {
      const res = await axiosSecure.get(`/sellers/pending`, {
        params: {
          email: userEmail,
          page,
          limit: 10,
        },
      });
      return res.data;
    },
  });

  const sellers = data?.pendingSellers || [];
  const total = data?.total || 0;

  if (isPending) {
    return <Loader></Loader>;
  }

  const handleApprove = async (id, email) => {
    const confirm = await Swal.fire({
      title: `Approve Application?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.patch(`/sellers/${id}/status?email=${userEmail}`, {
        status: "active",
        email,
      });

      refetch();

      Swal.fire("Success", `Seller approved successfully`, "success");
    } catch (err) {
      Swal.fire(err.message, "Could not update seller status", "error");
    }
  };

  const handleReject = async (id) => {
    const confirm = await Swal.fire({
      title: `Reject Application?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      await axiosSecure.delete(`/sellers/${id}?email=${userEmail}`);

      refetch();

      Swal.fire("Success", `Seller rejected successfully`, "success");
    } catch (err) {
      Swal.fire(err.message, "Could not reject user", "error");
    }
  };

  return (
    <div className="px-4">
      {sellers.length === 0 ? (
        <h1 className="text-3xl text-gray-600 font-extrabold mb-6 text-center">
          There is no Pending Seller Applications
        </h1>
      ) : (
        <>
          {" "}
          <h1 className="text-3xl text-gray-600 font-extrabold mb-6 text-center">
            Pending Seller Applications
          </h1>
          <div className="overflow-x-auto rounded-box border-2 border-base-content/5 bg-base-200">
            <table className="table table-xs text-center">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Store Address</th>
                  <th>Region</th>
                  <th>District</th>
                  <th>Phone</th>
                  <th>Stripe Account ID</th>
                  <th>Applied At</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {sellers.map((application, i) => (
                  <tr key={application._id}>
                    <td>{(page - 1) * 10 + i + 1}</td>
                    <td>{application.name}</td>
                    <td>{application.storeAddress}</td>
                    <td>{application.region}</td>
                    <td>{application.district}</td>
                    <td>{application.phone}</td>
                    <td>{application.stripeAccountId}</td>
                    <td
                      className="truncate max-w-[100px]"
                      title={new Date(application.appliedAt).toLocaleString()}
                    >
                      {new Date(application.appliedAt).toLocaleString()}
                    </td>
                    <td className="flex gap-1 justify-center">
                      <button
                        onClick={() => setSelectedSeller(application)}
                        className="btn btn-xs btn-info"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() =>
                          handleApprove(application._id, application.email)
                        }
                        className="btn btn-xs btn-success"
                      >
                        <FaCheck />
                      </button>
                      <button
                        onClick={() => handleReject(application._id)}
                        className="btn btn-xs btn-error"
                      >
                        <FaTimes />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Ant Design Pagination */}
          <div className="flex justify-center mt-10">
            <Pagination
              current={page}
              align="center"
              total={total}
              pageSize={10}
              showSizeChanger={false}
              onChange={(newPage) => setPage(newPage)}
            />
          </div>
        </>
      )}

      {/* Modal for viewing rider details */}
      {selectedSeller && (
        <dialog id="riderDetailsModal" className="modal modal-open">
          <div className="modal-box max-w-2xl">
            <h3 className="font-bold text-2xl mb-5">
              Seller requester Details
            </h3>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {selectedSeller.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedSeller.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedSeller.phone}
              </p>
              <p>
                <strong>Age:</strong> {selectedSeller.age}
              </p>
              <p>
                <strong>Experience:</strong> {selectedSeller.experience} years
              </p>
              <img
                src={selectedSeller.storeLogo}
                alt={selectedSeller.storeName}
                className="h-12 w-auto"
              />
              <img
                src={selectedSeller.coverImage}
                alt={selectedSeller.storeName}
                className="h-32 w-full"
              />
              <p>
                <strong>Store Name:</strong> {selectedSeller.storeName}
              </p>
              <p>
                <strong>Product Categories:</strong> {selectedSeller.categories.map(category => category).join(', ')}
              </p>
              <p>
                <strong>Store Address:</strong> {selectedSeller.storeAddress}
              </p>
              <p>
                <strong>Region:</strong> {selectedSeller.region}
              </p>
              <p>
                <strong>District:</strong> {selectedSeller.district}
              </p>
              <p>
                <strong>Thana:</strong> {selectedSeller.thana}
              </p>
              <p>
                <strong>Stripe Account ID:</strong>{" "}
                {selectedSeller.stripeAccountId}
              </p>
              <p>
                <strong>Applied At:</strong>{" "}
                {new Date(selectedSeller.appliedAt).toLocaleString()}
              </p>
            </div>

            <div className="modal-action mt-6">
              <button
                className="btn btn-outline"
                onClick={() => setSelectedSeller(null)}
              >
                Close
              </button>
            </div>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default PendingSellers;
