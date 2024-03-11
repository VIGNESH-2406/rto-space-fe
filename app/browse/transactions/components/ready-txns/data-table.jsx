"use client"

import * as React from "react"

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Button } from "@/components/ui/button"

import { DataTablePagination } from "../all-txns/data-table-pagination"
import DataTable from "../data-table"
import DataTableToolbar from "./data-table-toolbar"
import { readyTxnsColumns } from "./columns"
import transactions from "../../data/transactions.json"

export default function ReadyTxnsDataTable() {
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [columns, setColumns] = React.useState(readyTxnsColumns);
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

  return (
    <div className="w-full">
      <DataTableToolbar table={table} />
      <DataTable table={table} />
      <div className="flex justify-center space-x-2 py-4">
        <Button variant="default" disabled={true} className="h-8">Process</Button>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}

