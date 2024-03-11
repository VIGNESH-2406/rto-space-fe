"use client"

import { useForm } from "react-hook-form"
import { format } from "date-fns"

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

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { CheckIcon, PlusCircledIcon, CaretSortIcon, CalendarIcon } from "@radix-ui/react-icons"
import { Calendar } from "@/components/ui/calendar"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Separator } from "@/components/ui/separator"

import React from "react"

const options = [
  {
    "label": "NOC",
    "value": "NOC"
  },
  {
    "label": "HPC",
    "value": "HPC"
  },
  {
    "label": "TO",
    "value": "TO"
  }
]

function ComboBox({ form, field, name, options, placeholder }) {
  return <Popover>
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
          {field.value
            ? options.find(
              (item) => item.value === field.value
            )?.label
            : `Select ${placeholder ?? name}`}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </FormControl>
    </PopoverTrigger>
    <PopoverContent className="w-[200px] p-0">
      <Command>
        <CommandInput placeholder={`Search ${placeholder ?? name}...`} />
        <CommandEmpty>No {placeholder ?? name} found.</CommandEmpty>
        <CommandGroup>
          {options.map((item) => (
            <CommandItem
              value={item.label}
              key={item.value}
              onSelect={() => {
                form.setValue(name, item.value)
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
      </Command>
    </PopoverContent>
  </Popover>

}

export default function TransactionForm({ closeModalFunc }) {
  const form = useForm()

  const [selectedValues, setSelectedValues] = React.useState(new Set())

  function onSubmit(data) {
    closeModalFunc()
    toast({
      title: "You submitted the following values:",
      description: (
        <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
          <code className="text-white">{JSON.stringify(data, null, 2)}</code>
        </pre>
      ),
    })
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} >
        <div className="space-y-8 p-4 max-h-[600px] overflow-scroll">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="customerCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Code</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select code" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CC-01">CC-01</SelectItem>
                      <SelectItem value="CC-02">CC-02</SelectItem>
                      <SelectItem value="CC-03">CC-03</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="customerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Name</FormLabel>
                  <FormControl>
                    <Input placeholder="name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="vehicleNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehicle Number</FormLabel>
                <div className="grid grid-cols-3 gap-4">
                  <Select className="col-span-1" onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select RTO" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="MH-01">MH 01</SelectItem>
                      <SelectItem value="MH-02">MH 02</SelectItem>
                      <SelectItem value="MH-03">MH 03</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormControl className="col-span-2">
                    <Input placeholder="remaining number" />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-2">
            <FormField
              control={form.control}
              name="services"
              render={() => (
                <FormItem>
                  <FormLabel>Services</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="flex h-9 border-dashed w-min-50 w-max-60">
                          <PlusCircledIcon className="mr-2 h-4 w-4" />
                          Services
                          {selectedValues.size > 0 && (
                            <>
                              <Separator orientation="vertical" className="mx-2 h-4" />
                              <Badge
                                variant="secondary"
                                className="rounded-sm px-1 font-normal lg:hidden"
                              >
                                {selectedValues.size}
                              </Badge>
                              <div className="hidden space-x-1 lg:flex">
                                {
                                  options
                                    .filter((option) => selectedValues.has(option.value))
                                    .map((option) => (
                                      <Badge
                                        variant="secondary"
                                        key={option.value}
                                        className="rounded-sm px-1 font-normal"
                                      >
                                        {option.label}
                                      </Badge>
                                    ))
                                }
                              </div>
                            </>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0" align="start">
                        <Command>
                          <CommandList>
                            <CommandGroup>
                              {options.map((option) => {
                                const isSelected = selectedValues.has(option.value)
                                return (
                                  <CommandItem
                                    key={option.value}
                                    onSelect={() => {
                                      if (isSelected) {
                                        selectedValues.delete(option.value)
                                      } else {
                                        selectedValues.add(option.value)
                                      }
                                      setSelectedValues(
                                        selectedValues.size ? selectedValues : new Set()
                                      )
                                      form.setValue("services", selectedValues)
                                    }}
                                  >
                                    <div
                                      className={cn(
                                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                                        isSelected
                                          ? "bg-primary text-primary-foreground"
                                          : "opacity-50 [&_svg]:invisible"
                                      )}
                                    >
                                      <CheckIcon className={cn("h-4 w-4")} />
                                    </div>
                                    <span>{option.label}</span>
                                  </CommandItem>
                                )
                              })}
                            </CommandGroup>
                            {selectedValues.size > 0 && (
                              <>
                                <CommandSeparator />
                                <CommandGroup>
                                  <CommandItem
                                    onSelect={() => setSelectedValues(new Set())}
                                    className="justify-center text-center"
                                  >
                                    Clear filters
                                  </CommandItem>
                                </CommandGroup>
                              </>
                            )}
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>Select services</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="fromRto"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>From RTO</FormLabel>
                  <ComboBox
                    form={form}
                    field={field}
                    name="fromRto"
                    options={[{ "label": "MH 01", "value": "MH 01" }]}
                    placeholder="RTO"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="toRto"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>To RTO</FormLabel>
                  <ComboBox
                    form={form}
                    field={field}
                    name="toRto"
                    options={[{ "label": "MH 01", "value": "MH 01" }]}
                    placeholder="RTO"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="bank"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Bank</FormLabel>
                  <ComboBox
                    form={form}
                    field={field}
                    name="bank"
                    options={[{ "label": "ABC", "value": "abc" }, { "label": "DEF", "value": "def" }]}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="chassisNumber"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Chassis Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Chassis number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="letterNumber"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Letter Number</FormLabel>
                  <FormControl>
                    <Input placeholder="Letter number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="letterDate"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Letter date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={"outline"}
                          className={cn(
                            "w-[240px] pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "PPP")
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Notes</FormLabel>
                <FormControl>
                  <Textarea
                    className="resize-none"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Separator />
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="sellerName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seller name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sellerSo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seller S/O</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sellerMobile"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Seller mobile</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sellerAddress"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Seller address</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="purchaserName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchaser name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="purchaserSo"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchaser S/O</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="purchaserMobile"
              render={({ field }) => (
                <FormItem className="col-span-1">
                  <FormLabel>Purchaser mobile</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="purchaserAddress"
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel>Purchaser address</FormLabel>
                  <FormControl>
                    <Textarea
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <FormField
            control={form.control}
            name="addressProof"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Adress proof</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => field.onChange(e.target.files[0])}
                    id="addressProof"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="panCardProof"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pan card proof</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => field.onChange(e.target.files[0])}
                    id="panCardProof"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="chassisProof"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chassis proof</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => field.onChange(e.target.files[0])}
                    id="chassisProof"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="insuranceProof"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Insurance proof</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => field.onChange(e.target.files[0])}
                    id="insuranceProof"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-4 relative bottom-0 mt-4">
          <Button variant="outline" onClick={() => closeModalFunc()}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  )
}
