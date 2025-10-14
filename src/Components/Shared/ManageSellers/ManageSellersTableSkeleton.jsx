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

const ManageSellersTableSkeleton = () => {
  const rows = Array.from({ length: 10 });

  return (
    <TableContainer component={Paper}>
      <Table aria-label="sellers skeleton table" size="small">
        <TableHead>
          <TableRow>
            <TableCell align="center" sx={{ py: 0.5 }}>#</TableCell>
            <TableCell align="center" sx={{ py: 0.5 }}>Name</TableCell>
            <TableCell align="center" sx={{ py: 0.5 }}>Store Address</TableCell>
            <TableCell align="center" sx={{ py: 0.5 }}>Region</TableCell>
            <TableCell align="center" sx={{ py: 0.5 }}>District</TableCell>
            <TableCell align="center" sx={{ py: 0.5 }}>Phone</TableCell>
            <TableCell align="center" sx={{ py: 0.5 }}>Stripe Account ID</TableCell>
            <TableCell align="center" sx={{ py: 0.5 }}>Applied At</TableCell>
            <TableCell align="center" sx={{ py: 0.5 }}>Status</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((_, idx) => (
            <TableRow key={idx}>
              {Array.from({ length: 9 }).map((__, cellIdx) => (
                <TableCell key={cellIdx} align="center" sx={{ py: 0.5 }}>
                  <div className="relative w-full h-4 bg-base-300 rounded overflow-hidden">
                    <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-gray-300 to-transparent" />
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colSpan={9} align="right">
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

export default ManageSellersTableSkeleton;