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

import DataTable from "@/components/data-table"
import DataTableToolbar from "./data-table-toolbar"
import columns from "./columns"
import { DataTablePagination } from "@/components/data-table-pagination"
import { atom, useAtomValue, useSetAtom } from 'jotai'
import axios from "@/config/axios.new.config"
import { objectToQueryString } from "@/lib/utils"
import { useToast } from "@/components/ui/use-toast"
import { LoaderCircle } from 'lucide-react';

const dataAtom = atom([])
const readyTxnsQueryParamsAtom = atom({})
const pageInfoAtom = atom({})

export const readyTxnsPageAtom = atom(
  (get) => get(readyTxnsQueryParamsAtom),
  async (get, set, update) => {
    set(readyTxnsQueryParamsAtom, update)
    const params = get(readyTxnsQueryParamsAtom)

    let url = '/api/transactions?status=READY'
    const queryString = objectToQueryString(params)
    if (queryString.trim().length) {
      url += `&${queryString}`
    }

    const { data: response } = await axios.get(url)
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
  const setQueryParams = useSetAtom(readyTxnsPageAtom)
  const [deliveryAgent, setDeliveryAgent] = React.useState()
  const data = useAtomValue(dataAtom)
  const pageInfo = useAtomValue(pageInfoAtom)
  const [isLoading, setIsLoading] = React.useState(false)
  const { toast } = useToast();

  React.useEffect(() => {
    setQueryParams({ page: '0', size: '10' })
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

  const Pagination = DataTablePagination(table)((pageNumber, pageSize) => setQueryParams({ page: pageNumber + '', size: pageSize + '' }))

  return (
    <div className="space-y-2">
      <DataTableToolbar updaterFunc={setQueryParams} setDeliveryAgent={setDeliveryAgent} />
      <DataTable table={table} columns={columns} />
      <div className="flex justify-center space-x-2 py-2">
        <Button
          variant="default"
          disabled={!table.getFilteredSelectedRowModel().rows.length || !deliveryAgent}
          className="h-8"
          onClick={async () => {
            const rtos = table.getFilteredSelectedRowModel().rows.map(x => x.original.toRTO)
            const entryIds = table.getFilteredSelectedRowModel().rows.map(x => x.original.entryId)
            const allEqual = rtos.every(rto => rto === rtos[0])
            if (!allEqual) {
              toast({
                variant: "destructive",
                title: "Invalid operation",
                description: "Delivery can only be sent to the same rto at a time"
              })
              return
            }
            setIsLoading(true);
            try {
              const { data } = await axios.post('/api/transactions/deliverypdf', {
                transactionIds: entryIds,
                toRTO: rtos[0],
                deliveryBy: deliveryAgent
              })
              toast({
                title: "Success",
                description: (
                  <div className="w-[340px] flex justify-between">
                    <span>Delivery has been created</span>
                  </div>
                ),
              })
            } catch (err) {
              toast({
                variant: "destructive",
                title: "Oops! Something went wrong",
                description: "There was a problem with your request"
              })
            } finally {
              setIsLoading(false)
            }
          }}
        > {isLoading ? (
          <div className="flex items-center">
            <span className="mr-2">Processing...</span>
            <LoaderCircle className="animate-spin" size={20} />
          </div>
        ) : (
          'Process'
        )}</Button>
      </div>
      <Pagination {...pageInfo} />
    </div>
  )
}

