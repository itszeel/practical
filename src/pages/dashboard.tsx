import { useState, useMemo } from 'react'
import { Button } from '@/components/ui/button'
import { useNavigate } from 'react-router'
import { toast } from 'sonner'
import { Plus, LogOut } from 'lucide-react'
import { TaskDialog } from '@/components/dashboard/task-dialog'
import { type TaskValues } from '@/schema/validations'
import { DashboardStats } from '@/components/dashboard/dashboard-stats'
import { TaskList } from '@/components/dashboard/task-list'
import { TaskBoard } from '@/components/dashboard/task-board'
import { TaskFilters } from '@/components/dashboard/task-filters'
import { useTasks } from '@/contexts/tasks-context'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'

const Dashboard = () => {
  const navigate = useNavigate()
  const { tasks, addTask, updateTask, deleteTask } = useTasks()

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingTask, setEditingTask] = useState<TaskValues | undefined>(undefined)

  const userInfo = JSON.parse(localStorage.getItem('userInfo') || '{}')

  const handleLogout = () => {
    localStorage.removeItem('userInfo')
    toast.success('Successfully logged out!')
    navigate('/', { replace: true })
  }

  const handleCreateOrUpdateTask = (values: TaskValues) => {
    if (values.id) updateTask(values)
    else addTask(values)
    setIsDialogOpen(false)
    setEditingTask(undefined)
  }

  const handleDeleteTask = (id: string) => deleteTask(id)

  const handleEditTask = (task: TaskValues) => {
    setEditingTask(task)
    setIsDialogOpen(true)
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
    <div className='flex h-screen flex-col overflow-hidden bg-zinc-50 p-4 sm:p-8 dark:bg-zinc-950'>
      <div className='mx-auto flex w-full max-w-6xl flex-1 flex-col space-y-6 overflow-hidden'>
        <div className='flex shrink-0 flex-col items-center justify-between gap-4 sm:flex-row'>
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

        <div className='shrink-0'>
          <DashboardStats stats={stats} />
        </div>

        <div className='shrink-0'>
          <TaskFilters />
        </div>

        <Tabs defaultValue='table' className='flex min-h-0 flex-1 flex-col'>
          <TabsList className='mb-4 grid w-[240px] shrink-0 grid-cols-2'>
            <TabsTrigger value='table' className='cursor-pointer'>
              Table
            </TabsTrigger>
            <TabsTrigger value='board' className='cursor-pointer'>
              Board
            </TabsTrigger>
          </TabsList>

          <TabsContent value='table' className='m-0 min-h-0 flex-1 flex-col overflow-y-auto pb-4 focus-visible:ring-0 focus-visible:outline-none data-[state=active]:flex'>
            <TaskList onEdit={handleEditTask} onDelete={handleDeleteTask} />
          </TabsContent>

          <TabsContent value='board' className='m-0 min-h-0 flex-1 flex-col pb-4 focus-visible:ring-0 focus-visible:outline-none data-[state=active]:flex'>
            <TaskBoard onEdit={handleEditTask} onDelete={handleDeleteTask} />
          </TabsContent>
        </Tabs>
      </div>
      <TaskDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSubmit={handleCreateOrUpdateTask} initialValues={editingTask} title={editingTask ? 'Edit Task' : 'Create New Task'} />
    </div>
  )
}

export default Dashboard
