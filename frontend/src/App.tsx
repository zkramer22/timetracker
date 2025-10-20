import { useEffect, useRef } from 'react'

import Timer from './components/Timer'
import Projects from './components/Projects'
import Tasks from './components/Tasks'

import { useTimeTracking } from './hooks/useTimeTracking'
import { useTasksContext } from './context/TasksProvider'
import { Input } from './components/ui/input'

export default function App() {
    const { timer, startNewTask, stopTimer } = useTimeTracking()
    const { taskMap, draftTask, setDraftTask } = useTasksContext()
    const taskNameRef = useRef<HTMLInputElement>(null)

    const isResumedRun = Boolean(timer.isRunning && !draftTask)
    const currentTaskName = isResumedRun && timer.taskId 
        ? (taskMap[timer.taskId]?.name ?? '') 
        : (draftTask?.name ?? '')

    const clearTaskName = () => {
        if (taskNameRef.current) taskNameRef.current.value = ''
    }

    useEffect(() => {
        if (!taskNameRef.current) return
        if (isResumedRun) {
            taskNameRef.current.value = currentTaskName
        }
    }, [isResumedRun, currentTaskName])

    useEffect(() => {
        if (!timer.isRunning) clearTaskName()
    }, [timer.isRunning])
    
    function handleStart() {
        const name = taskNameRef?.current?.value?.trim() || ''
        startNewTask(name)
    }

    function handleStop() {
        stopTimer()
    }

    function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.value
        // Only sync into draftTask during a NEW task run
        if (timer.isRunning && draftTask && timer.taskId === draftTask.id) {
            setDraftTask(prev => (prev ? { ...prev, name: value } : prev))
        }
    }

    return (
        <>
            <nav className="container py-4 flex justify-between">
                <div className='flex flex-auto items-center gap-2'>
                    <div className="logo flex place-center">
                        <img src="/img/react.svg" alt="" />
                    </div>
                    <span className='text-2xl'>timetracker</span>
                </div>
                <div className='flex flex-auto items-center gap-2'>
                    <Input
                        type="text"
                        id="taskName"
                        name="taskName"
                        ref={taskNameRef}
                        className='flex-auto'
                        placeholder="Whatcha trackin'?"
                        autoFocus
                        disabled={isResumedRun}
                        onChange={handleNameChange}
                    />
                    <Timer
                        isRunning={timer.isRunning}
                        elapsed={timer.elapsed}
                        onStart={handleStart}
                        onStop={handleStop}
                        buttonLabel={timer.isRunning ? 'Stop' : 'Start'}
                    />
                </div>
            </nav>

            {/* <section id="projects" className='container border-b-3'>
                <Projects />
            </section> */}

            <section id="tasks" className='container border-b-3'>
                <Tasks />
            </section>
        </>
    )
}