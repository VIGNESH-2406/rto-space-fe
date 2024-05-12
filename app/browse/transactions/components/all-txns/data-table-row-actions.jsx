"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import React from "react";
import TransactionForm from "../transaction-form";
import axios from '@/config/axios.new.config'
import { useToast } from "@/components/ui/use-toast";
import { CircleCheck } from 'lucide-react';
import { useRefetch } from "@/hooks/use-refetch";

// TODO: make this a shared component maybe?
export function DataTableRowActions({ row, tableName }) {
  const vehicleNo = row.original.vehicleNo
  const firstSpaceIdx = vehicleNo.indexOf(" ")
  const [rto, number] = [vehicleNo.slice(0, firstSpaceIdx), vehicleNo.slice(firstSpaceIdx + 1)]
  const transaction = {
    ...row.original,
    services: new Set(row.original.services.split('/')),
    vehicleNo: { rto, number },
    customerId: row.original.customerId.toString()
  }
  const [showTransactionFormDialog, setShowTransactionFormDialog] = React.useState(false)
  const { toast } = useToast()
  const refetch = useRefetch()

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
          >
            <DotsHorizontalIcon className="h-4 w-4" />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem onClick={() => setShowTransactionFormDialog(true)}>Edit</DropdownMenuItem>
          <DropdownMenuItem onClick={async () => {
            try {
              await axios.delete('/transactions/' + transaction.entryId)
              refetch(tableName)
              toast({
                title: (
                  <div className="flex items-center">
                    <CircleCheck className="text-white bg-green-500 rounded-full" />
                    <span className="ml-2">Transaction deleted successfully</span>
                  </div>
                )
              })
            } catch (err) {
              toast({
                variant: "destructive",
                title: "Oops! Something went wrong",
                description: "There was a problem with your request"
              })
            }
          }}>Delete</DropdownMenuItem>
          {transaction.form30part1 && <DropdownMenuItem>
            <a href={transaction.form30part1} target="_blank">
              Form 30 I
            </a>
          </DropdownMenuItem>}
          {transaction.form30part2 && <DropdownMenuItem>
            <a href={transaction.form30part2} target="_blank">
              Form 30 II
            </a>
          </DropdownMenuItem>}
          {transaction.form29 && <DropdownMenuItem>
            <a href={transaction.form29} target="_blank">
              Form 29
            </a>
          </DropdownMenuItem>}
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={showTransactionFormDialog} onOpenChange={setShowTransactionFormDialog}>
        <DialogContent className="sm:max-w-[1200px]">
          <DialogHeader>
            <DialogTitle>Edit transaction #{transaction.entryId}</DialogTitle>
            <DialogDescription>
              Update transaction to manage RTO process
            </DialogDescription>
          </DialogHeader>
          <TransactionForm data={transaction} tableName={tableName} closeModal={() => setShowTransactionFormDialog(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
