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

import DataTable from "../data-table"
import DataTableToolbar from "./data-table-toolbar"
import { readyTxnsColumns } from "./columns"
import { DataTablePagination } from "../data-table-pagination"
import { atom, useAtomValue, useSetAtom } from 'jotai'
import axios from "@/config/axios.new.config"

const dataAtom = atom([])
const readyTxnsQueryParamsAtom = atom({})
const pageInfoAtom = atom({})

export const readyTxnsPageAtom = atom(
  (get) => get(readyTxnsQueryParamsAtom),
  async (get, set, update) => {
    set(readyTxnsQueryParamsAtom, update)
    const params = get(readyTxnsQueryParamsAtom)

    const { data: response } = await axios.get(`/api/transaction/entry?page=${params.page}&size=${params.size}&status=READY`)
    const { totalPages, totalItems, isFirst, isLast, page, size } = response

    set(dataAtom, response.items)
    set(pageInfoAtom, { totalPages, totalItems, isFirst, isLast, page, size })
  }
)

export default function ReadyTxnsDataTable() {
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [columns, setColumns] = React.useState(readyTxnsColumns);
  const setQueryParams = useSetAtom(readyTxnsPageAtom)
  const data = useAtomValue(dataAtom)
  const pageInfo = useAtomValue(pageInfoAtom)

  React.useEffect(() => {
    setQueryParams({ page: 0, size: 10 })
  }, [])

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

  const Pagination = DataTablePagination(table)((pageNumber, pageSize) => setQueryParams({ page: pageNumber, size: Number(pageSize) }))

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

