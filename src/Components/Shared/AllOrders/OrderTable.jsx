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
import { formatDate } from "../../../lib/formatDate";
import { FiEye } from "react-icons/fi";

const OrderTable = ({
  orders,
  getOrderMetrics,
  page,
  rowsPerPage,
  formatCurrency,
  setSelectedOrder,
  total,
  setPage,
  setRowsPerPage,
  getStatusColor,
  getPaymentColor,
}) => {
  return (
    <TableContainer component={Paper}>
      <Table aria-label="all orders table" size="small">
        <TableHead className="bg-gray-200/70">
          <TableRow>
            <TableCell
              align="center"
              sx={{ py: 1, fontWeight: "bold", fontSize: "17px" }}
            >
              #
            </TableCell>
            <TableCell
              align="center"
              sx={{ py: 1, fontWeight: "bold", fontSize: "17px" }}
            >
              Order Details
            </TableCell>
            <TableCell
              align="center"
              sx={{ py: 1, fontWeight: "bold", fontSize: "17px" }}
            >
              Customer
            </TableCell>
            <TableCell
              align="center"
              sx={{ py: 1, fontWeight: "bold", fontSize: "17px" }}
            >
              Items & Stores
            </TableCell>
            <TableCell
              align="center"
              sx={{ py: 1, fontWeight: "bold", fontSize: "17px" }}
            >
              Status
            </TableCell>
            <TableCell
              align="center"
              sx={{ py: 1, fontWeight: "bold", fontSize: "17px" }}
            >
              Payment
            </TableCell>
            <TableCell
              align="center"
              sx={{ py: 1, fontWeight: "bold", fontSize: "17px" }}
            >
              Amount
            </TableCell>
            <TableCell
              align="center"
              sx={{ py: 1, fontWeight: "bold", fontSize: "17px" }}
            >
              Actions
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {orders.map((order, i) => {
            const { itemsCount, storesCount } = getOrderMetrics(order);

            return (
              <TableRow
                className="bg-gray-100/60 hover:bg-gray-100"
                key={order._id}
              >
                {/* Order Details */}
                <TableCell align="center" sx={{ py: 0.8 }}>
                  {page * rowsPerPage + i + 1}
                </TableCell>
                <TableCell align="center" sx={{ py: 0.8 }}>
                  <div className="flex flex-col">
                    <span className="text-sm font-mono font-medium text-gray-900">
                      {order._id.toUpperCase()}
                    </span>
                    <span className="text-xs text-gray-700 mt-1">
                      {formatDate(order.createdAt)}
                    </span>
                  </div>
                </TableCell>

                {/* Customer */}
                <TableCell align="center" sx={{ py: 0.8 }}>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-gray-900">
                      {order.shippingAddress.name}
                    </span>
                    <span className="text-xs font-medium text-gray-700 mt-1">
                      {order.customerEmail}
                    </span>
                  </div>
                </TableCell>

                {/* Items & Stores */}
                <TableCell align="center" sx={{ py: 0.8 }}>
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-900">
                      {itemsCount} {itemsCount === 1 ? "item" : "items"}
                    </span>
                    <span className="text-xs text-gray-700 mt-1">
                      {storesCount} {storesCount === 1 ? "store" : "stores"}
                    </span>
                  </div>
                </TableCell>

                {/* Status */}
                <TableCell align="center" sx={{ py: 0.8 }}>
                  <span
                    className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full border capitalize ${getStatusColor(
                      order.orderStatus
                    )}`}
                  >
                    {order.orderStatus}
                  </span>
                </TableCell>

                {/* Payment */}
                <TableCell align="center" sx={{ py: 0.8 }}>
                  <div className="flex flex-col">
                    <span
                      className={`inline-flex px-2.5 py-1 text-xs font-semibold rounded-full border w-fit mx-auto capitalize ${getPaymentColor(
                        order.paymentStatus
                      )}`}
                    >
                      {order.paymentStatus}
                    </span>
                    <span className="text-xs text-gray-700 mt-1 capitalize">
                      {order.paymentMethod.replace(/_/g, " ")}
                    </span>
                  </div>
                </TableCell>

                {/* Amount */}
                <TableCell align="center" sx={{ py: 0.8 }}>
                  <span className="text-sm font-bold text-gray-900">
                    {formatCurrency(order.totalAmount)}
                  </span>
                </TableCell>

                {/* Actions */}
                <TableCell align="center" sx={{ py: 0.8 }}>
                  <button
                    onClick={() => setSelectedOrder(order)}
                    className="p-2 text-blue-600 hover:bg-blue-200/75 rounded-lg transition-colors cursor-pointer"
                    title="View Details"
                  >
                    <FiEye size={20} />
                  </button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>

        <TableFooter className="bg-gray-200/70">
          <TableRow>
            <TablePagination
              rowsPerPageOptions={[5, 10, 20, 30, 50, 100]}
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
  );
};

export default OrderTable;