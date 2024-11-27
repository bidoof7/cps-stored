// hooks/useDebounce.ts
import { useState, useEffect } from "react";

/**
 * Custom hook for debouncing values.
 * @param value: The value to debounce.
 * @param delay: The debounce delay in milliseconds (default is 500ms).
 * @returns debouncedValue: The debounced value after the delay.
 */
export function useDebounce<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    // Set a timeout to update debouncedValue after the specified delay
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // Cleanup function to clear the timeout if value or delay changes
    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]); // Re-run the effect when value or delay changes

  return debouncedValue;
}
