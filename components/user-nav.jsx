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
import { useAtom } from 'jotai';
import { tokenWithPersistenceAtom } from "@/lib/authAtom";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

export function UserNav({ isCollapsed }) {
  const [_, setToken] = useAtom(tokenWithPersistenceAtom);
  const router = useRouter();

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
            <AvatarFallback>HM</AvatarFallback>
          </Avatar>
          <span className={cn("ml-4", isCollapsed && "hidden")}>Hrishikesh Mhatre</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">Hrishikesh Mhatre</p>
            <p className="text-xs leading-none text-muted-foreground">
              exy@example.com
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => {
          // setToken(null);
          localStorage.removeItem('userToken')
          router.replace('/login');
        }}>
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
