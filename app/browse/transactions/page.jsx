"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ReadyTxnsDataTable  from "./components/ready-txns/data-table"
import AllTxnsDataTable from "./components/all-txns/data-table"
import CompletedTxnsDataTable from "./components/completed-txns/data-table"
import React from "react"

export default function Transactions() {
  return (
    <>
      <Tabs defaultValue="ready">
        <div className="flex items-center px-4 py-3">
          <h1 className="text-2xl font-bold">Transactions</h1>
          <TabsList className="ml-auto">
            <TabsTrigger value="all" className="text-zinc-600 dark:text-zinc-200">All</TabsTrigger>
            <TabsTrigger value="ready" className="text-zinc-600 dark:text-zinc-200">Ready</TabsTrigger>
            <TabsTrigger value="completed" className="text-zinc-600 dark:text-zinc-200">Completed</TabsTrigger>
          </TabsList>
        </div>
        <div className="container mx-auto py-10">
          <TabsContent value="ready" className="m-0">
            <ReadyTxnsDataTable />
          </TabsContent>
          <TabsContent value="all" className="m-0">
            <AllTxnsDataTable />
          </TabsContent>
          <TabsContent value="completed" className="m-0">
            <CompletedTxnsDataTable />
          </TabsContent>
        </div>
      </Tabs>
    </>
  )
}
