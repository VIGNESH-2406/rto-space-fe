"use client"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import axios from '@/config/axios.new.config'
import { useState } from "react"
import { useRouter } from "next/navigation"

function ForgotPassword() {

  const [email, setEmail] = useState()
  const [isMailSent, setIsMailSent] = useState(false)
  const router = useRouter()

  const { toast } = useToast()

  async function sendEmail() {
    try {
      await axios.post('/employees/forgotpassword', { email })
      setIsMailSent(true)
    } catch (err) {
      toast({
        variant: "destructive",
        title: "Oops! Something went wrong",
        description: "There was a problem with your request"
      })
    }
  }

  return (
    <div className="h-full grid place-items-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl">Reset your password</CardTitle>
          {!isMailSent && <CardDescription>
            Enter your user account's verified email address and we will send you a password reset link.
          </CardDescription>}
          {isMailSent && <CardDescription>
            Check your email for a link to reset your password.
            If it doesn’t appear within a few minutes, check your spam folder.
          </CardDescription>}
        </CardHeader>
        {!isMailSent && <CardContent className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required onChange={e => setEmail(e.target.value)} />
          </div>
        </CardContent>}
        <CardFooter>
          {!isMailSent && <Button className="w-full" onClick={sendEmail}>Send password reset email</Button>}
          {isMailSent && <Button className="w-full" onClick={() => router.replace('/login')}>Return to sign in</Button>}
        </CardFooter>
      </Card>
    </div>
  )
}

export default ForgotPassword
