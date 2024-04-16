"use client"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useForm } from "react-hook-form"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import axios from '@/config/axios.new.config'
import { toast } from "@/components/ui/use-toast"
import { useRouter } from "next/navigation"


const userSchema = z.object({
  firstName: z.string({ required_error: 'First name is required', invalid_type_error: 'First name must be a string'}),
  lastName: z.string({ required_error: 'First name is required', invalid_type_error: 'First name must be a string'}),
  email: z.string().email('Invalid email format').refine(data => {
    const isValidEmail = /\S+@\S+\.(com|in)$/.test(data);
    return isValidEmail || 'Invalid email format';
  }),
  password: z.string().min(6),
})

export default function SignUpForm() {
  const form = useForm({
    resolver: zodResolver(userSchema)
  })
  const router = useRouter()


  async function onSubmit(data) {
    try {
      const response = await axios.post('/api/employees', data);
      toast({
        title: "Registration Success",
        description: response.data.message,
      })
      router.push('/login');
    } catch (error) {
      console.error(error, "error while creating an account")
      toast({
        title: "Registration Failed",
        description: error.response.data.message,
      })
      console.error('Error during registration:', error.response.data.message);
    }
  }

  return (
    <div className="grid place-items-center h-full">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-xl">Sign Up</CardTitle>
          <CardDescription>
            Enter your information to create an account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form} >
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="m@example.com" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid gap-2">
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>password</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <Button type="submit" className="w-full">
                Create an account
              </Button>
            </form>
            <div className="mt-4 text-center text-sm">
              Already have an account?{" "}
              <Link href="/login" className="underline">
                Sign in
              </Link>
            </div>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

