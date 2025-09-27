import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import Loader from "../../../Components/Loader/Loader";
import { FaCheck, FaEye, FaTimes } from "react-icons/fa";
import TablePaginationActions from "../../../lib/pagination";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Select from "react-select";

const searchOptions = [
  { value: "name", label: "Search by Name" },
  { value: "email", label: "Search by Email" },
];

const PendingRiders = () => {
  const { userEmail } = useAuth();
  const [selectedRider, setSelectedRider] = useState(null);
  const axiosSecure = useAxiosSecure();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchType, setSearchType] = useState(searchOptions[0]);
  const [searchTerm, setSearchTerm] = useState("");

  const [regions, setRegions] = useState([]);
  const [outlets, setOutlets] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [districts, setDistricts] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);

  useEffect(() => {
    fetch("/regions.json")
      .then((res) => res.json())
      .then((data) => setRegions(data));

    fetch("/outlets.json")
      .then((res) => res.json())
      .then((data) => setOutlets(data));
  }, []);

  useEffect(() => {
    if (selectedRegion) {
      const filteredDistricts = outlets
        .filter((o) => o.region === selectedRegion.value)
        .map((o) => o.district);
      setDistricts([...new Set(filteredDistricts)]);
    } else {
      const allDistricts = outlets.map((o) => o.district);
      setDistricts([...new Set(allDistricts)]);
    }
    setSelectedDistrict(null);
  }, [selectedRegion, outlets]);

  const { isPending, data, refetch } = useQuery({
    queryKey: [
      "pending-riders",
      searchTerm,
      searchTerm && searchType.value,
      page,
      selectedRegion,
      selectedDistrict,
      rowsPerPage,
    ],
    queryFn: async () => {
      const res = await axiosSecure.get(`/riders/pending`, {
        params: {
          email: userEmail,
          searchType: searchType.value,
          search: searchTerm,
          page,
          region: selectedRegion?.value || "",
          district: selectedDistrict?.value || "",
          limit: rowsPerPage,
        },
      });
      return res.data;
    },
  });

  const riders = data?.pendingRiders || [];
  const total = data?.total || 0;

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
      await axiosSecure.patch(`/riders/${id}/status?email=${userEmail}`, {
        status: "active",
        email,
      });

      refetch();

      Swal.fire("Success", `Rider approved successfully`, "success");
    } catch (err) {
      Swal.fire(err.message, "Could not update rider status", "error");
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
      await axiosSecure.delete(`/riders/${id}?email=${userEmail}`);

      refetch();

      Swal.fire("Success", `Rider rejected successfully`, "success");
    } catch (err) {
      Swal.fire(err.message, "Could not reject user", "error");
    }
  };

  return (
    <div className="px-4">
      <h1 className="text-3xl sm:text-4xl text-gray-600 font-extrabold mb-6 text-center">
        Pending Rider Applications
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-2 items-center mb-6">
        <Select
          options={searchOptions}
          value={searchType}
          onChange={(selected) => {
            setSearchType(selected);
            setPage(0);
          }}
          className="w-full"
        />
        <label className="input input-bordered w-full h-9.5">
          <input
            type="search"
            required
            placeholder={`Search by ${searchType.value}`}
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(0);
            }}
          />
        </label>
        <Select
          options={regions.map((r) => ({ value: r, label: r }))}
          value={selectedRegion}
          onChange={setSelectedRegion}
          placeholder="Filter by Region"
          className="w-full"
          isClearable
        />
        <Select
          options={districts.map((d) => ({ value: d, label: d }))}
          value={selectedDistrict}
          onChange={setSelectedDistrict}
          placeholder="Filter by District"
          className="w-full"
          isClearable
        />
      </div>

      {isPending ? (
        <Loader></Loader>
      ) : riders.length === 0 ? (
        <h1 className="text-gray-600 font-semibold text-center">
          There is no Pending Rider Applications
        </h1>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="pending riders table" size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ py: 0.5 }}>
                  #
                </TableCell>
                <TableCell align="center" sx={{ py: 0.5 }}>
                  Name
                </TableCell>
                <TableCell align="center" sx={{ py: 0.5 }}>
                  Region
                </TableCell>
                <TableCell align="center" sx={{ py: 0.5 }}>
                  District
                </TableCell>
                <TableCell align="center" sx={{ py: 0.5 }}>
                  Phone
                </TableCell>
                <TableCell align="center" sx={{ py: 0.5 }}>
                  Stripe Account ID
                </TableCell>
                <TableCell align="center" sx={{ py: 0.5 }}>
                  Applied At
                </TableCell>
                <TableCell align="center" sx={{ py: 0.5 }}>
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {riders.map((application, i) => (
                <TableRow key={application._id}>
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    {page * rowsPerPage + i + 1}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    {application.name}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    {application.region}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    {application.district}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    {application.phone}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    {application.stripeAccountId}
                  </TableCell>
                  <TableCell
                    className="truncate max-w-[100px]"
                    title={new Date(application.appliedAt).toLocaleString()}
                    align="center"
                    sx={{ py: 0.5 }}
                  >
                    {new Date(application.appliedAt).toLocaleString()}
                  </TableCell>
                  <TableCell sx={{ py: 0.5 }}>
                    <div className="flex gap-1 items-center justify-center">
                      <button
                        onClick={() => setSelectedRider(application)}
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
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 20, 30]}
                  colSpan={8}
                  count={total}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  SelectProps={{
                    inputProps: { "aria-label": "rows per page" },
                    native: false,
                  }}
                  onPageChange={(event, newPage) => setPage(newPage)}
                  onRowsPerPageChange={(event) => {
                    setRowsPerPage(parseInt(event.target.value, 10));
                    setPage(0);
                  }}
                  ActionsComponent={TablePaginationActions}
                />
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>
      )}

      {/* Modal for viewing rider details */}
      {selectedRider && (
        <dialog id="riderDetailsModal" className="modal modal-open">
          <div className="modal-box max-w-2xl hide-scrollbar max-h-[95vh]">
            <h3 className="font-bold text-2xl mb-5">Rider requester Details</h3>
            <div className="space-y-2">
              <p>
                <strong>Name:</strong> {selectedRider.name}
              </p>
              <p>
                <strong>Email:</strong> {selectedRider.email}
              </p>
              <p>
                <strong>Phone:</strong> {selectedRider.phone}
              </p>
              <p>
                <strong>Age:</strong> {selectedRider.age} years
              </p>
              <p>
                <strong>Experience:</strong> {selectedRider.experience} years
              </p>
              <p>
                <strong>Region:</strong> {selectedRider.region}
              </p>
              <p>
                <strong>District:</strong> {selectedRider.district}
              </p>
              <p>
                <strong>Thana:</strong> {selectedRider.thana}
              </p>
              <p>
                <strong>Stripe Account ID:</strong>{" "}
                {selectedRider.stripeAccountId}
              </p>
              <p>
                <strong>Applied At:</strong>{" "}
                {new Date(selectedRider.appliedAt).toLocaleString()}
              </p>
            </div>

            <div className="modal-action mt-6">
              <button
                className="btn btn-outline"
                onClick={() => setSelectedRider(null)}
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

export default PendingRiders;