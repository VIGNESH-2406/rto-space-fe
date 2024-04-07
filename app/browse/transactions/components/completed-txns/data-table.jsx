import DataTable from "../data-table";

import {
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { completedTxnsColumns } from "./columns";
import { DataTablePagination } from "../data-table-pagination";
import React from "react";
import { useAxios } from "@/config/axios.config";
import { DataTableToolbar } from "./data-table-toolbar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { LoaderCircle } from 'lucide-react';


function objectToQueryString(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return '';
  }

  const keyValuePairs = [];
  for (const key in obj) {
    if (typeof obj[key] === 'string' && obj[key].trim() !== '') {
      keyValuePairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
    }
  }

  return keyValuePairs.join('&');
}

export default function CompletedTxnsDataTable() {
  const [sorting, setSorting] = React.useState([])
  const [columnFilters, setColumnFilters] = React.useState([])
  const [columnVisibility, setColumnVisibility] = React.useState({})
  const [rowSelection, setRowSelection] = React.useState({})
  const [columns, setColumns] = React.useState(completedTxnsColumns);
  const [pagedData, setPagedData] = React.useState(null)
  const [data, setData] = React.useState([])
  const [pageInfo, setPageInfo] = React.useState({})
  const [searchParams, setSearchParams] = React.useState({ keyword: '', from: '', to: '' })
  const axios = useAxios()
  const { toast } = useToast();
  const [isLoading, setIsLoading] = React.useState(false);

  async function getTransactions(pageNumber, pageSize) {
    let url = `/api/transaction/entry?page=${pageNumber}&size=${pageSize}&status=COMPLETED`;
    const queryString = objectToQueryString(searchParams)
    if (queryString.trim().length) {
      url += `&${queryString}`
    }
    const { data } = await axios.get(url)
    setPagedData(data)
  }

  React.useEffect(() => {
    getTransactions(0, 10)
  }, [])

  React.useEffect(() => {
    getTransactions(0, 10)
  }, [searchParams])

  React.useEffect(() => {
    if (!pagedData) return;
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

  const Pagination = DataTablePagination(table)((pageNumber, pageSize) => getTransactions(pageNumber, Number(pageSize)))

  return <div className="space-y-4">
    <DataTableToolbar table={table} updaterFunc={setSearchParams} />
    <DataTable table={table} columns={columns} />
    <div className="flex justify-center space-x-2 py-4">
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
            const { data } = await axios.post('/api/transaction/pdf', {
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
          <LoaderCircle className="animate-spin" size={20} /> {/* Adjust size as needed */}
        </div>
      ) : (
        'Process'
      )}</Button>
    </div>
    <Pagination {...pageInfo} />
  </div>
}
