"use client"

import { DotsHorizontalIcon } from "@radix-ui/react-icons"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import React from "react";
import TransactionForm from "../transaction-form";

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
          <DropdownMenuItem onClick={() => { console.log(transaction, "selected row"); setShowTransactionFormDialog(true) }}>Edit</DropdownMenuItem>
          <DropdownMenuItem>Delete</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={showTransactionFormDialog} onOpenChange={setShowTransactionFormDialog}>
        <DialogContent className="sm:max-w-[1200px]">
          <DialogHeader>
            <DialogTitle>Edit transaction</DialogTitle>
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
