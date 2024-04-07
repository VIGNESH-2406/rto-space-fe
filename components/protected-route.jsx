import React from 'react';
import { useAtom } from 'jotai';
import { tokenWithPersistenceAtom } from "@/lib/authAtom";
import { useRouter } from 'next/navigation'

// TODO: call backend to validate token
const isValidToken = (token) => {
  console.log("validate token", token)
  return token != null;
};

const ProtectedRoute = ({ children }) => {
  const [token] = useAtom(tokenWithPersistenceAtom);
  const router = useRouter();

  React.useEffect(() => {
    if (!isValidToken(token)) {
      router.replace('/login'); // Use router.replace to prevent going back
    }
  }, [token, router]);

  if (!isValidToken(token)) {
    return null;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
