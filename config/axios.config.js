import axios from 'axios';
import { useAtomValue } from 'jotai';
import { tokenWithPersistenceAtom } from '@/lib/authAtom';

export const useAxios = () => {
  const authToken = useAtomValue(tokenWithPersistenceAtom);

  const instance = axios.create({
    baseURL: 'http://localhost:8080',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Add a request interceptor to include the auth token in every request
  instance.interceptors.request.use(
    (config) => {
      if (authToken) {
        config.headers.Authorization = `Bearer ${authToken}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  return instance;
};
