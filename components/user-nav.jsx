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
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ProfileForm } from "./profile-form";
import axios from '@/config/axios.new.config'
import { CaretSortIcon } from '@radix-ui/react-icons'
import CreateAccountForm from "@/components/create-account";

export const userInfoAtom = atom({})

export function UserNav({ isCollapsed }) {
  const router = useRouter();
  const [userInfo, setUserInfo] = useAtom(userInfoAtom)
  const [showDialog, setShowDialog] = React.useState(false)
  const [profile, setProfile] = React.useState({})
  const [showAccountDialog, setShowAccountDialog] = React.useState(false)

  async function getUserInfo() {
    const { data } = await axios.get('/api/employees/me')
    const { firstName, lastName } = data
    data['initials'] = firstName[0] + lastName[0]
    data['name'] = firstName + " " + lastName
    setUserInfo(data)
  }

  async function getProfile() {
    const { data } = await axios.get('/api/employees/' + userInfo._id)
    setProfile(data)
  }

  React.useEffect(() => {
    getUserInfo()
  }, [])

  return (
    <>
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
            <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
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
          <DropdownMenuItem onClick={async () => { await getProfile(); setShowDialog(true) }}>
            Profile
          </DropdownMenuItem>
          {userInfo?.level === 1 &&
            <DropdownMenuItem onClick={() => setShowAccountDialog(true)}>Create account</DropdownMenuItem>
          }
          <DropdownMenuItem onClick={() => {
            localStorage.clear()
            router.replace('/login');
          }}>
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[1000px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Update profile
            </DialogDescription>
          </DialogHeader>
          <ProfileForm closeModal={() => setShowDialog(false)} data={profile} />
        </DialogContent>
      </Dialog>
      <Dialog open={showAccountDialog} onOpenChange={setShowAccountDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create account</DialogTitle>
            <DialogDescription>
              Enter your information to create an account
            </DialogDescription>
          </DialogHeader>
          <CreateAccountForm closeModal={() => setShowAccountDialog(false)} />
        </DialogContent>
      </Dialog>
    </>
  )
}
