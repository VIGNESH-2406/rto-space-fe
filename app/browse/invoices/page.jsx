"use client"
import DataTable from "@/components/data-table";
import columns from "./columns";

import {
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import React from "react";


import { atom, useAtomValue, useSetAtom } from 'jotai'
import axios from "@/config/axios.new.config"
import DataTablePagination from "@/components/data-table-pagination";

export const invoicesQueryParamsAtom = atom({
  page: '0',
  size: '10'
})

const apiAtom = atom(async (get) => {
  const params = get(invoicesQueryParamsAtom)

  const { data } = await axios.get(`/invoices?page=${params.page}&size=${params.size}`)
  return data
})

export default function Invoices() {

  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [columnFilters, setColumnFilters] = React.useState([])
  const [sorting, setSorting] = React.useState([])
  const { items, totalPages, totalItems, isFirst, isLast, page, size } = useAtomValue(apiAtom)
  const setInvoiceQueryParams = useSetAtom(invoicesQueryParamsAtom)


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

  const updaterFunc = (page, size) => setInvoiceQueryParams({ page: page, size: size })

  return <>
    <div className="flex items-center px-4 py-3">
      <h1 className="text-2xl font-bold">Invoices</h1>
    </div>
    <div className="container mx-auto py-10 space-y-4">
      <DataTable columns={columns} table={table} />
      <DataTablePagination table={table} updaterFunc={updaterFunc} pageInfo={{ totalPages, totalItems, isFirst, isLast, page, size }} />
    </div>
  </>
}
