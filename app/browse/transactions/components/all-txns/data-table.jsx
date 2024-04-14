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

import { DataTablePagination } from "@/components/data-table-pagination"
import { DataTableToolbar } from "./data-table-toolbar"
import columns from "./columns"
import DataTable from "../data-table"
import { atom, useAtomValue, useSetAtom, useAtom } from 'jotai'
import axios from "@/config/axios.new.config"
import { objectToQueryString } from "@/lib/utils"

const dataAtom = atom([])
const allTxnsQueryParamsAtom = atom({})
const pageInfoAtom = atom({})

export const allTxnsPageAtom = atom(
  (get) => get(allTxnsQueryParamsAtom),
  async (get, set, update) => {
    set(allTxnsQueryParamsAtom, update)
    const params = get(allTxnsQueryParamsAtom)

    let url = "/api/transactions?"
    const queryString = objectToQueryString(params)
    if (queryString.trim().length) {
      url += queryString
    }

    const { data: response } = await axios.get(url)
    const { totalPages, totalItems, isFirst, isLast, page, size } = response

    set(dataAtom, response.items)
    set(pageInfoAtom, { totalPages, totalItems, isFirst, isLast, page, size })
  }
)

export default function AllTxnsDataTable() {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [columnFilters, setColumnFilters] = React.useState([])
  const [sorting, setSorting] = React.useState([])
  const [queryParams, setQueryParams] = useAtom(allTxnsPageAtom)
  const data = useAtomValue(dataAtom)
  const pageInfo = useAtomValue(pageInfoAtom)

  React.useEffect(() => { setQueryParams({ page: '0', size: '10' }) }, [])

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
    setQueryParams({ ...queryParams, page: pageNumber + '', size: pageSize + '' })
  }

  const Pagination = DataTablePagination(table)(updater)

  return (
    <div className="space-y-4">
      <DataTableToolbar table={table} updaterFunc={setQueryParams} />
      <DataTable table={table} columns={columns} />
      <Pagination {...pageInfo} />
    </div>
  )
}
