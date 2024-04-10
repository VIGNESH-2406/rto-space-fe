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
import { atom, useAtomValue, useSetAtom } from 'jotai'
import axios from "@/config/axios.new.config"

const dataAtom = atom([])
const allTxnsQueryParamsAtom = atom({})
const pageInfoAtom = atom({})

export const allTxnsPageAtom = atom(
  (get) => get(allTxnsQueryParamsAtom),
  async (get, set, update) => {
    set(allTxnsQueryParamsAtom, update)
    const params = get(allTxnsQueryParamsAtom)

    const { data: response } = await axios.get(`/api/transaction/entry?page=${params.page}&size=${params.size}`)
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
  const setPagedData = useSetAtom(allTxnsPageAtom)
  const data = useAtomValue(dataAtom)
  const pageInfo = useAtomValue(pageInfoAtom)

  React.useEffect(() => { setPagedData({ page: 0, size: 10 }) }, [])

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
    setPagedData({ page: pageNumber, size: Number(pageSize) })
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
