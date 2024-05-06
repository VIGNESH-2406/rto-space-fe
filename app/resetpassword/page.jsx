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
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { useSearchParams } from 'next/navigation'
import axios from 'axios'
import { useRouter } from 'next/navigation'
import { useToast } from "@/components/ui/use-toast"
import { CircleCheck } from 'lucide-react';
import { Suspense } from "react"

export default function PasswordResetWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PasswordReset />
    </Suspense>
  )
}

function PasswordReset() {
  const form = useForm()
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const router = useRouter()
  const { toast } = useToast()

  async function onSubmit({ password }) {
    try {
      await axios.put(`${process.env.NEXT_PUBLIC_API_URL}/api/employees/resetpassword`, { password }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      toast({
        title: (
          <div className="flex items-center">
            <CircleCheck className="text-white bg-green-500 rounded-full" />
            <span className="ml-2">Password reset successfully</span>
          </div>
        )
      })
      router.replace('/login')
    } catch (err) {
      console.log("error", err)
      toast({
        variant: "destructive",
        title: "Oops! Something went wrong",
        description: "There was a problem with your request"
      })
    }
  }

  return (
    <Form {...form}>
      <form
        className="container grid place-items-center h-full"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <Card className="w-full max-w-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Password reset</CardTitle>
            <CardDescription>
              Enter your new password below to login to your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        {...form.register("password", {
                          required: "Password is required",
                          minLength: {
                            value: 6,
                            message: "Password must be at least 6 characters long"
                          }
                        })} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-2">
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        {...form.register("confirmPassword", {
                          validate: (value) =>
                            value === form.getValues("password") ||
                            "Both passwords should match",
                        })}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button className="w-full">Reset password</Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  )
}
