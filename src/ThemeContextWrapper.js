import { ThemeProvider, createTheme, CssBaseline } from '@mui/material'
import { theme, darkTheme } from './styles/theme'
import { FC, useEffect, useState } from 'react'
import { ThemeContext } from './tools/ThemeContext'

export const ThemeContextWrapper = ({ children }) => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkmode') === 'true' ? true : false)

  return <ThemeContext.Provider value={[darkMode, setDarkMode]}>
    <ThemeProvider theme={createTheme(darkMode ? darkTheme : theme)}>
      <CssBaseline />
      { children }
    </ThemeProvider>
  </ThemeContext.Provider>
}
