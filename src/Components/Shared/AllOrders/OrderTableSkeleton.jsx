import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableFooter,
} from "@mui/material";

const OrderTableSkeleton = () => {
  const rows = Array.from({ length: 8 });

  return (
    <TableContainer component={Paper}>
      <Table aria-label="all orders skeleton table" size="small">
        <TableHead>
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
          {rows.map((_, idx) => (
            <TableRow key={idx}>
              {/* # */}
              <TableCell align="center" sx={{ py: 0.8 }}>
                <div className="relative w-6 h-4 bg-base-300 rounded overflow-hidden mx-auto">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>
              </TableCell>

              {/* Order Details */}
              <TableCell align="center" sx={{ py: 0.8 }}>
                <div className="flex flex-col gap-2">
                  <div className="relative w-48 h-4 bg-base-300 rounded overflow-hidden mx-auto">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  </div>
                  <div className="relative w-32 h-3 bg-base-300 rounded overflow-hidden mx-auto">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  </div>
                </div>
              </TableCell>

              {/* Customer */}
              <TableCell align="center" sx={{ py: 0.8 }}>
                <div className="flex flex-col gap-2">
                  <div className="relative w-32 h-4 bg-base-300 rounded overflow-hidden mx-auto">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  </div>
                  <div className="relative w-40 h-3 bg-base-300 rounded overflow-hidden mx-auto">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  </div>
                </div>
              </TableCell>

              {/* Items & Stores */}
              <TableCell align="center" sx={{ py: 0.8 }}>
                <div className="flex flex-col gap-2">
                  <div className="relative w-20 h-4 bg-base-300 rounded overflow-hidden mx-auto">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  </div>
                  <div className="relative w-20 h-3 bg-base-300 rounded overflow-hidden mx-auto">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  </div>
                </div>
              </TableCell>

              {/* Status */}
              <TableCell align="center" sx={{ py: 0.8 }}>
                <div className="relative w-24 h-6 bg-base-300 rounded-full overflow-hidden mx-auto">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>
              </TableCell>

              {/* Payment */}
              <TableCell align="center" sx={{ py: 0.8 }}>
                <div className="flex flex-col gap-2">
                  <div className="relative w-20 h-6 bg-base-300 rounded-full overflow-hidden mx-auto">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  </div>
                  <div className="relative w-24 h-3 bg-base-300 rounded overflow-hidden mx-auto">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  </div>
                </div>
              </TableCell>

              {/* Amount */}
              <TableCell align="center" sx={{ py: 0.8 }}>
                <div className="relative w-20 h-4 bg-base-300 rounded overflow-hidden mx-auto">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>
              </TableCell>

              {/* Actions */}
              <TableCell align="center" sx={{ py: 0.8 }}>
                <div className="relative w-8 h-8 bg-base-300 rounded-lg overflow-hidden mx-auto">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={8} align="right">
              <div className="flex items-center justify-end gap-3">
                {/* Rows per page skeleton */}
                <div className="relative w-24 h-6 bg-base-300 rounded overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>
                {/* Rows per page dropdown skeleton */}
                <div className="relative w-8 h-6 bg-base-300 rounded overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>

                {/* Page numbers skeleton */}
                <div className="relative w-16 h-6 bg-base-300 rounded overflow-hidden">
                  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                </div>

                {/* Pagination buttons skeleton */}
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="relative w-8 h-8 bg-base-300 rounded-full overflow-hidden"
                  >
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  </div>
                ))}
              </div>
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default OrderTableSkeleton;