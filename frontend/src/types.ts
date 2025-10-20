export type Project = {
    id: string
    name: string
    createdAt: Date
    client?: string
    tags?: string[]
    description?: string
}

export type Task = {
    id: string
    projectId?: string | null
    entries: Entry[]
    
    name?: string
    tags?: string[]
    notes?: string[]
    description?: string
}

export type Entry = {
    id: string
    taskId: string
    start: Date
    
    end?: Date
    description?: string
}