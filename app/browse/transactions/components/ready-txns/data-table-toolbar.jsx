import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Plus } from 'lucide-react';
import { Cross2Icon } from "@radix-ui/react-icons"
import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons"

import { cn } from "@/lib/utils"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import TransactionForm from "../transaction-form";

const deliveryAgents = [
  { "label": "Emily Johnson", "value": "Emily Johnson" },
  { "label": "Michael Smith", "value": "Michael Smith" },
  { "label": "Jessica Williams", "value": "Jessica Williams" },
  { "label": "Christopher Brown", "value": "Christopher Brown" },
  { "label": "Amanda Davis", "value": "Amanda Davis" }
]

const rtos = [
  { "label": "MH 01", "value": "MH 01" },
  { "label": "MH 02", "value": "MH 02" },
  { "label": "MH 03", "value": "MH 03" },
  { "label": "MH 04", "value": "MH 04" },
  { "label": "MH 05", "value": "MH 05" }
]

export default function DataTableToolbar({ table }) {

  const [openRtoSearch, setOpenRtoSearch] = React.useState(false)
  const [openDeliveryAgentSearch, setOpenDeliveryAgentSearch] = React.useState(false)
  const [showTransactionFormDialog, setShowTransactionFormDialog] = React.useState(false)
  const isFiltered = table.getState().columnFilters.length > 0
  const [deliveryAgent, setDeliveryAgent] = React.useState()
  const [rto, setRto] = React.useState()

  return <>
    <div className="flex justify-between py-4">
      <Button
        variant="default"
        onClick={() => setShowTransactionFormDialog(true)}
        className="h-8 w-52 dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white">
        <Plus size={18} />
        <span className="ml-4 text-sm"> Create Transaction </span>
      </Button>
      <div className="flex items-center space-x-4 text-sm">
        {isFiltered && (
          <Button
            variant="ghost"
            onClick={() => {
              table.resetColumnFilters()
              setRto(null)
              setDeliveryAgent(null)
            }}
            className="h-8 px-2 lg:px-3"
          >
            Reset
            <Cross2Icon className="ml-2 h-4 w-4" />
          </Button>
        )}
        <Popover open={openRtoSearch} onOpenChange={setOpenRtoSearch}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-label="select rto"
              aria-expanded={openRtoSearch}
              className="flex-1 h-8 justify-between max-w-[200px]"
            >
              {rto ? rto.label : `Select RTO`}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder={`Search RTO`} />
              <CommandEmpty>No data found.</CommandEmpty>
              <CommandGroup>
                {rtos.map((item) => (
                  <CommandItem
                    key={item.value}
                    onSelect={() => {
                      setRto(item)
                      table.getColumn("toRTO").setFilterValue(item.value)
                      setOpenRtoSearch(false)
                    }}
                  >
                    {item.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        rto?.value === item.value
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
        <Separator orientation="vertical" />
        <Popover open={openDeliveryAgentSearch} onOpenChange={setOpenDeliveryAgentSearch}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              role="combobox"
              aria-label="select delivery agent"
              aria-expanded={openDeliveryAgentSearch}
              className="flex-1 h-8 justify-between max-w-[200px]"
            >
              {deliveryAgent ? deliveryAgent.label : `Select delivery agent`}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder={`Search agents`} />
              <CommandEmpty>No data found.</CommandEmpty>
              <CommandGroup>
                {deliveryAgents.map((item) => (
                  <CommandItem
                    key={item.value}
                    onSelect={() => {
                      setDeliveryAgent(item)
                      setOpenDeliveryAgentSearch(false)
                    }}
                  >
                    {item.label}
                    <CheckIcon
                      className={cn(
                        "ml-auto h-4 w-4",
                        deliveryAgent?.value === item.value
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
        <TransactionForm closeModalFunc={() => setShowTransactionFormDialog(false)} />
      </DialogContent>
    </Dialog>
  </>

}
