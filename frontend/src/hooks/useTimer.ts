import { useState, useRef, useEffect } from 'react'

export function useTimer() {
    const [isRunning, setIsRunning] = useState(false)
    const [elapsed, setElapsed] = useState(0)
    const [taskId, setTaskId] = useState<string | null>(null) // track which task

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

    function start(id?: string) {
        if (id) setTaskId(id)
        setIsRunning(true)
    }

    function stop() {
        setIsRunning(false)
    }

    function reset() {
        setIsRunning(false)
        setElapsed(0)
        setTaskId(null)
    }

    return {
        isRunning,
        elapsed,
        taskId,
        start,
        stop,
        reset,
    }
}
