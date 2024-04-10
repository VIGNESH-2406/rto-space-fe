"use client"

import { useForm } from "react-hook-form"
import { format } from "date-fns"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
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
import { ScrollArea } from "@/components/ui/scroll-area"
import { useAtom } from 'jotai'
import { allTxnsPageAtom } from "./all-txns/data-table"
import { readyTxnsPageAtom } from "./ready-txns/data-table"
import { completedTxnsPageAtom } from "./completed-txns/data-table"

import axios from '@/config/axios.new.config'

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
          {field.value ? options.find(item => item.value === field.value)?.label : `Select ${placeholder}`}
          <CaretSortIcon className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </FormControl>
    </PopoverTrigger>
    <PopoverContent className="w-[400px] p-0">
      <Command>
        <CommandInput placeholder={`Search ${placeholder}...`} />
        <ScrollArea className="h-48">
          <CommandEmpty>No {placeholder} found.</CommandEmpty>
          <CommandGroup>
            {options.map((item) => (
              <CommandItem
                value={item.value}
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

export default function TransactionForm({ data, tableName, closeModal }) {
  const defaultValues = data ?? null
  const form = useForm({ defaultValues })
  const watchVehicleRTO = form.watch("vehicleNo.rto");
  const watchServices = form.watch("services");

  const [customers, setCustomers] = React.useState([])
  const [services, setServices] = React.useState([])
  const [banks, setBanks] = React.useState([])
  const [rtos, setRtos] = React.useState([])
  const [allTxnsQueryParams, setAllTxnsQueryParams] = useAtom(allTxnsPageAtom)
  const [readyTxnsQueryParams, setReadyTxnsQueryParams] = useAtom(readyTxnsPageAtom)
  const [completedTxnsQueryParams, setCompletedTxnsQueryParams] = useAtom(completedTxnsPageAtom)

  const [selectedValues, setSelectedValues] = React.useState(new Set())

  React.useEffect(() => {
    console.log("watch services")
    const selectedIds = [...selectedValues]
    console.log("ids", selectedIds)
    setAmountFormState(selectedIds, services)
  }, [watchServices])

  React.useEffect(() => {
    getRtos()
    getServices()
    getCustomers()
    getBanks()
  }, [])

  const getRtos = async () => {
    try {
      const { data } = await axios.get('/api/fetch/rtos')
      setRtos(data.map(x => ({ label: x.rto, value: x.rto })))
    } catch (err) {
      console.log("error while fetching rtos", err)
    }
  }

  const getCustomers = async () => {
    try {
      const { data } = await axios.get('/api/fetch/customers')
      setCustomers(data.map(x => ({ label: x.customerId, value: x.customerId })))
    } catch (err) {
      console.log("error while fetching customers", err)
    }
  }

  const getServices = async () => {
    try {
      const { data } = await axios.get('/api/fetch/services')
      const services = data.map(x => ({ label: x.serviceId, value: x.serviceId, amount: x.amount }))
      setServices(services)
      if (defaultValues) {
        setServicesFormState(defaultValues.services)
        setAmountFormState([...defaultValues.services], services)
      }
    } catch (err) {
      console.log("error while fetching services", err)
    }
  }

  function setServicesFormState(serviceIds) {
    setSelectedValues(serviceIds)
    form.setValue("services", serviceIds)
  }

  function setAmountFormState(serviceIds, services) {
    const totalAmount = services
      .filter(x => serviceIds.includes(x.value))
      .reduce((acc, curr) => acc + curr.amount, 0)
    console.log("total amount", totalAmount)

    form.setValue("amount", totalAmount)
  }

  const getBanks = async () => {
    try {
      const { data } = await axios.get('/api/fetch/banks')
      setBanks(data.map(x => ({ label: x.bank, value: x.bankId })))
    } catch (err) {
      console.log("error while fetching services", err)
    }
  }

  async function createTransaction(formData) {
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

  function refetch() {
    switch (tableName) {
      case 'All':
        setAllTxnsQueryParams({ ...allTxnsQueryParams })
        break;
      case 'Ready':
        setReadyTxnsQueryParams({ ...readyTxnsQueryParams })
        break;
      case 'Completed':
        setCompletedTxnsQueryParams({ ...completedTxnsQueryParams })
        break;
    }
  }

  async function updateTransaction(id, formData) {
    try {
      await axios.put('/api/transaction/entry/' + id, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        }
      });
      refetch()
      toast({
        title: "Transaction updated successfully"
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


  function getSerializedValue(key, value) {
    switch (key) {
      case "services":
        return value ? JSON.stringify(Array.from(value)) : null
      case "vehicleNo":
        return value ? JSON.stringify(value) : null
      default:
        return value ?? null
    }
  }

  async function onSubmit(filledData) {
    const formData = Object.entries(filledData).reduce((acc, curr) => {
      const key = curr[0]
      const value = getSerializedValue(key, curr[1])
      if (value) {
        acc.append(key, value)
      }
      return acc
    }, new FormData())

    console.log("data submitted", formData)
    if (defaultValues) {
      updateTransaction(defaultValues.entryId, formData)
    } else {
      createTransaction(formData)
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
                    name="customerId"
                    placeholder="code"
                    options={customers}
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
                    name="vehicleNo.rto"
                    placeholder="RTO"
                    options={rtos}
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
                    <Input placeholder="remaining number" disabled={!watchVehicleRTO} {...field} />
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
                                  services
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
                                      <span>{option.value}</span>
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
                                    onSelect={() => { setSelectedValues(new Set()); form.setValue("services", new Set()) }}
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
                    placeholder="RTO"
                    options={rtos}
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
                    placeholder="RTO"
                    options={rtos}
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
                    placeholder="bank"
                    options={banks}
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
            name="pancardProof"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Pan card proof</FormLabel>
                <FormControl>
                  <Input
                    type="file"
                    accept=".pdf"
                    onChange={(e) => field.onChange(e.target.files[0])}
                    id="pancardProof"
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
