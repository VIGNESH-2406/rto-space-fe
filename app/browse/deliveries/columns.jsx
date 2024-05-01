"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { format } from "date-fns"

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
    accessorKey: "deliveryNo",
    header: () => (
      <div>Delivery no.</div>
    ),
    cell: ({ row }) => <div className="w-[120px]">{row.getValue("deliveryNo")}</div>,
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "deliveryBy",
    header: () => (
      <div>Delivery By</div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex space-x-2">
          <span className="max-w-[500px] truncate font-medium">
            {row.getValue("deliveryBy")}
          </span>
        </div>
      )
    },
  },
  {
    accessorKey: "vehicleNo",
    header: () => (
      <div>Vehicle no.</div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[120px] items-center">
          <span>{row.getValue("vehicleNo")}</span>
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
      <div>Services</div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[120px] items-center">
          <span>{row.getValue("services")}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: "deliveryDate",
    header: () => (
      <div>Delivery date</div>
    ),
    cell: ({ row }) => {
      return (
        <div className="flex w-[120px] items-center">
          <span>{format(row.getValue("deliveryDate"), "dd LLL, y")}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  // {
  //   id: "actions",
  //   cell: ({ row }) => <DataTableRowActions row={row} />,
  // },
]

export default columns;
