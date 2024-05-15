"use client"

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
import columns from "./columns";
import { atom, useSetAtom, useAtomValue } from 'jotai'
import DataTablePagination from "@/components/data-table-pagination";
import DataTable from "@/components/data-table";
import axios from '@/config/axios.new.config'

const deliveryQueryParamsAtom = atom({ page: '0', size: '10' })

const apiAtom = atom(async (get) => {
    const params = get(deliveryQueryParamsAtom)
    const { data } = await axios.get(`/deliveries?page=${params.page}&size=${params.size}`)
    return data
})

export default function Deliveries() {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [columnFilters, setColumnFilters] = React.useState([])
  const [sorting, setSorting] = React.useState([])
  const { items, totalPages, totalItems, isFirst, isLast, page, size } = useAtomValue(apiAtom)
  const setQueryParams = useSetAtom(deliveryQueryParamsAtom)

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

  const updaterFunc = (page, size) => setQueryParams({ page: page, size: size })

  return <>
    <div className="flex items-center px-4 py-3">
      <h1 className="text-2xl font-bold">Deliveries</h1>
    </div>
    <div className="container mx-auto py-10 space-y-4">
      <DataTable columns={columns} table={table} />
      <DataTablePagination 
        table={table} 
        updaterFunc={updaterFunc}
        pageInfo={{ totalPages, totalItems, isFirst, isLast, page, size }}
      />
    </div>
  </>
}
