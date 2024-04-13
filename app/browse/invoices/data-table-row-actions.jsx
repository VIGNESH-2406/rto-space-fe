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
import { Pencil, Trash2, Eye } from 'lucide-react';
import { InvoiceForm } from "./invoice-form";

export function DataTableRowActions({ row }) {
  const [showDialog, setShowDialog] = React.useState(false)

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
          <DropdownMenuItem onClick={() => { console.log(row.original, "selected row"); setShowDialog(true) }}>
            <Pencil className="size-4 mr-2" />
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Trash2 className="size-4 mr-2" />
            Delete
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Eye className="size-4 mr-2" />
            <a href={row.original.invoicePdf} target="_blank">
              View
            </a>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[1000px]">
          <DialogHeader>
            <DialogTitle>Edit invoice #{row.original.invoiceNo}</DialogTitle>
            <DialogDescription>
              Update invoice
            </DialogDescription>
          </DialogHeader>
          <InvoiceForm data={row.original} closeModal={() => setShowDialog(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
