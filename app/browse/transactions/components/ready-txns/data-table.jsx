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

// import { DataTablePagination } from "../all-txns/data-table-pagination"
import DataTable from "../data-table"
import DataTableToolbar from "./data-table-toolbar"
import { readyTxnsColumns } from "./columns"
import { DataTablePagination } from "../data-table-pagination"
import { useAxios } from "@/config/axios.config"

export default function ReadyTxnsDataTable() {
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [columns, setColumns] = React.useState(readyTxnsColumns);
  const [pagedData, setPagedData] = React.useState(null)
  const [data, setData] = React.useState([])
  const [pageInfo, setPageInfo] = React.useState({})
  const axios = useAxios()

  async function getTransactions(pageNumber, pageSize) {
    const { data } = await axios.get(`/api/transaction/entry?page=${pageNumber}&size=${pageSize}&status=READY`)
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

  const Pagination = DataTablePagination(table)((pageNumber, pageSize) => getTransactions(pageNumber, Number(pageSize)))

  return (
    <div className="w-full">
      <DataTableToolbar table={table} />
      <DataTable table={table} columns={columns} />
      <div className="flex justify-center space-x-2 py-4">
        <Button variant="default" disabled={true} className="h-8">Process</Button>
      </div>
      <Pagination {...pageInfo} />
    </div>
  )
}

