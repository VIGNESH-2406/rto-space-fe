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

import { DataTablePagination } from "./data-table-pagination-new"
import { DataTableToolbar } from "./data-table-toolbar"
import allTxnsColumns from "./columns"
import DataTable from "../data-table"
import pageOne from "../../data/page1.json"
import pageTwo from "../../data/page2.json"
import pageThree from "../../data/page3.json"

export default function AllTxnsDataTable() {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] =
    React.useState({})
  const [columnFilters, setColumnFilters] = React.useState([])
  const [sorting, setSorting] = React.useState([])
  const [columns, setColumns] = React.useState(allTxnsColumns)
  const [pagedData, setPagedData] = React.useState(pageOne)
  const [data, setData] = React.useState([])
  const [pageInfo, setPageInfo] = React.useState({})

  React.useEffect(() => {
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

  function getTransactions(pageNumber, pageSize) {
    console.log("getTransactions", pageNumber, pageSize)
    if (pageSize === 20) {
      console.log("returning page three")
      return pageThree
    }
    if (pageNumber === 0) {
      return pageOne
    }
    return pageTwo
  }

  const Pagination = DataTablePagination(table)((pageNumber, pageSize) => setPagedData(getTransactions(pageNumber, Number(pageSize))))

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} />
      <DataTable table={table} columns={columns} />
      <Pagination {...pageInfo} />
    </div>
  )
}
