import { createContext, useContext, useState, ReactNode, type Dispatch, type SetStateAction, useEffect, useMemo } from 'react'
import { type TaskValues } from '@/schema/validations'
import { toast } from 'sonner'

interface TasksContextType {
  tasks: TaskValues[]
  filteredTasks: TaskValues[]
  addTask: (task: TaskValues) => void
  updateTask: (task: TaskValues) => void
  deleteTask: (id: string) => void

  searchQuery: string
  setSearchQuery: (val: string) => void
  statusFilter: string
  setStatusFilter: (val: string) => void
  priorityFilter: string
  setPriorityFilter: (val: string) => void
  dateRange: { start: string; end: string }
  setDateRange: Dispatch<SetStateAction<{ start: string; end: string }>>

  currentPage: number
  setCurrentPage: Dispatch<SetStateAction<number>>
  pageSize: number
  setPageSize: (val: number) => void
}

const TasksContext = createContext<TasksContextType | undefined>(undefined)

export function TasksProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<TaskValues[]>(() => {
    const savedTasks: TaskValues[] = JSON.parse(localStorage.getItem('tasks') || '[]')

    if (savedTasks.length === 0) return []

    const today = new Date().toISOString().split('T')[0]
    let hasChanges = false

    const updatedTasks = savedTasks.map(task => {
      if (task.dueDate < today && task.status !== 'Done') {
        hasChanges = true
        return { ...task, status: 'Done' as const }
      }
      return task
    })

    if (hasChanges) {
      localStorage.setItem('tasks', JSON.stringify(updatedTasks))
      setTimeout(() => {
        toast.info('Some overdue tasks were automatically marked as Done.')
      }, 0)
    }

    return updatedTasks
  })

  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('All')
  const [priorityFilter, setPriorityFilter] = useState<string>('All')
  const [dateRange, setDateRange] = useState<{ start: string; end: string }>({ start: '', end: '' })

  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(5)

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesStatus = statusFilter === 'All' || task.status === statusFilter
      const matchesPriority = priorityFilter === 'All' || task.priority === priorityFilter
      const query = searchQuery.toLowerCase()
      const matchesSearch = task.title.toLowerCase().includes(query) || task.description.toLowerCase().includes(query)
      let matchesDate = true
      if (dateRange.start) matchesDate = matchesDate && task.dueDate >= dateRange.start
      if (dateRange.end) matchesDate = matchesDate && task.dueDate <= dateRange.end

      return matchesStatus && matchesPriority && matchesSearch && matchesDate
    })
  }, [tasks, searchQuery, statusFilter, priorityFilter, dateRange])

  // Reset to page 1 if filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, statusFilter, priorityFilter, dateRange, pageSize])

  const syncStorage = (newTasks: TaskValues[]) => {
    setTasks(newTasks)
    localStorage.setItem('tasks', JSON.stringify(newTasks))
  }

  const addTask = (task: TaskValues) => {
    const newTask = { ...task, id: crypto.randomUUID() }
    syncStorage([newTask, ...tasks])
    toast.success('Task created successfully')
  }

  const updateTask = (task: TaskValues) => {
    syncStorage(tasks.map(t => (t.id === task.id ? task : t)))
    toast.success('Task updated successfully')
  }

  const deleteTask = (id: string) => {
    syncStorage(tasks.filter(t => t.id !== id))
    toast.success('Task deleted successfully')
  }

  return (
    <TasksContext.Provider
      value={{
        tasks,
        filteredTasks,
        addTask,
        updateTask,
        deleteTask,
        searchQuery,
        setSearchQuery,
        statusFilter,
        setStatusFilter,
        priorityFilter,
        setPriorityFilter,
        dateRange,
        setDateRange,
        currentPage,
        setCurrentPage,
        pageSize,
        setPageSize,
      }}
    >
      {children}
    </TasksContext.Provider>
  )
}

export function useTasks() {
  const context = useContext(TasksContext)
  if (context === undefined) throw new Error('useTasks must be used within a TasksProvider')
  return context
}
