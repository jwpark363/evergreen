import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import GlobalStyle from './styles/globalstyle.ts'
import { ThemeProvider } from 'styled-components'

const theme = {
  colors: {
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    textMain: '#111827',
    textMuted: '#4b5563',
    white: '#ffffff',
  },
  breakpoints: {
    tablet: '768px',
    desktop: '1024px',
  },
};
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <App />
    </ThemeProvider>
  </StrictMode>,
)
