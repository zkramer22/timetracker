import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './base.scss'
import './index.css'
import './App.scss'

import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
