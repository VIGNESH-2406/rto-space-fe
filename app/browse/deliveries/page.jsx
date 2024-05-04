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

const dataAtom = atom([])
const deliveryQueryParamsAtom = atom({})
const pageInfoAtom = atom({})

export const deliveriesPageAtom = atom(
  (get) => get(deliveryQueryParamsAtom),
  async (get, set, update) => {
    set(deliveryQueryParamsAtom, update)
    const params = get(deliveryQueryParamsAtom)

    const { data: response } = await axios.get(`/api/deliveries?page=${params.page}&size=${params.size}`)
    const { totalPages, totalItems, isFirst, isLast, page, size } = response

    set(dataAtom, response.items)
    set(pageInfoAtom, { totalPages, totalItems, isFirst, isLast, page, size })
  }
)

export default function Deliveries() {
  const [rowSelection, setRowSelection] = React.useState({})
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [columnFilters, setColumnFilters] = React.useState([])
  const [sorting, setSorting] = React.useState([])
  const data = useAtomValue(dataAtom)
  const pageInfo = useAtomValue(pageInfoAtom)
  const setDeliveryQueryParams = useSetAtom(deliveriesPageAtom)

  React.useEffect(() => { setDeliveryQueryParams({ page: 0, size: 10 }) }, [])

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

  const updaterFunc = (page, size) => setDeliveryQueryParams({ page: page, size: size })

  return <>
    <div className="flex items-center px-4 py-3">
      <h1 className="text-2xl font-bold">Deliveries</h1>
    </div>
    <div className="container mx-auto py-10 space-y-4">
      <DataTable columns={columns} table={table} />
      <DataTablePagination table={table} updaterFunc={updaterFunc} pageInfo={pageInfo} />
    </div>
  </>
}
