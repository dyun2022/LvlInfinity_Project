/**
 * useLocalStorage Hook
 * 
 * Custom hook for managing localStorage state in React.
 * Keeps state in sync with localStorage automatically.
 * 
 * Example:
 *   const [token, setToken] = useLocalStorage("auth_token", null);
 *   // Automatically saved/loaded from localStorage
 */

import { useState, useEffect, useCallback } from "react";

export function useLocalStorage(key, initialValue = null) {
  const [state, setState] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = useCallback((value) => {
    try {
      const valueToStore = value instanceof Function ? value(state) : value;
      setState(valueToStore);
      
      if (valueToStore === null || valueToStore === undefined) {
        localStorage.removeItem(key);
      } else {
        localStorage.setItem(key, JSON.stringify(valueToStore));
      }
    } catch (error) {
      console.error(`Error writing to localStorage key "${key}":`, error);
    }
  }, [key, state]);

  // Listen for storage changes in other tabs/windows
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === key && e.newValue) {
        try {
          setState(JSON.parse(e.newValue));
        } catch (error) {
          console.error("Error syncing localStorage:", error);
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [key]);

  return [state, setValue];
}
