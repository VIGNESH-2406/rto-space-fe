import React from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import TransactionForm from "./transaction-form";

export default function TransactionFormDialog({ open }) {

  const [show, setShow] = React.useState(open)

  return <Dialog open={show} onOpenChange={setShow}>
    <DialogContent className="sm:max-w-[860px]">
      <DialogHeader>
        <DialogTitle>Create transaction</DialogTitle>
        <DialogDescription>
          Add a new transaction to manage RTO process.
        </DialogDescription>
      </DialogHeader>
      <TransactionForm closeModal={() => setShow(false)} />
    </DialogContent>
  </Dialog>

}
