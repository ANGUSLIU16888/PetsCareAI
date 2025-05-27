import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx';
import { SettingsProvider } from './context/SettingsContext.jsx'; // Added

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <SettingsProvider> {/* Added */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </SettingsProvider> {/* Added */}
  </StrictMode>,
)
