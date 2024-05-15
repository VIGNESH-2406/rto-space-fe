"use client"
import DataTable from "@/components/data-table";

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import columns from "./columns";
import DataTablePagination from "@/components/data-table-pagination";
import React from "react";
import axios from "@/config/axios.new.config";
import { DataTableToolbar } from "./data-table-toolbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LoaderCircle } from 'lucide-react';
import { atom, useAtomValue, useAtom } from 'jotai'
import { objectToQueryString } from "@/lib/utils";

export const completedTxnsQueryParamsAtom = atom({
  page: '0',
  size: '10',
  keyword: '',
  from: '',
  to: '' 
})

const apiAtom = atom(async (get) => {
    const params = get(completedTxnsQueryParamsAtom)

    let url = "/transactions?status=COMPLETED"
    const queryString = objectToQueryString(params)
    if (queryString.trim().length) {
      url += `&${queryString}`
    }

    const { data } = await axios.get(url)
    return data;
})

export default function CompletedTxnsDataTable() {
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [queryParams, setQueryParams] = useAtom(completedTxnsQueryParamsAtom)
  const { items, totalPages, totalItems, isFirst, isLast, page, size  } = useAtomValue(apiAtom)
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  const table = useReactTable({
    data: items ?? [],
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

  const updaterFunc = (pageNumber, pageSize) => setQueryParams({ ...queryParams, page: pageNumber + '', size: pageSize + '' })

  return <div className="space-y-2">
    <DataTableToolbar table={table} updaterFunc={setQueryParams} />
    <DataTable table={table} columns={columns} />
    <div className="flex justify-center space-x-2 py-2">
      <Button
        variant="default"
        disabled={!table.getFilteredSelectedRowModel().rows.length} className="h-8"
        onClick={async () => {
          const customerIds = table.getFilteredSelectedRowModel().rows.map(x => x.original.customerId)
          const entryIds = table.getFilteredSelectedRowModel().rows.map(x => x.original.entryId)
          const allEqual = customerIds.every(id => id === customerIds[0])
          if (!allEqual) {
            toast({
              variant: "destructive",
              title: "Invalid operation",
              description: "Invoice can only be generated for one customer at a time"
            })
            return
          }
          setIsLoading(true);
          try {
            const { data } = await axios.post('/transactions/pdf', {
              transactionIds: entryIds,
              customerId: customerIds[0]
            })
            toast({
              title: "Success",
              description: (
                <div className="w-[340px] flex justify-between">
                  <span>Invoice has been created</span>
                  <a
                    className="underline text-blue-600 hover:text-blue-800 visited:text-purple-600"
                    target="_blank"
                    href={data.url}
                  >Open file</a>
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
    <DataTablePagination table={table} updaterFunc={updaterFunc} pageInfo={{ totalPages, totalItems, isFirst, isLast, page, size  }} />
  </div>
}
