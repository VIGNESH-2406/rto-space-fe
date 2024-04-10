"use client"

import { Plus } from 'lucide-react';
import { Button } from "@/components/ui/button"

import * as React from "react"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
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

import { CalendarIcon } from "@radix-ui/react-icons"
import { addDays, format } from "date-fns"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Calendar } from "@/components/ui/calendar"
import { Input } from '@/components/ui/input';
import TransactionForm from '../transaction-form';

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

function DatePickerWithRange({ className, updaterFunc }) {
  const [date, setDate] = React.useState(null)

  React.useEffect(() => {
    console.log("date changed", date)
    if (date && date.from && date.to) {
      updaterFunc(prev => ({
        ...prev,
        from: date.from.toISOString().split('T')[0],
        to: date.to.toISOString().split('T')[0]
      }))
    } else {
      updaterFunc(prev => ({
        ...prev,
        from: '',
        to: ''
      }))
    }
  }, [date])

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[300px] justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date range</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={setDate}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  )
}


export function DataTableToolbar({ table, updaterFunc }) {
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
          <DatePickerWithRange updaterFunc={updaterFunc} />
          <Input
            type="text"
            placeholder="search customer"
            className="w-52"
            onChange={(e) => updaterFunc(prev => ({ ...prev, keyword: e.target.value }))}
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
          <TransactionForm tableName="Completed" closeModal={() => setShowTransactionFormDialog(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
