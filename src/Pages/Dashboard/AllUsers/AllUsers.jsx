import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useAxiosSecure from "../../../Hooks/useAxiosSecure";
import useAuth from "../../../Hooks/useAuth";
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
import AllUsersSearchAndFilter from "../../../Components/Shared/AllUsers/AllUsersSearchAndFilter";
import AllUsersTableSkeleton from "../../../Components/Shared/AllUsers/AllUsersTableSkeleton";

const searchOptions = [
  { value: "name", label: "Search by Name" },
  { value: "email", label: "Search by Email" },
];

const roleOptions = [
  { value: "", label: "All Roles" },
  { value: "customer", label: "Customer" },
  { value: "rider", label: "Rider" },
  { value: "admin", label: "Admin" },
  { value: "seller", label: "Seller" },
];

const AllUsers = () => {
  const axiosSecure = useAxiosSecure();
  const { userEmail } = useAuth();

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchType, setSearchType] = useState(searchOptions[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState(roleOptions[0]);
  const [page, setPage] = useState(0);

  const { data, isPending, refetch } = useQuery({
    queryKey: [
      "users",
      searchTerm && searchType.value,
      searchTerm,
      roleFilter?.value || "",
      page,
      rowsPerPage,
    ],
    queryFn: async () => {
      const res = await axiosSecure.get(`/users`, {
        params: {
          email: userEmail,
          page,
          limit: rowsPerPage,
          searchType: searchType.value,
          search: searchTerm,
          role: roleFilter?.value || "",
        },
      });
      return res.data;
    },
    keepPreviousData: true,
  });

  const users = data?.allUsers || [];
  const total = data?.total || 0;

  useEffect(() => {
    refetch();
  }, [searchTerm, searchType, roleFilter, rowsPerPage, page, refetch]);

  return (
    <div className="px-4">
      <h2 className="text-2xl font-bold mb-4 text-center text-primary">
        All Users
      </h2>

      {/* Filters */}
      <AllUsersSearchAndFilter
        searchOptions={searchOptions}
        searchType={searchType}
        setSearchType={setSearchType}
        setPage={setPage}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        roleOptions={roleOptions}
        roleFilter={roleFilter}
        setRoleFilter={setRoleFilter}
      ></AllUsersSearchAndFilter>

      {/* Table */}
      {isPending ? (
        <AllUsersTableSkeleton />
      ) : users.length === 0 ? (
        <p className="text-center mt-10 text-gray-600 text-lg font-medium">
          No users found.
        </p>
      ) : (
        <>
          <TableContainer component={Paper}>
            <Table aria-label="all users table" size="small">
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    #
                  </TableCell>
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    Photo
                  </TableCell>
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    Name
                  </TableCell>
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    Email
                  </TableCell>
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    Method
                  </TableCell>
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    Role
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {users.map((user, i) => (
                  <TableRow key={user._id}>
                    <TableCell align="center" sx={{ py: 0.5 }}>
                      {page * rowsPerPage + i + 1}
                    </TableCell>
                    <TableCell align="center" sx={{ py: 0.5 }}>
                      <img
                        className="h-11 object-cover w-11 mx-auto rounded-full"
                        src={user.photo}
                        alt={user.name}
                      />
                    </TableCell>
                    <TableCell align="center" sx={{ py: 0.5 }}>
                      {user.name}
                    </TableCell>
                    <TableCell align="center" sx={{ py: 0.5 }}>
                      {user.email}
                    </TableCell>
                    <TableCell align="center" sx={{ py: 0.5 }}>
                      {user.providerId ? "Google" : "Email/Password"}
                    </TableCell>
                    <TableCell
                      align="center"
                      className="capitalize"
                      sx={{ py: 0.5 }}
                    >
                      {user.role}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>

              <TableFooter>
                <TableRow>
                  <TablePagination
                    rowsPerPageOptions={[5, 10, 20, 30]}
                    colSpan={6}
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
        </>
      )}
    </div>
  );
};

export default AllUsers;