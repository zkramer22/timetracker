import clsx from 'clsx'

import { useRef, useState, useMemo } from 'react'
import { useTasksContext } from '../context/TasksProvider'
import type { Project } from '../types'
import { Button } from './ui/button'
import { Check, Plus, X } from 'lucide-react'
import { Input } from './ui/input'
import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemTitle,
} from "@/components/ui/item"

export default function Projects() {
    const { projects, setProjects, selectedProject, setSelectedProject } = useTasksContext()

    const [isAdding, setIsAdding] = useState(false)
    const nameRef = useRef<HTMLInputElement>(null)
    const clientRef = useRef<HTMLInputElement>(null)

    const sortedProjects = useMemo(
        () => [...projects].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()),
        [projects]
    )
    
    function handleAddProject() {
        setIsAdding(true)
    }

    function handleSubmit(e?: React.FormEvent) {
        e?.preventDefault()

        const name = nameRef.current?.value.trim()
        if (!name) return

        const client = clientRef.current?.value.trim() || undefined

        const newProject: Project = {
            id: crypto.randomUUID(),
            name,
            createdAt: new Date(),
            client,
            tags: []
        }

        setProjects(prev => [...prev, newProject])
        setIsAdding(false)

        if (nameRef.current) nameRef.current.value = ''
        if (clientRef.current) clientRef.current.value = ''
    }

    function handleSelectProject(project: Project) {
        if (selectedProject && project.id === selectedProject.id) {
            setSelectedProject(null)
            return
        }
        setSelectedProject(project)
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (e.key === 'Enter') {
            e.preventDefault()
            handleSubmit()
        }
        if (e.key === 'Escape') {
            setIsAdding(false)
        }
    }

    return (
        <>
            <div className="flex items-center gap-4 mb-4">
                <div className="text-xl font-accent">
                    projects
                </div>
                <Button onClick={ handleAddProject } 
                    variant="outline" 
                    className='font-accent'
                >
                    <Plus /> add
                </Button>
            </div>

            <div className="flex gap-4 overflow-x-auto">
                {/* { isAdding && (
                    <form
                        onSubmit={handleSubmit}
                    >
                        <Item variant="outline">
                            <ItemContent>
                                <ItemTitle>New Project</ItemTitle>
                                <ItemDescription className='grid gap-2'>
                                    <Input
                                        className='border'
                                        type="text"
                                        ref={nameRef}
                                        placeholder="Project name"
                                        autoFocus
                                        onKeyDown={handleKeyDown}
                                    />
                                    <Input
                                        className='border'
                                        type="text"
                                        ref={clientRef}
                                        placeholder="Client (optional)"
                                        onKeyDown={handleKeyDown}
                                    />
                                </ItemDescription>
                            </ItemContent>
                            <ItemActions className='grid gap-2'>
                                <Button onClick={()=> setIsAdding(false)}
                                    className='text-sm'
                                >
                                    <X color='red'/>
                                </Button>
                                <Button type="submit"
                                    className="text-sm"
                                >
                                    <Check color='green'/>
                                </Button>
                            </ItemActions>
                        </Item>
                    </form>
                )} */}
                
                { sortedProjects.map(project => (
                    // <Item variant="outline" key={project.id} 
                    //     onClick={() => handleSelectProject(project)}
                    // >
                    //     <ItemContent>
                    //         <ItemTitle>{ project.name }</ItemTitle>
                    //         <ItemDescription>{ project.client }</ItemDescription>
                    //     </ItemContent>
                    // </Item>
                    
                    <Button key={project.id} variant="outline" size=""
                        onClick={() => handleSelectProject(project)}
                        className={clsx([
                            "flex flex-col",
                            selectedProject?.id === project.id && "selected"
                        ])}
                    >
                        <div className="font-semibold">{project.name}</div>
                        {project.client && ( <div className="text-sm opacity-60">{project.client}</div> )}
                    </Button>
                ))}
            </div>
        </>
    )

}


