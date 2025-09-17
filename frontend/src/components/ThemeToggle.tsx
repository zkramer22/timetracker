import { useEffect, useState } from 'react'

export default function ThemeToggle() {
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
        // Check localStorage first
        const attr = document.documentElement.getAttribute('data-theme') as 'light' | 'dark' | null
        if (attr) return attr

        // Fallback to system preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
        return prefersDark ? 'dark' : 'light'
    })

    useEffect(() => {
        document.documentElement.setAttribute('data-theme', theme)
        localStorage.setItem('theme', theme)
    }, [theme])

    return (
        <button
            className="px-4 py-2 border rounded"
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
            {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
        </button>
    )
}
