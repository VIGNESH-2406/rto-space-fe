"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { DataTableRowActions } from "./data-table-row-actions"

const columns = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "invoiceNo",
    header: () => (
      <div>Invoice no.</div>
    ),
    cell: ({ row }) => <div className="w-[120px]">{row.getValue("invoiceNo")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "customerName",
    header: () => (
      <div>Customer name</div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("customerName")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "totalVehicles",
    header: () => (
      <div>Total vehicles</div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[120px] items-center">
          <span>{row.getValue("totalVehicles")}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "totalAmount",
    header: () => (
      <div>Total amount</div>
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("totalAmount"))

      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "INR",
      }).format(amount)

      return (
        <div className="flex items-center">
          <span className="font-medium">{formatted}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]

export default columns;
