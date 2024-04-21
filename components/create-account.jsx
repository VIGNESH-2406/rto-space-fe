"use client"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from '@/config/axios.new.config'
import { toast } from "@/components/ui/use-toast"
import { cn } from "@/lib/utils"

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from "@/components/ui/command"

import { CheckIcon, CaretSortIcon } from "@radix-ui/react-icons"
import { ScrollArea } from "@/components/ui/scroll-area"
import React from "react"

const userSchema = z.object({
  firstName: z.string({ required_error: 'First name is required', invalid_type_error: 'First name must be a string' }),
  lastName: z.string({ required_error: 'First name is required', invalid_type_error: 'First name must be a string' }),
  email: z.string().email('Invalid email format').refine(data => {
    const isValidEmail = /\S+@\S+\.(com|in)$/.test(data);
    return isValidEmail || 'Invalid email format';
  }),
  level: z.number(),
  password: z.string().min(6),
})

function ComboBox({ form, field, name, options, placeholder, scrollbarHeight }) {
  const [open, setOpen] = React.useState(false)

  return <Popover open={open} onOpenChange={setOpen}>
    <PopoverTrigger asChild>
      <FormControl>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            "w-full justify-between",
            !field.value && "text-muted-foreground"
          )}
        >
          {field.value ? options.find(item => item.value === field.value)?.label : `Select ${placeholder}`}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </FormControl>
    </PopoverTrigger>
    <PopoverContent className="w-[400px] p-0">
      <Command>
        <ScrollArea className={`h-${scrollbarHeight ?? 48}`}>
          <CommandEmpty>No {placeholder} found.</CommandEmpty>
          <CommandGroup>
            {options.map((item) => (
              <CommandItem
                value={item.value}
                key={item.value}
                onSelect={() => {
                  console.log("selected access level", item.value)
                  form.setValue(name, item.value)
                  setOpen(false)
                }}
              >
                <CheckIcon
                  className={cn(
                    "mr-2 h-4 w-4",
                    item.value === field.value
                      ? "opacity-100"
                      : "opacity-0"
                  )}
                />
                {item.label}
              </CommandItem>
            ))}
          </CommandGroup>
        </ScrollArea>
      </Command>
    </PopoverContent>
  </Popover>

}

export default function CreateAccountForm({ closeModal }) {
  const form = useForm({
    resolver: zodResolver(userSchema)
  })

  async function onSubmit(data) {
    try {
      const response = await axios.post('/api/employees', data);
      toast({
        title: "Registration Success",
        description: response.data.message,
      })
    } catch (error) {
      console.error(error, "error while creating an account")
      toast({
        title: "Registration Failed",
        description: error.response.data.message,
      })
      console.error('Error during registration:', error.response.data.message);
    } finally {
      closeModal()
    }
  }

  return (
    <Form {...form} >
      <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="m@example.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-2 mt-2">
          <FormField
            control={form.control}
            name="level"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Access level</FormLabel>
                <ComboBox
                  form={form}
                  field={field}
                  name="level"
                  placeholder="level"
                  options={[{ label: "1", value: 1 }, { label: "2", value: 2 }, { label: "3", value: 3 }]}
                  scrollbarHeight={24}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-2">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>password</FormLabel>
                <FormControl>
                  <Input {...field} type="password" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full">
          Create an account
        </Button>
      </form>
      <div className="mt-4 text-center text-sm">
        Already have an account?{" "}
        <Link href="/login" className="underline">
          Sign in
        </Link>
      </div>
    </Form>
  )
}

