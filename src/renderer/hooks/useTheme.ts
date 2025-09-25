import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    loadTheme();
  }, []);

  const loadTheme = async () => {
    const electronAPI = (window as any).electronAPI;
    if (electronAPI) {
      const savedTheme = await electronAPI.getStoreValue('theme');
      if (savedTheme) {
        setTheme(savedTheme);
      }
    }
  };

  const toggleTheme = async () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    
    const electronAPI = (window as any).electronAPI;
    if (electronAPI) {
      await electronAPI.setStoreValue('theme', newTheme);
    }
  };

  return { theme, toggleTheme };
};