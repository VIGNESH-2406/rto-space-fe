"use client"

import * as React from "react"
import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { DataTablePagination } from "../data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"
import columns from "./columns"
import DataTable from "../data-table"
import { useAxios } from "@/config/axios.config"

export default function AllTxnsDataTable() {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState({})
  const [columnFilters, setColumnFilters] = React.useState([])
  const [sorting, setSorting] = React.useState([])
  const [pagedData, setPagedData] = React.useState(null)
  const [data, setData] = React.useState([])
  const [pageInfo, setPageInfo] = React.useState({})
  const axios = useAxios()

  async function getTransactions(pageNumber, pageSize) {
    const { data } = await axios.get(`/api/transaction/entry?page=${pageNumber}&size=${pageSize}`)
    setPagedData(data)
  }

  React.useEffect(() => {
    getTransactions(0, 10)
  }, [])

  React.useEffect(() => {
    if (!pagedData) return;
    setData(pagedData.items)
    setPageInfo({
      page: pagedData.page,
      size: pagedData.size,
      isFirst: pagedData.isFirst,
      isLast: pagedData.isLast,
      totalPages: pagedData.totalPages,
      totalItems: pagedData.totalItems
    })
  }, [pagedData])

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
    },
    enableRowSelection: true,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
  })

  function updater(pageNumber, pageSize) {
    getTransactions(pageNumber, Number(pageSize))
  }

  const Pagination = DataTablePagination(table)(updater)
  const Toolbar = DataTableToolbar(table)(updater)

  return (
    <div className="space-y-4">
      <Toolbar {...pageInfo} />
      <DataTable table={table} columns={columns} />
      <Pagination {...pageInfo} />
    </div>
  )
}
