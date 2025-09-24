import useAuth from "../../../Hooks/useAuth";
import { useEffect, useState } from "react";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import { useQuery } from "@tanstack/react-query";
import Select from "react-select";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TablePaginationActions from "../../../lib/pagination";
import Loader from "../../../Components/Loader/Loader";
import { Switch } from "antd";
import Swal from "sweetalert2";
import { toast } from "react-toastify";

const searchOptions = [
  { value: "name", label: "Search by Name" },
  { value: "email", label: "Search by Email" },
];

const ManageSellers = () => {
  const { userEmail } = useAuth();
  const [selectedSeller, setSelectedSeller] = useState(null);
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
      "sellers",
      searchTerm,
      searchTerm && searchType.value,
      page,
      selectedRegion,
      selectedDistrict,
      rowsPerPage,
    ],
    queryFn: async () => {
      const res = await axiosSecure.get(`/sellers`, {
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

  const sellers = data?.sellers || [];
  const total = data?.total || 0;

  const handleSwitchChange = async (e, id, currentStatus, email) => {
    e.stopPropagation();

    const confirm = await Swal.fire({
      title: `Changing Seller Status?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    const newStatus = currentStatus === "active" ? "deactive" : "active";
    try {
      await axiosSecure.patch(`/sellers/${id}/status?email=${userEmail}`, {
        status: newStatus,
        email,
      });
      refetch();
      toast.success(`Seller status updated to ${newStatus}`);
    } catch (err) {
      Swal.fire("Error", "Could not update seller status", err.message);
    }
  };

  return (
    <div className="px-4">
      <h1 className="text-3xl sm:text-4xl text-gray-600 font-extrabold mb-6 text-center">
        Manage Sellers
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
      ) : sellers.length === 0 ? (
        <h1 className="text-gray-600 font-semibold text-center">
          There is no Seller
        </h1>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="sellers table" size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ py: 0.5 }}>
                  #
                </TableCell>
                <TableCell align="center" sx={{ py: 0.5 }}>
                  Name
                </TableCell>
                <TableCell align="center" sx={{ py: 0.5 }}>
                  Store Address
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
              {sellers.map((s, i) => (
                <TableRow
                  className="cursor-pointer"
                  onClick={() => setSelectedSeller(s)}
                  key={s._id}
                >
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    {page * rowsPerPage + i + 1}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    {s.name}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    {s.storeAddress}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    {s.region}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    {s.district}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    {s.phone}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    {s.stripeAccountId}
                  </TableCell>
                  <TableCell
                    className="truncate max-w-[100px]"
                    title={new Date(s.appliedAt).toLocaleString()}
                    align="center"
                    sx={{ py: 0.5 }}
                  >
                    {new Date(s.appliedAt).toLocaleString()}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    <Switch
                      checked={s.status === "active"}
                      onChange={(checked, e) =>
                        handleSwitchChange(e, s._id, s.status, s.email)
                      }
                      checkedChildren="Active"
                      unCheckedChildren="Deactive"
                      style={{
                        backgroundColor:
                          s.status === "active" ? "#52c41a" : "#f5222d",
                        borderColor:
                          s.status === "active" ? "#52c41a" : "#f5222d",
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
                  colSpan={9}
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

      {/* Modal for viewing seller details */}
      {selectedSeller && (
        <dialog id="sellerDetailsModal" className="modal modal-open">
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
                <strong>Age:</strong> {selectedSeller.age} years
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
                className="h-40 rounded-md w-full"
              />
              <p>
                <strong>Store Name:</strong> {selectedSeller.storeName}
              </p>
              <p>
                <strong>Product Categories:</strong>{" "}
                <span className="capitalize">
                  {selectedSeller.categories
                    .map((category) => category)
                    .join(", ")}
                </span>
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

export default ManageSellers;