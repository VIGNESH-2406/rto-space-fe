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
import { useAxios } from "@/config/axios.config"
import { ScrollArea } from "@/components/ui/scroll-area"

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
          {field.value
            ? options.find(
              (item) => item.value === field.value
            )?.label
            : `Select ${placeholder ?? name}`}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </FormControl>
    </PopoverTrigger>
    <PopoverContent className="w-[400px] p-0">
      <Command>
        <CommandInput placeholder={`Search ${placeholder ?? name}...`} />
        <ScrollArea className="h-48">
          <CommandEmpty>No {placeholder ?? name} found.</CommandEmpty>
          <CommandGroup>
            {options.map((item) => (
              <CommandItem
                value={item.label}
                key={item.value}
                onSelect={() => {
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

export default function TransactionForm({ data, closeModal }) {
  const axios = useAxios()
  const defaultValues = data ?? null
  const form = useForm({ defaultValues })
  const [customers, setCustomers] = React.useState([
    { customerId: 1, customerName: "Ryan Garcia" },
    { customerId: 2, customerName: "Lionel Messi" },
    { customerId: 3, customerName: "K De Bruyne" },
    { customerId: 4, customerName: "Jon Jones" },
    { customerId: 5, customerName: "Dwight Schrute" },
    { customerId: 6, customerName: "M Scott" },
    { customerId: 7, customerName: "Nard Dog" },
  ])
  const [services, setServices] = React.useState([
    {
      "serviceId": "CA",
      "serviceName": "Change of Address"
    },
    {
      "serviceId": "DRC",
      "serviceName": "Duplicate RC"
    },
    {
      "serviceId": "GTX",
      "serviceName": "Green Tax"
    },
    {
      "serviceId": "HPA",
      "serviceName": "Addition of Hypothecation",
    },
    {
      "serviceId": "HPC",
      "serviceName": "Continuation of Hypothecation",
    },
    {
      "serviceId": "HPT",
      "serviceName": "Termination of Hypothecation",
    },
    {
      "serviceId": "IC",
      "serviceName": "nan",
    },
    {
      "serviceId": "INS",
      "serviceName": "Insurance",
    },
    {
      "serviceId": "NOC",
      "serviceName": "No Objection Certificate",
    },
    {
      "serviceId": "OTS",
      "serviceName": "nan",
    }
  ])
  const [banks, setBanks] = React.useState([])
  const [rtos, setRtos] = React.useState([
    {
      "rto": "MH01",
      "rtoName": "Mumbai (Central)",
    },
    {
      "rto": "MH02",
      "rtoName": "Mumbai (West)",
    },
    {
      "rto": "MH03",
      "rtoName": "Mumbai (East)",
    },
    {
      "rto": "MH04",
      "rtoName": "Thane",
    },
    {
      "rto": "MH05",
      "rtoName": "Kalyan",
    },
    {
      "rto": "MH06",
      "rtoName": "Raigad",
    }
  ])

  const [selectedValues, setSelectedValues] = React.useState(new Set())

  React.useEffect(() => {
    if (defaultValues) {
      setSelectedValues(defaultValues.services)
      form.setValue("services", defaultValues.services)
    }
  }, [])

  async function onSubmit(data) {
    data.vehicleNo = data.vehicleNo.rto + " " + data.vehicleNo.number
    data.services = data.services ? Array.from(data.services).join("/") : undefined
    let formData = new FormData();

    for (var key in data) {
      formData.append(key, data[key]);
    }

    console.log("data submitted", formData)
    try {
      await axios.post('/api/transaction/entry', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      toast({
        title: "Transaction created successfully"
      })
    } catch (error) {
      toast({
        title: "Oops! Something went wrong",
        description: error.response.data.message
      })
    } finally {
      closeModal()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} >
        <div className="space-y-8 p-4 max-h-[600px] overflow-scroll">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="customerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Customer Code</FormLabel>
                  <ComboBox
                    form={form}
                    field={field}
                    name="code"
                    options={customers.map(x => ({ label: x.customerId, value: x.customerId }))}
                  />
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
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="vehicleNo.rto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Number</FormLabel>
                  <ComboBox
                    form={form}
                    field={field}
                    name="fromRTO"
                    options={rtos.map(x => ({ label: x.rto, value: x.rto }))}
                    placeholder="RTO"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicleNo.number"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>&nbsp;</FormLabel>
                  <FormControl>
                    <Input placeholder="remaining number" disabled={!form.getValues("vehicleNo.rto")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
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
                        <Button variant="outline" size="sm" className="flex h-9 border-dashed w-[500px]">
                          <PlusCircledIcon className="mr-2 h-4 w-4" />
                          <p className="text-muted-foreground">Services</p>
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
                      <PopoverContent className="w-[400px] p-0" align="start">
                        <Command>
                          <CommandList>
                            <ScrollArea className="h-48">
                              <CommandGroup>
                                {services.map((option) => {
                                  const isSelected = selectedValues.has(option.serviceId)
                                  return (
                                    <CommandItem
                                      key={option.serviceId}
                                      onSelect={() => {
                                        if (isSelected) {
                                          selectedValues.delete(option.serviceId)
                                        } else {
                                          selectedValues.add(option.serviceId)
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
                                      <span>{option.serviceId}</span>
                                    </CommandItem>
                                  )
                                })}
                              </CommandGroup>
                            </ScrollArea>
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
              name="fromRTO"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>From RTO</FormLabel>
                  <ComboBox
                    form={form}
                    field={field}
                    name="fromRTO"
                    options={rtos.map(x => ({ label: x.rto, value: x.rto }))}
                    placeholder="RTO"
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="toRTO"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>To RTO</FormLabel>
                  <ComboBox
                    form={form}
                    field={field}
                    name="toRTO"
                    options={rtos.map(x => ({ label: x.rto, value: x.rto }))}
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
                <FormLabel>Address proof</FormLabel>
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
            name="chasisProof"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chassis proof</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => field.onChange(e.target.files[0])}
                    id="chasisProof"
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
          <Button variant="outline" onClick={() => closeModal()}>
            Cancel
          </Button>
          <Button type="submit">Save</Button>
        </div>
      </form>
    </Form>
  )
}
