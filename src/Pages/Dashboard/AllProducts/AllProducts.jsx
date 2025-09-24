import { useState } from "react";
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
import Select from "react-select";
import useAxios from "../../../Hooks/useAxios";
import TablePaginationActions from "../../../lib/pagination";
import Loader from "../../../Components/Loader/Loader";

const searchOptions = [
  { value: "product name", label: "Search by Product Name" },
  { value: "seller email", label: "Search by Seller email" },
  { value: "storeId", label: "Search by StoreId" },
  { value: "storeName", label: "Search by Store name" },
];

const sortOptions = [
  { value: "priceAsc", label: "Price: Low to High" },
  { value: "priceDesc", label: "Price: High to Low" },
];

const AllProducts = () => {
  const [selectedProduct, setSelectedProduct] = useState(null);
  const axiosInstance = useAxios();
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [searchType, setSearchType] = useState(searchOptions[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sort, setSort] = useState(null);

  const { isPending, data } = useQuery({
    queryKey: [
      "products",
      searchTerm,
      searchTerm && searchType.value,
      page,
      sort,
      rowsPerPage,
    ],
    queryFn: async () => {
      const res = await axiosInstance.get(`/products`, {
        params: {
          searchType: searchType.value,
          search: searchTerm,
          page,
          sort,
          limit: rowsPerPage,
        },
      });
      return res.data;
    },
  });

  const products = data?.allProducts || [];
  const total = data?.total || 0;

  return (
    <div className="px-4">
      <h1 className="text-3xl sm:text-4xl text-gray-600 font-extrabold mb-6 text-center">
        All Products live on ShopSphere
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-2 items-center mb-6">
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
          options={sortOptions}
          value={sortOptions.find((o) => o.value === sort)}
          onChange={(selected) => {
            setSort(selected?.value || null);
            setPage(0);
          }}
          placeholder="Sort by Price"
          className="w-full"
          isClearable
        />
      </div>

      {isPending ? (
        <Loader></Loader>
      ) : products.length === 0 ? (
        <h1 className="text-gray-600 font-semibold text-center">
          There is no products on ShopSphere
        </h1>
      ) : (
        <TableContainer component={Paper}>
          <Table aria-label="pending sellers table" size="small">
            <TableHead>
              <TableRow>
                <TableCell align="center" sx={{ py: 0.5 }}>
                  #
                </TableCell>
                <TableCell align="center" sx={{ py: 0.5 }}>
                  Store ID
                </TableCell>
                <TableCell align="center" sx={{ py: 0.5 }}>
                  Store Name
                </TableCell>
                <TableCell align="center" sx={{ py: 0.5 }}>
                  Name
                </TableCell>
                <TableCell align="center" sx={{ py: 0.5 }}>
                  Price
                </TableCell>
                <TableCell align="center" sx={{ py: 0.5 }}>
                  Stock
                </TableCell>
                <TableCell align="center" sx={{ py: 0.5 }}>
                  Added At
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {products.map((p, i) => (
                <TableRow
                  className="cursor-pointer"
                  onClick={() => setSelectedProduct(p)}
                  key={p._id}
                >
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    {page * rowsPerPage + i + 1}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    {p.storeId}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    {p.storeName}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    {p.name}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    {p.price}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    {p.stock}
                  </TableCell>
                  <TableCell align="center" sx={{ py: 0.5 }}>
                    {new Date(p.addedAt).toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TablePagination
                  rowsPerPageOptions={[5, 10, 20, 30]}
                  colSpan={7}
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
      {selectedProduct && (
        <dialog id="riderDetailsModal" className="modal modal-open">
          <div className="modal-box max-w-3xl">
            <h3 className="font-bold text-2xl mb-5">Product Details</h3>
            <div className="space-y-2">
              <p>
                <strong>Store ID:</strong> {selectedProduct.storeId}
              </p>
              <p>
                <strong>Store Name:</strong> {selectedProduct.storeName}
              </p>
              <p>
                <strong>Seller Email:</strong> {selectedProduct.sellerEmail}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 items-center my-2">
                {selectedProduct.images.map((img, i) => (
                  <img
                    src={img}
                    key={i}
                    alt={selectedProduct.name}
                    className="h-36 md:h-32 border border-primary w-full rounded-sm object-cover"
                  />
                ))}
              </div>

              <p>
                <strong>Product Name:</strong> {selectedProduct.name}
              </p>
              <p>
                <strong>Price:</strong> {selectedProduct.price}
              </p>
              <p>
                <strong>Stock:</strong> {selectedProduct.stock}
              </p>
              <p>
                <strong>Discount:</strong> {selectedProduct.discount}
              </p>
              <p>
                <strong>Category(ies):</strong>{" "}
                <span className="capitalize">
                  {selectedProduct.category.join(", ")}
                </span>
              </p>
              {selectedProduct.size.length > 0 && (
                <p>
                  <strong>Size(s):</strong>{" "}
                  <span className="capitalize">
                    {selectedProduct.size.join(", ")}
                  </span>
                </p>
              )}
              {selectedProduct.color.length > 0 && (
                <p>
                  <strong>Color(s):</strong>{" "}
                  <span className="capitalize">
                    {selectedProduct.color.join(", ")}
                  </span>
                </p>
              )}
              <p>
                <strong>Added At:</strong>{" "}
                {new Date(selectedProduct.addedAt).toLocaleString()}
              </p>
              {selectedProduct.updatedAt && (
                <p>
                  <strong>Updated At:</strong>{" "}
                  {new Date(selectedProduct.updatedAt).toLocaleString()}
                </p>
              )}
              <p>
                <strong>Description:</strong> {selectedProduct.description}
              </p>
            </div>

            <div className="modal-action mt-6">
              <button
                className="btn btn-outline"
                onClick={() => setSelectedProduct(null)}
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

export default AllProducts;