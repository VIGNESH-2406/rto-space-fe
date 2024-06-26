import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function objectToQueryString(obj) {
  if (typeof obj !== 'object' || obj === null) {
    return '';
  }

  const keyValuePairs = [];
  for (const key in obj) {
    if (typeof obj[key] === 'string' && obj[key].trim() !== '') {
      keyValuePairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(obj[key])}`);
    }
  }

  return keyValuePairs.join('&');
}

export function debounce(func, timeout = 500) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => { func.apply(this, args); }, timeout);
  };
}

export const isBrowser = () => {
  return typeof window !== 'undefined'
}

export const nextLocalStorage = () => {
  if (isBrowser()) {
    return window.localStorage
  }
}
