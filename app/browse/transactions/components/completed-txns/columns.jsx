"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { DataTableColumnHeader } from "../all-txns/data-table-column-header"
import { DataTableRowActions } from "../all-txns/data-table-row-actions"
import { Button } from "@/components/ui/button"

const completedTxnsColumns = [
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
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "entryId",
    header: () => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent">
        <span>Id</span>
      </Button>
    ),
    cell: ({ row }) => <div className="w-[120px] font-medium">{row.getValue("entryId")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "customerName",
    header: () => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent">
        <span>Customer name</span>
      </Button>
    ),
    cell: ({ row }) => <div className="w-[120px]">{row.getValue("customerName")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "vehicleNo",
    header: () => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent">
        <span>Vehicle no.</span>
      </Button>
    ),
    cell: ({ row }) => {

      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("vehicleNo")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "toRTO",
    header: () => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent">
        <span>To RTO</span>
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[80px] items-center">
          <span>{row.getValue("toRTO")}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "services",
    header: () => (
      <Button
        variant="ghost"
        size="sm"
        className="-ml-3 h-8 data-[state=open]:bg-accent">
        <span>Services</span>
      </Button>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex items-center">
          <span>{row.getValue("services")}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Amount" />
    ),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))

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
    cell: ({ row }) => <DataTableRowActions row={row} tableName="Completed" />,
  },
]

export default completedTxnsColumns
