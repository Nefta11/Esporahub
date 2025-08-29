import React from 'react';
import '@/styles/components/layout/theme-toggle.css';

interface ThemeToggleProps {
  isDarkMode: boolean;
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ isDarkMode, onToggle }) => {
  return (
    <button
      className="theme-toggle-btn"
      onClick={onToggle}
      title={isDarkMode ? "Cambiar a modo claro" : "Cambiar a modo oscuro"}
    >
      {isDarkMode ? (
        // Apple's sun.max (Sistema)
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="10" cy="10" r="3" fill="currentColor"/>
          <path d="M10 1V3M10 17V19M4.22 4.22L5.64 5.64M14.36 14.36L15.78 15.78M1 10H3M17 10H19M4.22 15.78L5.64 14.36M14.36 5.64L15.78 4.22" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
        </svg>
      ) : (
        // Apple's moon (Sistema)
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" fill="currentColor"/>
        </svg>
      )}
    </button>
  );
};

export default ThemeToggle;