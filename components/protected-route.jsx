"use client"
import React from 'react';
import { useRouter } from 'next/navigation'
import { nextLocalStorage } from '@/lib/utils';

// TODO: call backend to validate token
const isValidToken = (token) => {
  return token != null;
};

const ProtectedRoute = ({ children }) => {
  const router = useRouter();
  const token = nextLocalStorage()?.getItem('userToken')

  React.useEffect(() => {
    if (!isValidToken(token)) {
      router.replace('/login'); // Use router.replace to prevent going back
    }
  }, [router]);

  if (!isValidToken(token)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
