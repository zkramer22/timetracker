import { useState, useRef, useEffect } from 'react'

export function useTimer() {
    const [isRunning, setIsRunning] = useState(false)
    const [elapsed, setElapsed] = useState(0)
    const startTimeRef = useRef<number | null>(null)
    const intervalRef = useRef<number | null>(null)

    useEffect(() => {
        if (isRunning) {
            startTimeRef.current = Date.now() - elapsed
            intervalRef.current = window.setInterval(() => {
                if (startTimeRef.current) {
                    setElapsed(Date.now() - startTimeRef.current)
                }
            }, 100)
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current)
            }
        }
    }, [isRunning])

    function start() {
        setIsRunning(true)
    }

    function stop() {
        setIsRunning(false)
    }

    function reset() {
        setIsRunning(false)
        setElapsed(0)
    }

    return {
        isRunning,
        elapsed,
        start,
        stop,
        reset
    }
}
