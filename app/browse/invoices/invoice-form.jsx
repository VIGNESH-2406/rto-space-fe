"use client"

import { useForm } from "react-hook-form"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"
import axios from "@/config/axios.new.config"
import { CircleCheck } from 'lucide-react';
import { useRefetch } from "@/hooks/use-refetch"

export function InvoiceForm({ data, closeModal }) {
  const defaultValues = data ?? null
  const form = useForm({ defaultValues })
  const refetch = useRefetch()

  async function onSubmit(filledData) {
    const { receivedAmount, discount } = filledData
    try {
      await axios.patch('/api/invoices/' + filledData.invoiceNo, {
        receivedAmount,
        discount
      })
      refetch("Invoice")
      toast({
        title: (
          <div className="flex items-center">
            <CircleCheck className="text-white bg-green-500 rounded-full" />
            <span className="ml-2">Invoice updated successfully</span>
          </div>
        )
      })
    } catch (err) {
      toast({
        title: "Couldn't update invoice",
        variant: 'destructive',
        description: err.response.data.message
      })
    } finally {
      closeModal()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="customerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer code</FormLabel>
              <FormControl>
                <Input {...field} disabled={true} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="customerName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Customer name</FormLabel>
              <FormControl>
                <Input {...field} disabled={true} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="totalVehicles"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total vehicles</FormLabel>
              <FormControl>
                <Input type="number" {...field} disabled={true} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="totalAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Total amount</FormLabel>
              <FormControl>
                <Input type="number" {...field} disabled={true} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="receivedAmount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Received amount</FormLabel>
              <FormControl>
                <Input type="number" {...field} disabled={defaultValues.receivedAmount} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="discount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Discount</FormLabel>
              <FormControl>
                <Input type="number" {...field} disabled={defaultValues.discount} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-4 relative bottom-0 mt-4">
          <Button variant="outline" onClick={(e) => { e.preventDefault(); closeModal() }}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  )
}
