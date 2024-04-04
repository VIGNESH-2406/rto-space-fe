import DataTable from "../data-table";

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import transactions from "../../data/transactions.json"
import { completedTxnsColumns } from "./columns";
import { DataTablePagination } from "./data-table-pagination";
import React from "react";
import { DataTableToolbar } from "./data-table-toolbar";

export default function CompletedTxnsDataTable() {
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [columns, setColumns] = React.useState(completedTxnsColumns);
  const [data, setData] = React.useState(transactions);

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return <div className="space-y-4">
    <DataTableToolbar table={table} />
    <DataTable table={table} columns={columns} />
    <DataTablePagination table={table} />
  </div>
}
