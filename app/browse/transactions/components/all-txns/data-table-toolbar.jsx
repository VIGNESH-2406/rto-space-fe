"use client"

import { Cross2Icon } from "@radix-ui/react-icons"

import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import * as React from "react"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import TransactionForm from "../transaction-form";

export function ComboboxPopover({ column }) {
  const [open, setOpen] = React.useState(false)
  const [selectedStatus, setSelectedStatus] = React.useState(null)
  const statuses = [
    {
      value: "ready",
      label: "Ready",
    },
    {
      value: "created",
      label: "Created"
    },
    {
      value: "completed",
      label: "Completed"
    }
  ]

  return (
    <div className="flex items-center space-x-4">
      <p className="text-sm text-muted-foreground">Status</p>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className=" h-8 w-[150px] justify-start">
            {selectedStatus ? <>{selectedStatus.label}</> : <>+ Set status</>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" side="right" align="start">
          <Command>
            <CommandInput placeholder="Change status..." />
            <CommandList>
              <CommandEmpty>No results found.</CommandEmpty>
              <CommandGroup>
                {statuses.map((status) => (
                  <CommandItem
                    key={status.value}
                    value={status.value}
                    onSelect={(value) => {
                      column.setFilterValue(value)
                      setSelectedStatus(
                        statuses.find((priority) => priority.value === value) ||
                        null
                      )
                      setOpen(false)
                    }}
                  >
                    {status.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export function DataTableToolbar({
  table,
}) {
  const isFiltered = table.getState().columnFilters.length > 0
  const [showTransactionFormDialog, setShowTransactionFormDialog] = React.useState(false)

  return (
    <>
      <div className="flex items-center justify-between">
        <Button
          onClick={() => setShowTransactionFormDialog(true)}
          variant="default"
          className="h-8 w-52 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white">
          <Plus size={18} />
          <span className="ml-4 text-sm"> Create Transaction </span>
        </Button>
        <div className="flex items-center space-x-2">
          {table.getColumn("status") && (
            <ComboboxPopover column={table.getColumn("status")} />
          )}
          {isFiltered && (
            <Button
              variant="ghost"
              onClick={() => table.resetColumnFilters()}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
      <Dialog open={showTransactionFormDialog} onOpenChange={setShowTransactionFormDialog}>
        <DialogContent className="sm:max-w-[1200px]">
          <DialogHeader>
            <DialogTitle>Create transaction</DialogTitle>
            <DialogDescription>
              Add a new transaction to manage RTO process.
            </DialogDescription>
          </DialogHeader>
          <TransactionForm closeModal={() => setShowTransactionFormDialog(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
