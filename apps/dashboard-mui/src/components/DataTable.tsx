import { useState, useMemo } from "react";
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  createColumnHelper,
  flexRender,
  type SortingState,
  type PaginationState,
} from "@tanstack/react-table";
import {
  Box,
  Chip,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import type {
  DashboardRow,
  ProductStatus,
} from "@shared/src/types/dashboard.types";
import { useTranslations } from "@shared/src/hooks/useTranslations";

interface Props {
  data: DashboardRow[];
}

const columnHelper = createColumnHelper<DashboardRow>();

const STATUS_COLORS: Record<ProductStatus, "success" | "default" | "warning"> =
  {
    active: "success",
    inactive: "default",
    pending: "warning",
  };

const DataTable = ({ data }: Props) => {
  const { t } = useTranslations("dashboard");
  const [sorting, setSorting] = useState<SortingState>([]);
  const [globalFilter, setGlobalFilter] = useState("");
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  });

  const columns = useMemo(
    () => [
      columnHelper.accessor("name", {
        header: t("table.columns.name"),
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("category", {
        header: t("table.columns.category"),
        cell: (info) => info.getValue(),
      }),
      columnHelper.accessor("status", {
        header: t("table.columns.status"),
        cell: (info) => (
          <Chip
            label={t(`table.status.${info.getValue()}`)}
            color={STATUS_COLORS[info.getValue()]}
            size="small"
          />
        ),
      }),
      columnHelper.accessor("revenue", {
        header: t("table.columns.revenue"),
        cell: (info) =>
          new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            maximumFractionDigits: 0,
          }).format(info.getValue()),
      }),
      columnHelper.accessor("units", {
        header: t("table.columns.units"),
        cell: (info) => new Intl.NumberFormat("en-US").format(info.getValue()),
      }),
      columnHelper.accessor("createdAt", {
        header: t("table.columns.createdAt"),
        cell: (info) => info.getValue(),
      }),
    ],
    [t],
  );

  const table = useReactTable({
    data,
    columns,
    state: { sorting, globalFilter, pagination },
    onSortingChange: setSorting,
    onGlobalFilterChange: setGlobalFilter,
    onPaginationChange: setPagination,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  const rowCount = table.getFilteredRowModel().rows.length;
  const { pageIndex, pageSize } = table.getState().pagination;

  return (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Typography variant="h6">{t("table.title")}</Typography>
        <TextField
          size="small"
          placeholder={t("table.searchPlaceholder")}
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            },
          }}
          sx={{ width: 260 }}
        />
      </Box>

      <TableContainer component={Paper} variant="outlined">
        <Table role="grid" size="small">
          <TableHead>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  const sorted = header.column.getIsSorted();
                  return (
                    <TableCell
                      key={header.id}
                      scope="col"
                      onClick={header.column.getToggleSortingHandler()}
                      sx={{
                        cursor: header.column.getCanSort()
                          ? "pointer"
                          : "default",
                        userSelect: "none",
                        fontWeight: 600,
                      }}
                      aria-sort={
                        sorted === "asc"
                          ? "ascending"
                          : sorted === "desc"
                            ? "descending"
                            : "none"
                      }
                    >
                      <Box display="flex" alignItems="center" gap={0.5}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                        {sorted === "asc" && (
                          <ArrowUpwardIcon sx={{ fontSize: 14 }} />
                        )}
                        {sorted === "desc" && (
                          <ArrowDownwardIcon sx={{ fontSize: 14 }} />
                        )}
                      </Box>
                    </TableCell>
                  );
                })}
              </TableRow>
            ))}
          </TableHead>
          <TableBody>
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id} hover>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mt={1}
        px={1}
      >
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2">
            {t("table.pagination.rowsPerPage")}
          </Typography>
          <Select
            size="small"
            value={pageSize}
            onChange={(e) =>
              setPagination((prev) => ({
                ...prev,
                pageSize: Number(e.target.value),
                pageIndex: 0,
              }))
            }
            sx={{ fontSize: 14 }}
          >
            {[10, 25, 50].map((size) => (
              <MenuItem key={size} value={size}>
                {size}
              </MenuItem>
            ))}
          </Select>
        </Box>
        <Box display="flex" alignItems="center" gap={1}>
          <Typography variant="body2">
            {pageIndex * pageSize + 1}–
            {Math.min((pageIndex + 1) * pageSize, rowCount)}{" "}
            {t("table.pagination.of")} {rowCount}
          </Typography>
          <IconButton
            size="small"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            ‹
          </IconButton>
          <IconButton
            size="small"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            ›
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default DataTable;
