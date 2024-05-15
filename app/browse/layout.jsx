"use client"
import * as React from "react"
import {
  BadgeIndianRupee,
  Truck,
  ReceiptText,
  ChevronLeft,
  ChevronRight
} from "lucide-react"
import { Nav } from "@/app/browse/transactions/components/nav"
import { TooltipProvider } from "@/components/ui/tooltip"
import "@/styles/globals.css";
import { cn } from "@/lib/utils";
import ProtectedRoute from "@/components/protected-route"
import { UserNav } from "@/components/user-nav"
import Image from 'next/image'
import logo from '@/public/logo.jpg'
import dynamic from 'next/dynamic';
const ResizableHandle = dynamic(() => import('@/components/ui/resizable').then((module) => module.ResizableHandle));
const ResizablePanel = dynamic(() => import('@/components/ui/resizable').then((module) => module.ResizablePanel));
const ResizablePanelGroup = dynamic(() => import('@/components/ui/resizable').then((module) => module.ResizablePanelGroup));

export default function Browse({ children }) {
  const [defaultLayout, setDefaultLayout] = React.useState([20, 80]);
  const [isCollapsed, setIsCollapsed] = React.useState(false)
  const navCollapsedSize = 4;
  const resizeRef = React.useRef(null);

  return (
    <ProtectedRoute>
      <TooltipProvider delayDuration={0}>
        <ResizablePanelGroup
          direction="horizontal"
          onLayout={(sizes) => {
            document.cookie = `react-resizable-panels:layout=${JSON.stringify(
              sizes
            )}`
          }}
          className="h-full items-stretch"
        >
          <ResizablePanel
            ref={resizeRef}
            defaultSize={defaultLayout[0]}
            collapsedSize={navCollapsedSize}
            collapsible={true}
            minSize={15}
            maxSize={20}
            onCollapse={() => setIsCollapsed(true)}
            onExpand={() => setIsCollapsed(false)}
            className={cn(isCollapsed && "min-w-[50px] transition-all duration-300 ease-in-out")}
          >
            <Image src={logo} height={120} width={120} />
            <div className={cn("flex h-[52px] pt-2 pl-2", isCollapsed ? 'h-[52px] w-[50px]' : 'px-2')}>
              <UserNav isCollapsed={isCollapsed} />
            </div>
            <Nav
              isCollapsed={isCollapsed}
              links={[
                {
                  title: "Transactions",
                  label: "",
                  href: "/browse/transactions",
                  icon: BadgeIndianRupee,
                },
                {
                  title: "Deliveries",
                  label: "",
                  href: "/browse/deliveries",
                  icon: Truck,
                },
                {
                  title: "Invoices",
                  label: "",
                  href: "/browse/invoices",
                  icon: ReceiptText,
                },
              ]}
            />
          </ResizablePanel >
          <ResizableHandle />
          <div className="mt-96 cursor-pointer" onClick={
            () => {
              setIsCollapsed(prev => !prev)
              if (!isCollapsed) {
                resizeRef.current.collapse()
              } else {
                resizeRef.current.expand()
              }
            }
          }>
            {isCollapsed ?
              <ChevronRight /> : <ChevronLeft />}
          </div>
          <ResizablePanel defaultSize={defaultLayout[1]} minSize={30}>
            {children}
          </ResizablePanel>
        </ResizablePanelGroup>
      </TooltipProvider>
    </ProtectedRoute>
  );

}
