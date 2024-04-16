"use client"

// Import necessary dependencies
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

// Define Zod schema for form validation
const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email format').refine(data => {
    // Custom validation function for email
    const isValidEmail = /\S+@\S+\.(com|in)$/.test(data);
    return isValidEmail || 'Invalid email format';
  }),
  password: z.string().min(6),

});

const Register = () => {
  const router = useRouter();
  const { toast } = useToast()

  const { handleSubmit, register, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    // Make API call to your backend with the provided credentials
    try {
      const response = await axios.post('/api/employees', data);
      toast({
        title: "Registration Success",
        description: response.data.message,
      })
      router.push('/login');
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: error.response.data.message,
      })
      console.error('Error during registration:', error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-96">
        <h1 className="text-2xl font-semibold mb-6">Create an account</h1>
        <p className="font-sm mb-6">Enter your email below to create your account</p>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">
              User Name
            </label>

            <Input
              type="name"
              placeholder="Name"
              {...register('name')}
              className={`border ${errors.email ? 'border-red-500' : 'border-gray-300'} px-3 py-2 rounded-md w-full`}
            />
            {errors.name && (
              <span className="text-red-500 text-sm">{errors.name.message}</span>
            )}
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email
            </label>

            <Input
              type="email"
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
            Create Account
          </Button>
        </form>
        <div className='flex items-center mt-8 ml-2'>
          <p className='text-sm'>Already have an account?</p>
          <Link href="/login">
            <p className="ml-2 underline">Sign in</p>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;








