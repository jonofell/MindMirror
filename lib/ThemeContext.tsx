
import React, { createContext, useContext, useState } from 'react';

type ThemeType = 'pinkBlue' | 'greenYellow';

interface ThemeContextType {
  currentTheme: ThemeType;
  toggleTheme: () => void;
  getGradientColors: () => string[];
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [currentTheme, setCurrentTheme] = useState<ThemeType>('pinkBlue');

  const toggleTheme = () => {
    setCurrentTheme(current => current === 'pinkBlue' ? 'greenYellow' : 'pinkBlue');
  };

  const getGradientColors = () => {
    return currentTheme === 'pinkBlue' 
      ? [Theme.colors.gradientStart, Theme.colors.gradientEnd]
      : ['#F0FFE5', '#FFFFE0'];
  };

  return (
    <ThemeContext.Provider value={{ currentTheme, toggleTheme, getGradientColors }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
