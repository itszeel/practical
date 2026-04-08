import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Plus, LogOut } from 'lucide-react'
import { TaskDialog } from '@/components/dashboard/task-dialog'
import { type TaskValues } from '@/schema/validations'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { TaskList } from '@/components/dashboard/task-list'

const Dashboard = () => {
  const navigate = useNavigate()
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

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<TaskValues | undefined>(undefined)

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('userInfo')
    toast.success('Successfully logged out!')
    navigate('/', { replace: true })
  }

  const handleCreateOrUpdateTask = (values: TaskValues) => {
    let updatedTasks: TaskValues[]

    if (values.id) {
      // Update
      updatedTasks = tasks.map(t => (t.id === values.id ? values : t))
      toast.success('Task updated successfully')
    } else {
      // Create
      const newTask = { ...values, id: crypto.randomUUID() }
      updatedTasks = [...tasks, newTask]
      toast.success('Task created successfully')
    }

    setTasks(updatedTasks)
    localStorage.setItem('tasks', JSON.stringify(updatedTasks))
    setIsDialogOpen(false)
    setEditingTask(undefined)
  }

  const handleDeleteTask = (id: string) => {
    const updatedTasks = tasks.filter(t => t.id !== id)
    setTasks(updatedTasks)
    localStorage.setItem('tasks', JSON.stringify(updatedTasks))
    toast.success('Task deleted successfully')
  }

  const stats = useMemo(() => {
    return {
      total: tasks.length,
      todo: tasks.filter(t => t.status === 'Todo').length,
      inProgress: tasks.filter(t => t.status === 'In Progress').length,
      done: tasks.filter(t => t.status === 'Done').length,
    }
  }, [tasks])

  return (
    <div className='min-h-screen bg-zinc-50 p-4 sm:p-8 dark:bg-zinc-950'>
      <div className='mx-auto max-w-6xl space-y-8'>
        <div className='flex flex-col items-center justify-between gap-4 sm:flex-row'>
          <div>
            <h1 className='text-3xl font-bold tracking-tight'>WorkSpace</h1>
            <p className='text-muted-foreground'>Welcome back, {userInfo.name || 'User'}</p>
          </div>
          <div className='flex items-center gap-2'>
            <Button variant='outline' onClick={handleLogout} className='cursor-pointer gap-2'>
              <LogOut className='h-4 w-4' /> Log Out
            </Button>
            <Button
              onClick={() => {
                setEditingTask(undefined)
                setIsDialogOpen(true)
              }}
              className='cursor-pointer gap-2 shadow-sm'
            >
              <Plus className='h-4 w-4' /> New Task
            </Button>
          </div>
        </div>

        <DashboardStats stats={stats} />

        <TaskList
          tasks={tasks}
          onEdit={task => {
            setEditingTask(task)
            setIsDialogOpen(true)
          }}
          onDelete={handleDeleteTask}
        />
      </div>

      <TaskDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSubmit={handleCreateOrUpdateTask} initialValues={editingTask} title={editingTask ? 'Edit Task' : 'Create New Task'} />
    </div>
  )
}

export default Dashboard
