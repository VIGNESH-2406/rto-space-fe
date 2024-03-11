"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import axios from "axios"

const register = () => {
    const router = useRouter();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleUsernameChange = (e) => {
        setUsername(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Make API call to your backend with the provided credentials
        try {
            const response = await axios.post('http://localhost:3005/api/login', {
                username, password
            });

            if (response.ok) {
                // Redirect to the dashboard or another page upon successful login
                router.push('/dashboard');

            } else {
                // Handle login failure, show error message, etc.
                console.error('register failed');
                router.push('/register');

            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded shadow-md w-96">
                <h1 className="text-2xl font-semibold mb-6">Create an account</h1>
                <p className=" font-sm mb-6">Enter your email below to create your account</p>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label htmlFor="username" className="block text-sm font-medium text-gray-600">
                            Username
                        </label>

                        <Input type="email" placeholder="Email" value={username} onChange={handleUsernameChange} />
                    </div>
                    <div className="mb-4">
                        <label htmlFor="password" className="block text-sm font-medium text-gray-600">
                            Password
                        </label>

                        <Input type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />

                    </div>

                    <Button

                        type="submit" variant="outline">
                        Submit
                    </Button>
                </form>
            </div>
        </div>
    );
};

export default register;







