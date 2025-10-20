import type { Task } from '../types'

export function getTaskTotal(task: Task): number {
    return task.entries.reduce((sum, e) => e.end
        ? sum + (e.end.getTime() - e.start.getTime()) 
        : sum 
    , 0
    )
}
