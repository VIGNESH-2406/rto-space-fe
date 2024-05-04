"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Link from 'next/link';
import { useToast } from "@/components/ui/use-toast"
import axios from '@/config/axios.new.config';
import { nextLocalStorage } from '@/lib/utils';

// Define Zod schema for form validation
const schema = z.object({
  email: z.string().email('Invalid email format').refine(data => {
    // Custom validation function for email
    const isValidEmail = /\S+@\S+\.(com|in)$/.test(data);
    return isValidEmail || 'Invalid email format';
  }),
  password: z.string().min(6),

});

const Login = () => {
  const router = useRouter();
  const { toast } = useToast()

  const { handleSubmit, register, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    // Make API call to your backend with the provided credentials
    try {
      const response = await axios.post('/api/employees/auth', data);

      nextLocalStorage()?.setItem('userToken', response.data.userToken)
      router.push('/');
    } catch (error) {
      // Handle login failure, show error message, etc.
      toast({
        title: "Login Failed",
        description: error.response.data.message,
      })
      console.error('Error during login:', error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-semibold mb-6">Login</h1>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>

            <Input
              type="text"
              placeholder="Email"
              {...register('email')}
              className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} px-3 py-2 rounded-md w-full`}
            />
            {errors.email && (
              <span className="text-red-500 text-sm">{errors.email.message}</span>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>

            <Input
              type="password"
              placeholder="Password"
              {...register('password')}
              className={`border ${errors.password ? 'border-red-500' : 'border-gray-300'} px-3 py-2 rounded-md w-full`}
            />
            {errors.password && (
              <span className="text-red-500 text-sm">{errors.password.message}</span>
            )}
          </div>

          <Button type="submit" variant="outline">
            Login
          </Button>
        </form>
        <div className='flex items-center mt-8 ml-2'>
          <p className='text-sm'>Don&apos;t have an account?</p>
          <Link href="/create-account">
            <p className="ml-2 underline">Register</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
