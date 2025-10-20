import { Play, Square } from "lucide-react"
import { useTimeTracking } from "../hooks/useTimeTracking"
import type { Task } from "../types"
import { Button } from './ui/button'

export default function TaskTimer({ task }: { task: Task }) {
    const { timer, resumeTask, stopTimer } = useTimeTracking()

    const isActive = Boolean(timer.isRunning && timer.taskId === task.id)
    const isDisabled = Boolean(timer.isRunning && timer.taskId !== task.id)
    
    return (
        <>
            <Button onClick={ isActive ? stopTimer : () => resumeTask(task.id) } 
                disabled={ isDisabled } className="rounded-full aspect-square" size="icon-sm" variant="ghost"
            >
                { isActive ? (
                    <Square />
                ) : (
                    <Play />
                )}
            </Button>
        </>
    )
}