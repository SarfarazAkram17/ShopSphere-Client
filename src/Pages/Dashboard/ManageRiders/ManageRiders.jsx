import TablePaginationActions from "../../../lib/pagination";
import { Switch } from "antd";
import Swal from "sweetalert2";
import { toast } from "react-toastify";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
import ManageRidersSearchAndFilter from "../../../Components/Shared/ManageRiders/ManageRidersSearchAndFilter";
import ManageRidersTableSkeleton from "../../../Components/Shared/ManageRiders/ManageRidersTableSkeleton";

const searchOptions = [
  { value: "name", label: "Search by Name" },
  { value: "email", label: "Search by Email" },
];

const ManageRiders = () => {
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
      "riders",
      searchTerm,
      searchTerm && searchType.value,
      page,
      selectedRegion,
      selectedDistrict,
      rowsPerPage,
    ],
    queryFn: async () => {
      const res = await axiosSecure.get(`/riders`, {
        params: {
          email: userEmail,
          page,
          limit: rowsPerPage,
          searchType: searchType.value,
          search: searchTerm,
          region: selectedRegion?.value || "",
          district: selectedDistrict?.value || "",
        },
      });
      return res.data;
    },
  });

  const riders = data?.riders || [];
  const total = data?.total || 0;

  const handleStatusSwitch = async (e, id, currentStatus, email) => {
    e.stopPropagation();

    const confirm = await Swal.fire({
      title: `Changing Rider Status?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    const newStatus = currentStatus === "active" ? "deactive" : "active";
    try {
      await axiosSecure.patch(`/riders/${id}/status?email=${userEmail}`, {
        status: newStatus,
        email,
      });
      refetch();
      toast.success(`Rider status updated to ${newStatus}`);
    } catch (err) {
      Swal.fire("Error", "Could not update rider status", err.message);
    }
  };

  return (
    <div>
      <h1 className="text-3xl sm:text-4xl text-gray-600 font-extrabold mb-6 text-center">
        Manage Riders
      </h1>

      <ManageRidersSearchAndFilter
        searchOptions={searchOptions}
        searchType={searchType}
        setSearchType={setSearchType}
        setPage={setPage}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        regions={regions}
        selectedRegion={selectedRegion}
        setSelectedRegion={setSelectedRegion}
        districts={districts}
        selectedDistrict={selectedDistrict}
        setSelectedDistrict={setSelectedDistrict}
      ></ManageRidersSearchAndFilter>

      {isPending ? (
        <ManageRidersTableSkeleton></ManageRidersTableSkeleton>
      ) : riders.length === 0 ? (
        <h1 className="text-gray-600 font-semibold text-center">
          There is no Rider
        </h1>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="riders table" size="small">
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
                  Status
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {riders.map((r, i) => (
                <TableRow
                  className="cursor-pointer"
                  onClick={() => setSelectedRider(r)}
                  key={r._id}
                >
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    {page * rowsPerPage + i + 1}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    {r.name}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    {r.region}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    {r.district}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    {r.phone}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    {r.stripeAccountId}
                  </TableCell>
                  <TableCell
                    className="truncate max-w-[100px]"
                    title={new Date(r.appliedAt).toLocaleString()}
                    align="center"
                    sx={{ py: 0.5 }}
                  >
                    {new Date(r.appliedAt).toLocaleString()}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    <Switch
                      checked={r.status === "active"}
                      onChange={(checked, e) =>
                        handleStatusSwitch(e, r._id, r.status, r.email)
                      }
                      checkedChildren="Active"
                      unCheckedChildren="Deactive"
                      style={{
                        backgroundColor:
                          r.status === "active" ? "#52c41a" : "#f5222d",
                        borderColor:
                          r.status === "active" ? "#52c41a" : "#f5222d",
                      }}
                    />
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
              {selectedRider.activeAt && (
                <p>
                  <strong>Active At:</strong>{" "}
                  {new Date(selectedRider.activeAt).toLocaleString()}
                </p>
              )}
              {selectedRider.deactiveAt && (
                <p>
                  <strong>Deactive At:</strong>{" "}
                  {new Date(selectedRider.deactiveAt).toLocaleString()}
                </p>
              )}
              <p className="capitalize">
                <strong>Work Status:</strong> {selectedRider.work_status}
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

export default ManageRiders;