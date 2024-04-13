"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { z } from "zod"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

export function InvoiceForm({ data, closeModal }) {
  const defaultValues = data ?? null
  const form = useForm({ defaultValues })

  function onSubmit(filledData) {
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(filledData, null, 2)}</code>
        </pre>
      ),
    })
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
                  <Input type="number" {...field} />
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
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        <div className="flex justify-end gap-4 relative bottom-0 mt-4">
          <Button variant="outline" onClick={() => closeModal()}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  )
}
