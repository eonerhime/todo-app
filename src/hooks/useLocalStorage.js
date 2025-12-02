import { useState } from "react";

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading localStorage", error);
      return initialValue;
    }
  });

  // Setter function → sets both state and localStorage
  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;

      setStoredValue(valueToStore);
      localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("Error setting localStorage", error);
    }
  };

  // Getter function → returns **fresh** value from localStorage
  const getValue = () => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("useLocalStorage getValue error:", error);
      return initialValue;
    }
  };

  // Updater function updates a specific item in an array stored in localStorage
  const updateValue = (id, updatedItem) => {
    try {
      const currentValue = getValue();  
      
      if (Array.isArray(currentValue)) {
        const newValue = currentValue.map((item) =>
          item.id === id ? { ...item, ...updatedItem } : item
        );
        setValue(newValue); 
      }
    } catch (error) {
      console.error("useLocalStorage updateValue error:", error);
    }
  };

  const deleteValue = (id) => {
    try {
      const currentValue = getValue();  
      if (Array.isArray(currentValue)) {
        const newValue = currentValue.filter((item) => item.id !== id);
        setValue(newValue);  
      }
    } catch (error) {
      console.error("useLocalStorage deleteValue error:", error);
    }
  };

  return { storedValue, setValue, getValue, updateValue, deleteValue };
}
