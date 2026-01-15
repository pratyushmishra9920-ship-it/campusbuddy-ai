import { useState, useEffect } from 'react';

export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T | ((prev: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(`Error reading localStorage key "${key}":`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((prev: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

export function clearAllAppData() {
  const keys = [
    'campusbuddy-revision-plan',
    'campusbuddy-cgpa-data',
    'campusbuddy-attendance-data',
    'campusbuddy-recent-outputs',
    'campusbuddy-checklist',
  ];
  keys.forEach(key => localStorage.removeItem(key));
}

export function exportAllAppData(): string {
  const keys = [
    'campusbuddy-revision-plan',
    'campusbuddy-cgpa-data',
    'campusbuddy-attendance-data',
    'campusbuddy-recent-outputs',
    'campusbuddy-checklist',
  ];
  
  const data: Record<string, unknown> = {};
  keys.forEach(key => {
    const item = localStorage.getItem(key);
    if (item) {
      data[key] = JSON.parse(item);
    }
  });
  
  return JSON.stringify(data, null, 2);
}
