import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { atom, useAtom } from 'jotai'
import React from "react";

export const userInfoAtom = atom({})

export function UserNav({ isCollapsed }) {
  const router = useRouter();
  const [userInfo, setUserInfo] = useAtom(userInfoAtom)

  async function getUserInfo() {
    const data = {
      name: 'Hrishikesh Mhatre',
      access: 1,
      email: 'example@test.com'
    }
    data['initials'] = data.name.split(" ").map(x => x[0]).join("")
    setUserInfo(data)
  }

  React.useEffect(() => {
    getUserInfo()
  }, [])

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className={
          cn(
            "h-10 w-full flex",
            isCollapsed && "justify-center",
            !isCollapsed && "justify-start border border-secondary-500 rounded-md"
          )
        }>
          <Avatar className="h-8 w-8">
            <AvatarImage src="/avatars/01.png" alt="@shadcn" />
            <AvatarFallback>{userInfo?.initials}</AvatarFallback>
          </Avatar>
          <span className={cn("ml-4", isCollapsed && "hidden")}>{userInfo?.name}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{userInfo?.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {userInfo?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {
          localStorage.clear()
          router.replace('/login');
        }}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
