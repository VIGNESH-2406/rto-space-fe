"use client"
import React from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// Define Zod schema for form validation
const schema = z.object({
  email: z.string().email('Invalid email format').refine(data => {
    // Custom validation function for email
    const isValidEmail = /\S+@\S+\.(com|in)$/.test(data);
    return isValidEmail || 'Invalid email format';
  }),
  password: z.string().min(3),

});

const Login = () => {
  const router = useRouter();
  const { handleSubmit, register, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data) => {
    // Make API call to your backend with the provided credentials
    try {
      const response = await axios.post('http://localhost:3005/api/login', data);

      if (response.ok) {
        // Redirect to the dashboard or another page upon successful login
        router.push('/dashboard');
      } else {
        // Handle login failure, show error message, etc.
        console.error('Login failed');
        router.push('/register');
      }
    } catch (error) {
      console.error('Error during login:', error);
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
            Submit
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Login;


// "use client"

// import React, { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
// import axios from "axios"

// const Login = () => {
//     const router = useRouter();
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');

//     const handleUsernameChange = (e) => {
//         setUsername(e.target.value);
//     };

//     const handlePasswordChange = (e) => {
//         setPassword(e.target.value);
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         // Make API call to your backend with the provided credentials
//         try {
//             const response = await axios.post('http://localhost:3005/api/login', {
//                 username, password
//             });

//             if (response.ok) {
//                 // Redirect to the dashboard or another page upon successful login
//                 router.push('/dashboard');
//             } else {
//                 // Handle login failure, show error message, etc.
//                 console.error('Login failed');
//                 router.push('/register');

//             }
//         } catch (error) {
//             console.error('Error during login:', error);
//         }
//     };

//     return (
//         <div className="min-h-screen flex items-center justify-center bg-gray-100">
//             <div className="bg-white p-8 rounded shadow-md w-96">
//                 <h1 className="text-2xl font-semibold mb-6">Login</h1>
//                 <form onSubmit={handleSubmit}>
//                     <div className="mb-4">
//                         <label htmlFor="username" className="block text-sm font-medium text-gray-600">
//                             Username
//                         </label>

//                         <Input type="email" placeholder="Email" value={username} onChange={handleUsernameChange} />
//                     </div>
//                     <div className="mb-4">
//                         <label htmlFor="password" className="block text-sm font-medium text-gray-600">
//                             Password
//                         </label>

//                         <Input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />

//                     </div>

//                     <Button type="submit" variant="outline">
//                         Submit
//                     </Button>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default Login;







