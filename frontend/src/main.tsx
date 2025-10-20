import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './base.scss'
import './index.css'
import './App.scss'

import { TimerProvider } from './context/TimerProvider'
import { TasksProvider } from './context/TasksProvider'

import App from './App'

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <TimerProvider>
            <TasksProvider>
                <App />
            </TasksProvider>
        </TimerProvider>
    </StrictMode>
)
