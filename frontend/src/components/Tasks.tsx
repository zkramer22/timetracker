import { useTasksContext } from '../context/TasksProvider'
import type { Task, Project } from '../types'
import TaskTimer from './TaskTimer'
import { getTaskTotal } from '../store/tasksSelectors'
import { Check, ChevronRight, ChevronsUpDown, Folder } from 'lucide-react'
import { Fragment, useMemo, useState, type ChangeEvent } from 'react'

import { Popover, PopoverContent, PopoverTrigger } from './ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from './ui/command'
import { Input } from './ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from './ui/button'
import clsx from 'clsx'


function formatMs(ms: number) {
    const totalSeconds = Math.floor(ms / 1000)
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60
    return [hours, minutes, seconds].map(n => String(n).padStart(2, '0')).join(':')
}

const getLastStartMs = (t: Task) => {
    const entries = Array.isArray(t.entries) ? t.entries : []
    if (entries.length === 0) return 0
    const last = entries[entries.length - 1]
    const d = last?.start instanceof Date ? last.start : new Date(last?.start as any)
    return isNaN(d.getTime()) ? 0 : d.getTime()
}

function ProjectsMenu({
    task,
    projects,
    projectMap,
    onSet
}: {
    task: Task
    projects: Project[]
    projectMap: Record<string, Project>
    onSet: (taskId: string, projectId: string | null) => void
}) {
    const selected = task.projectId ? projectMap[task.projectId] : null

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="outline">
                    <span className={selected ? '' : 'text-gray-400'}>
                        { selected
                            ? `${selected.name} ${selected.client ? ` — ${selected.client}` : ''}`
                            : 'No project assigned'}
                    </span>
                    <ChevronsUpDown className='h-3.5 w-3.5 opacity-60' />
                </Button>
            </PopoverTrigger>

            <PopoverContent className='p-0 w-[--radix-popover-trigger-width]'>
                <Command>
                    <CommandInput placeholder='Search projects…' className='border-none' />
                    <CommandList>
                        <CommandEmpty>No projects found.</CommandEmpty>
                        <CommandGroup>
                            {projects.map(p => (
                                <CommandItem
                                    key={p.id}
                                    value={`${p.name} ${p.client ?? ''}`}
                                    onSelect={() => onSet(task.id, p.id)}
                                    className='flex items-center gap-2'
                                >
                                    <Folder className='opacity-70' />
                                    <div className='min-w-0 flex-1'>
                                        <div className='truncate'>{p.name || 'Untitled Project'}</div>
                                        {p.client && (
                                            <div className='truncate text-xs text-muted-foreground'>
                                                {p.client}
                                            </div>
                                        )}
                                    </div>
                                    {task.projectId === p.id && <Check className='h-4 w-4' />}
                                </CommandItem>
                            ))}
                        </CommandGroup>

                        <CommandSeparator />
                        <CommandGroup>
                            <CommandItem onSelect={() => onSet(task.id, null)}>
                                Clear selection
                            </CommandItem>
                        </CommandGroup>
                    </CommandList>
                </Command>
            </PopoverContent>
        </Popover>
    )
}

export default function Tasks() {
    const { 
        tasks, 
        projects, 
        projectMap, 
        selectedProject, 
        selectedTask, 
        setTaskProject,
        updateTask,
    } = useTasksContext()
    
    const sortedTasks = useMemo(
        () => [...tasks].sort((a, b) => getLastStartMs(b) - getLastStartMs(a)),
        [tasks]
    )

    const visibleTasks = selectedProject
        ? sortedTasks.filter(t => t.projectId === selectedProject.id)
        : sortedTasks

    function handleTaskNameChange(e: ChangeEvent<HTMLInputElement>, taskId: string) {
        updateTask(taskId, { name: e.target.value.trim() })
    }

    const columnCount = 4
    const [openIds, setOpenIds] = useState(new Set())
    const toggleOpen = (id: string) => {
        setOpenIds(prev => {
            const next = new Set(prev)
            next.has(id) ? next.delete(id) : next.add(id)
            return next
        })
    }

    return (
        <>
            <div className="text-xl font-accent mb-4">tasks</div>

            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className='w-10 text-center'>#</TableHead>
                        <TableHead className='w-[250px]'>Title</TableHead>
                        <TableHead className='w-[250px]'>Project</TableHead>
                        <TableHead>Tags</TableHead>
                        <TableHead className='w-[150px]'>Time</TableHead>
                    </TableRow>
                </TableHeader>
                
                <TableBody>
                    { visibleTasks.map((task: Task) => {
                        const totalMs = getTaskTotal(task)
                        const isOpen = openIds.has(task.id)
                        return (
                            <Fragment key={task.id}>
                                <TableRow>
                                    <TableCell className='text-center flex items-center gap-1'>
                                        { task.entries.length > 1 && (
                                            <>
                                                <Button onClick={() => toggleOpen(task.id)}
                                                    variant="outline" size="icon-sm" className='aspect-square'>
                                                    { task.entries.length }
                                                </Button>
                                            </>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <Input 
                                            onChange={ (e) => handleTaskNameChange(e, task.id) } 
                                            onBlur={ e => {
                                                const v = e.target.value.trim()
                                                updateTask(task.id, { name: v || 'Untitled task' })
                                            }}
                                            value={ task.name || 'Untitled task' } 
                                        />
                                    </TableCell>
                                    <TableCell>
                                        <ProjectsMenu 
                                            task={ task }
                                            projects={ projects }
                                            projectMap={ projectMap }
                                            onSet={(taskId, projectId) => setTaskProject(taskId, projectId)}
                                        />
                                    </TableCell>
                                    <TableCell>
                                        { task.tags && task.tags.length > 0 && (
                                            <div className="flex gap-1 mt-1 flex-wrap">
                                                {task.tags.map(tag => (
                                                    <span
                                                        key={ tag }
                                                        className="px-2 py-0.5 text-xs rounded bg-[var(--color-accent)] text-[var(--color-bg)]"
                                                    >
                                                        { tag }
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell className="">
                                        <div className='flex items-center gap-2'>
                                            <div>
                                                { formatMs(totalMs) }
                                            </div>
                                            <TaskTimer task={ task } />
                                        </div>
                                    </TableCell>
                                </TableRow>

                                { isOpen && task.entries.map((entry, i) => {
                                    const start = new Date(entry.start as any)
                                    const end = entry.end ? new Date(entry.end as any) : new Date()
                                    const durMs = Math.max(0, end.getTime() - start.getTime())
                                    return (
                                        <TableRow key={entry.id}>
                                            <TableCell></TableCell>
                                            <TableCell>
                                                entry { i + 1 }
                                            </TableCell>
                                            <TableCell></TableCell>
                                            <TableCell></TableCell>
                                            <TableCell>{ formatMs(durMs) }</TableCell>
                                        </TableRow>
                                    )
                                })}
                            </Fragment>
                        )})
                    }
                </TableBody>
            </Table>
        </>
    )
}
