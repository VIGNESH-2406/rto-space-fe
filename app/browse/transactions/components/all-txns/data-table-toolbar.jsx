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
import axios from "@/config/axios.new.config";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"
import { cn, debounce } from "@/lib/utils"
import { Input } from "@/components/ui/input";

export const DataTableToolbar = ({ table, updaterFunc }) => {
  const [showTransactionFormDialog, setShowTransactionFormDialog] = React.useState(false)
  const [open, setOpen] = React.useState(false)
  const [selectedStatus, setSelectedStatus] = React.useState(null)
  const [openStatusSearch, setOpenStatusSearch] = React.useState(false)
  const [statusFilter, setStatusFilter] = React.useState()

  async function updateStatus() {
    try {
      await axios.patch('/api/transactions/status', {
        ids: table.getFilteredSelectedRowModel().rows.map(x => x.original.entryId),
        status: selectedStatus.value
      })
      table.toggleAllPageRowsSelected(false)
      updaterFunc(prev => ({ ...prev }))
    } catch (err) {
      // TODO: add a toaster here
      console.log("error while updating status", err)
    }
  }

  React.useEffect(() => {
    if (selectedStatus) {
      updateStatus()
    }
  }, [selectedStatus])

  React.useEffect(() => {
    if (statusFilter) {
      updaterFunc(prev => ({ ...prev, page: '0', status: statusFilter.value }))
    }
  }, [statusFilter])

  const statuses = [
    {
      value: "READY",
      label: "Ready",
    },
    {
      value: "CREATED",
      label: "Created"
    },
    {
      value: "DELIVERED",
      label: "Delivered"
    },
    {
      value: "RETURNED",
      label: "Returned"
    },
    {
      value: "COMPLETED",
      label: "Completed"
    }
  ]

  const debouncedUpdaterFunc = debounce((value) => {
    updaterFunc(prev => ({ ...prev, page: '0', keyword: value }));
  }, 300);

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
          {statusFilter && statusFilter.value && (
            <Button
              variant="ghost"
              onClick={() => {
                setStatusFilter({ label: '', value: '' })
              }}
              className="h-8 px-2 lg:px-3"
            >
              Reset
              <Cross2Icon className="ml-2 h-4 w-4" />
            </Button>
          )}
          {table.getColumn("status") && (
            <div className="flex items-center space-x-4">
              <Popover open={open} onOpenChange={setOpen} >
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className=" h-8 w-[150px] justify-start"
                    disabled={!table.getFilteredSelectedRowModel().rows.length}
                  >
                    + Update status
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
                              console.log(table.getFilteredSelectedRowModel().rows.map(x => x.original.entryId), "rows")
                              setSelectedStatus(
                                statuses.find((priority) => priority.value === value.toUpperCase()) ||
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
          )}
          <Popover open={openStatusSearch} onOpenChange={setOpenStatusSearch}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-label="select status"
                aria-expanded={openStatusSearch}
                className="flex-1 h-8 justify-between max-w-[200px]"
              >
                {statusFilter && statusFilter.label ? statusFilter.label : `Select status`}
                <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-[200px] p-0">
              <Command>
                <CommandInput placeholder="Filter by status" />
                <CommandEmpty>No data found.</CommandEmpty>
                <CommandGroup>
                  {statuses.map((item) => (
                    <CommandItem
                      key={item.value}
                      onSelect={() => {
                        setStatusFilter(item)
                        setOpenStatusSearch(false)
                      }}
                    >
                      {item.label}
                      <CheckIcon
                        className={cn(
                          "ml-auto h-4 w-4",
                          statusFilter?.value === item.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
          <Input
            type="text"
            placeholder="search customer"
            className="w-52"
            onChange={(e) => debouncedUpdaterFunc(e.target.value)}
          />
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
          <TransactionForm tableName="All" closeModal={() => setShowTransactionFormDialog(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
