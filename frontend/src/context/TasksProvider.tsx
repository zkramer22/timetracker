import { createContext, useContext, useEffect, useMemo, useState } from 'react'
import type { ReactNode } from 'react'
import type { Project, Task } from '../types'

function load<T>(key: string, fallback: T): T {
    const raw = localStorage.getItem(key)
    if (!raw) return fallback
    try {
        return JSON.parse(raw, (_, v) =>
            typeof v === 'string' && /^\d{4}-\d{2}-\d{2}T/.test(v)
                ? new Date(v)
                : v
        )
    } catch {
        return fallback
    }
}

type TasksCtx = {
    projects: Project[]
    setProjects: React.Dispatch<React.SetStateAction<Project[]>>
    projectMap: Record<string, Project>
    selectedProject: Project | null
    setSelectedProject: (p: Project | null) => void

    tasks: Task[]
    setTasks: React.Dispatch<React.SetStateAction<Task[]>>
    taskMap: Record<string, Task>
    selectedTask: Task | null
    setSelectedTask: (t: Task | null) => void
    draftTask: Task | null
    setDraftTask: React.Dispatch<React.SetStateAction<Task | null>>
    updateTask: (taskId: string, patch: Partial<Task>) => void
    setTaskProject: (taskId: string, projectId: string | null) => void
}

const TasksContext = createContext<TasksCtx | null>(null)

export function TasksProvider({ children }: { children: ReactNode }) {
    // --------- projects --------- //
    const [projects, setProjects] = useState<Project[]>(() => load('projects', []))
    useEffect(() => localStorage.setItem('projects', JSON.stringify(projects)), [projects])
    const projectMap = useMemo(() => Object.fromEntries(projects.map(p => [p.id, p])), [projects])
    const [selectedProject, setSelectedProject] = useState<Project | null>(null)

    // --------- tasks --------- //
    const [tasks, setTasks] = useState<Task[]>(() => load('tasks', []))
    useEffect(() => localStorage.setItem('tasks', JSON.stringify(tasks)), [tasks])
    const taskMap = useMemo(() => Object.fromEntries(tasks.map(t => [t.id, t])), [tasks])

    const [selectedTask, setSelectedTask] = useState<Task | null>(null)
    const [draftTask, setDraftTask] = useState<Task | null>(null)

    function updateTask(taskId: string, patch: Partial<Task>) {
        setTasks(prev =>
            prev.map(t => (t.id === taskId ? { ...t, ...patch } : t))
        )
    }

    function setTaskProject(taskId: string, projectId: string | null) {
        setTasks(prev =>
            prev.map(t => (t.id === taskId ? { ...t, projectId } : t))
        )
    }
    
    return (
        <TasksContext.Provider value={{
            projects,
            setProjects,
            projectMap,
            selectedProject,
            setSelectedProject,

            tasks,
            setTasks,
            taskMap,
            selectedTask,
            setSelectedTask,
            draftTask,
            setDraftTask,
            updateTask,
            setTaskProject,
        }}>
            { children }
        </TasksContext.Provider>
    )
}

export function useTasksContext() {
    const ctx = useContext(TasksContext)
    if (!ctx) throw new Error('useTasksContext must be used within <TasksProvider>')
    return ctx
}
