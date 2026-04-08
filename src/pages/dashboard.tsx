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
    <div className='flex min-h-screen flex-col bg-zinc-50 p-4 pb-8 sm:p-8 lg:h-screen lg:min-h-0 lg:overflow-hidden dark:bg-zinc-950'>
      <div className='mx-auto flex w-full max-w-6xl flex-1 flex-col space-y-5 sm:space-y-6 lg:overflow-hidden'>
        <div className='flex shrink-0 flex-col items-start justify-between gap-3 sm:flex-row sm:items-center'>
          <div>
            <h1 className='text-2xl font-bold tracking-tight sm:text-3xl'>WorkSpace</h1>
            <p className='text-muted-foreground text-sm sm:text-base'>Welcome back, {userInfo.name || 'User'}</p>
          </div>
          <div className='flex items-center gap-2'>
            <Button variant='outline' onClick={handleLogout} className='cursor-pointer gap-2'>
              <LogOut className='h-4 w-4' /> Log Out
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
          <div className='mb-4 flex shrink-0 items-center justify-between gap-3'>
            <TabsList className='grid w-[200px] grid-cols-2 sm:w-[240px]'>
              <TabsTrigger value='table' className='cursor-pointer'>
                Table
              </TabsTrigger>
              <TabsTrigger value='board' className='cursor-pointer'>
                Board
              </TabsTrigger>
            </TabsList>
            <Button
              onClick={() => {
                setEditingTask(undefined)
                setIsDialogOpen(true)
              }}
              className='cursor-pointer gap-2 shadow-sm'
            >
              <Plus className='h-4 w-4' />
              <span className='hidden sm:inline'>New Task</span>
              <span className='sm:hidden'>New</span>
            </Button>
          </div>

          <TabsContent value='table' className='m-0 min-h-[400px] flex-1 flex-col pb-4 focus-visible:ring-0 focus-visible:outline-none data-[state=active]:flex lg:min-h-0 lg:overflow-y-auto'>
            <TaskList onEdit={handleEditTask} onDelete={handleDeleteTask} />
          </TabsContent>

          <TabsContent value='board' className='m-0 min-h-[400px] flex-1 flex-col overflow-x-auto pb-4 focus-visible:ring-0 focus-visible:outline-none data-[state=active]:flex lg:min-h-0'>
            <TaskBoard onEdit={handleEditTask} onDelete={handleDeleteTask} />
          </TabsContent>
        </Tabs>
      </div>
      <TaskDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} onSubmit={handleCreateOrUpdateTask} initialValues={editingTask} title={editingTask ? 'Edit Task' : 'Create New Task'} />
    </div>
  )
}

export default Dashboard
