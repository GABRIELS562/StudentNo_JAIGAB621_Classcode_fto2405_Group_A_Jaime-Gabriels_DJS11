import React from 'react';
import { MoonIcon, SunIcon } from '@radix-ui/react-icons';
import { Button } from '@radix-ui/themes';

function ThemeToggle({ theme, toggleTheme }) {
  return (
    <Button variant="ghost" onClick={toggleTheme} className="theme-toggle">
      {theme === 'light' ? <MoonIcon /> : <SunIcon />}
    </Button>
  );
}

export default ThemeToggle;