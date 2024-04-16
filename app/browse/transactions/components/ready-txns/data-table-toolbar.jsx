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
import { Input } from "@/components/ui/input";
import axios from '@/config/axios.new.config'
import { ScrollArea } from "@/components/ui/scroll-area";

export default function DataTableToolbar({ updaterFunc }) {

  const [openRtoSearch, setOpenRtoSearch] = React.useState(false)
  const [showTransactionFormDialog, setShowTransactionFormDialog] = React.useState(false)
  const [deliveryAgent, setDeliveryAgent] = React.useState()
  const [rto, setRto] = React.useState()
  const [rtos, setRtos] = React.useState([])

  React.useEffect(() => {
    async function getRtos() {
      try {
        const { data } = await axios.get('/api/fetch/rtos')
        setRtos(data.map(x => ({ label: x.rto, value: x.rto })))
      } catch (err) {
        console.log("error while fetching rtos", err)
      }
    }
    getRtos()
  }, [])

  React.useEffect(() => {
    console.log("selected rto", rto)
    if (rto) {
      updaterFunc(prev => ({ ...prev, page: '0', toRTO: rto.value }))
    }
  }, [rto])

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
        {rto && rto.value && (
          <Button
            variant="ghost"
            onClick={() => {
              setRto({ label: '', value: '' })
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
              {rto && rto.label ? rto.label : `Select RTO`}
              <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0">
            <Command>
              <CommandInput placeholder={`Search RTO`} />
              <ScrollArea className="h-48">
                <CommandEmpty>No data found.</CommandEmpty>
                <CommandGroup>
                  {rtos.map((item) => (
                    <CommandItem
                      key={item.value}
                      onSelect={() => {
                        setRto(item)
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
              </ScrollArea>
            </Command>
          </PopoverContent>
        </Popover>
        <Separator orientation="vertical" />
        <Input className="w-52" placeholder="assign delivery agent" onChange={e => setDeliveryAgent(e.target.value)} />
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
        <TransactionForm tableName="Ready" closeModal={() => setShowTransactionFormDialog(false)} />
      </DialogContent>
    </Dialog>
  </>

}
