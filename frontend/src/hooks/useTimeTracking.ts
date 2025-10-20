import { useTimerContext } from '../context/TimerProvider'
import { useTasksContext } from '../context/TasksProvider'
import type { Entry, Task } from '../types'

export function useTimeTracking() {
    const timer = useTimerContext()
    const {
        setTasks,
        taskMap,
        selectedProject,
        setSelectedTask,
        draftTask,
        setDraftTask
    } = useTasksContext()

    function startNewTask(name: string) {
        const id = crypto.randomUUID()
        const entry: Entry = {
            id: crypto.randomUUID(),
            taskId: id,
            start: new Date()
        }
        const task: Task = {
            id,
            projectId: selectedProject?.id ?? '',
            entries: [entry],
            name: name || '',
            tags: [],
            notes: []
        }

        setDraftTask(task)
        setSelectedTask(task)

        timer.reset()
        timer.start(id)
    }

    function resumeTask(taskId: string) {
        if (timer.isRunning) return // Policy A (safe)
        const entry: Entry = {
            id: crypto.randomUUID(),
            taskId,
            start: new Date()
        }
        setTasks(prev =>
            prev.map(t =>
                t.id === taskId
                    ? { ...t, entries: [...t.entries, entry] }
                    : t
            )
        )

        setDraftTask(null)
        setSelectedTask(taskMap[taskId] ?? null)

        timer.reset()
        timer.start(taskId)
    }

    function stopTimer() {
        const activeId = timer.taskId
        if (!activeId) {
            timer.reset()
            return
        }

        const now = new Date()

        if (draftTask && draftTask.id === activeId) {
            const finalized = {
                ...draftTask,
                entries: draftTask.entries.map((e, i, arr) =>
                    i === arr.length - 1 && !e.end ? { ...e, end: now } : e
                )
            }
            setTasks(prev => [finalized, ...prev])
            setDraftTask(null)
        } 
        else {
            setTasks(prev =>
                prev.map(t => {
                    if (t.id !== activeId) return t
                    const entries = [...t.entries]
                    for (let i = entries.length - 1; i >= 0; i--) {
                        if (!entries[i].end) {
                            entries[i] = { ...entries[i], end: now }
                            break
                        }
                    }
                    return { ...t, entries }
                })
            )
        }

        setSelectedTask(null)

        timer.stop()
        timer.reset()
    }

    return {
        startNewTask,
        resumeTask,
        stopTimer,
        timer
    }
}
