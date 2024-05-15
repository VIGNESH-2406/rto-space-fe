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

import DataTablePagination from "@/components/data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"
import columns from "./columns"
import DataTable from "@/components/data-table"
import { atom, useAtomValue, useAtom } from 'jotai'
import axios from "@/config/axios.new.config"
import { objectToQueryString } from "@/lib/utils"

export const allTxnsQueryParamsAtom = atom({
  page: '0',
  size: '10'
})

const apiAtom = atom(async (get) => {
  const params = get(allTxnsQueryParamsAtom);

  let url = "/transactions?"
  const queryString = objectToQueryString(params)
  if (queryString.trim().length) {
    url += queryString
  }

  const { data } = await axios.get(url)
  return data;
})

export default function AllTxnsDataTable() {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [columnFilters, setColumnFilters] = React.useState([])
  const [sorting, setSorting] = React.useState([])
  const [queryParams, setQueryParams] = useAtom(allTxnsQueryParamsAtom)
  const { items, totalPages, totalItems, isFirst, isLast, page, size } = useAtomValue(apiAtom)

  const table = useReactTable({
    data: items ?? [],
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
    setQueryParams({ ...queryParams, page: pageNumber + '', size: pageSize + '' })
  }

  return (
    <div className="space-y-2">
      <DataTableToolbar table={table} updaterFunc={setQueryParams} />
      <DataTable table={table} columns={columns} />
      <div className="py-2"></div>
      <DataTablePagination table={table} updaterFunc={updater} pageInfo={{ totalPages, totalItems, isFirst, isLast, page, size }} />
    </div>
  )
}
