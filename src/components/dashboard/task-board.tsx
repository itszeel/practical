import { useState, memo } from 'react'
import { type TaskValues } from '@/schema/validations'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Edit2, Trash2, Clock, AlertCircle, CheckCircle2 } from 'lucide-react'
import { useTasks } from '@/contexts/tasks-context'

interface TaskBoardProps {
  onEdit: (task: TaskValues) => void
  onDelete: (id: string) => void
}

const COLUMNS = ['Todo', 'In Progress', 'Done'] as const

const PriorityBadge = ({ priority }: { priority: string }) => {
  switch (priority) {
    case 'High':
      return (
        <Badge variant='destructive' className='text-[10px]'>
          High
        </Badge>
      )
    case 'Medium':
      return (
        <Badge variant='default' className='border-transparent bg-amber-500 text-[10px] text-white hover:bg-amber-600'>
          Medium
        </Badge>
      )
    case 'Low':
      return (
        <Badge variant='secondary' className='text-[10px]'>
          Low
        </Badge>
      )
    default:
      return <Badge className='text-[10px]'>{priority}</Badge>
  }
}

const TaskCard = memo(({ task, onEdit, onDelete }: { task: TaskValues; onEdit: (task: TaskValues) => void; onDelete: (id: string) => void }) => {
  const handleDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData('taskId', task.id!)
    const el = document.getElementById(`task-${task.id}`)
    if (el) el.style.opacity = '0.4'
  }

  const handleDragEnd = () => {
    const el = document.getElementById(`task-${task.id}`)
    if (el) el.style.opacity = '1'
  }

  const isOverdue = task.dueDate < new Date().toISOString().split('T')[0] && task.status !== 'Done'

  return (
    <div
      id={`task-${task.id}`}
      draggable
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className='group relative flex cursor-grab flex-col gap-3 rounded-lg border border-zinc-200 bg-zinc-50 p-4 shadow-sm transition-all hover:border-zinc-300 hover:shadow-md active:cursor-grabbing dark:border-zinc-800 dark:bg-zinc-950 dark:hover:border-zinc-700'
    >
      <div className='flex items-start justify-between gap-2 text-zinc-900 dark:text-zinc-100'>
        <h4 className='text-sm font-semibold tracking-tight'>{task.title}</h4>
        <div className='absolute top-2 right-2 flex opacity-0 transition-opacity group-hover:opacity-100'>
          <Button variant='ghost' size='icon' onClick={() => onEdit(task)} className='h-7 w-7 cursor-pointer text-zinc-500 hover:text-blue-600 dark:hover:bg-zinc-800'>
            <Edit2 className='h-3 w-3' />
          </Button>
          <Button variant='ghost' size='icon' onClick={() => task.id && onDelete(task.id)} className='hover:text-destructive h-7 w-7 cursor-pointer text-zinc-500 dark:hover:bg-zinc-800'>
            <Trash2 className='h-3 w-3' />
          </Button>
        </div>
      </div>

      <p className='line-clamp-2 text-xs text-zinc-500 dark:text-zinc-400'>{task.description}</p>

      <div className='mt-1 flex items-center justify-between'>
        <PriorityBadge priority={task.priority} />
        <span className='rounded border border-zinc-200 bg-white px-2 py-0.5 text-[11px] font-medium text-zinc-500 shadow-sm dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-400'>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
      </div>

      {isOverdue && <span className='text-destructive border-destructive/20 bg-destructive/10 absolute right-4 bottom-3.5 rounded border px-1.5 py-0.5 text-[10px] font-bold uppercase'>Overdue</span>}
    </div>
  )
})

const TaskColumn = ({
  column,
  tasks,
  onEdit,
  onDelete,
  draggedOverColumn,
  onDragOver,
  onDragLeave,
  onDrop,
}: {
  column: string
  tasks: TaskValues[]
  onEdit: (task: TaskValues) => void
  onDelete: (id: string) => void
  draggedOverColumn: string | null
  onDragOver: (column: string) => void
  onDragLeave: (e: React.DragEvent) => void
  onDrop: (e: React.DragEvent, column: string) => void
}) => {
  const getColumnIcon = (status: string) => {
    if (status === 'Todo') return <Clock className='h-4 w-4 text-zinc-500' />
    if (status === 'In Progress') return <AlertCircle className='h-4 w-4 text-blue-500' />
    return <CheckCircle2 className='h-4 w-4 text-green-500' />
  }

  return (
    <div
      className={`flex min-h-[250px] flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm transition-colors lg:h-full lg:min-h-0 dark:border-zinc-800 dark:bg-zinc-900 ${draggedOverColumn === column ? 'bg-zinc-100 dark:bg-zinc-800/80' : ''}`}
      onDragOver={e => {
        e.preventDefault()
        onDragOver(column)
      }}
      onDragLeave={onDragLeave}
      onDrop={e => {
        e.preventDefault()
        onDrop(e, column)
      }}
    >
      <div className='flex shrink-0 items-center justify-between border-b border-zinc-100 px-4 py-3 text-zinc-900 dark:border-zinc-800 dark:text-zinc-100'>
        <div className='flex items-center gap-2 font-medium'>
          {getColumnIcon(column)}
          <span>{column}</span>
        </div>
        <Badge variant='secondary' className='rounded-full px-2.5 py-0.5 text-xs font-semibold'>
          {tasks.length}
        </Badge>
      </div>

      <div className='flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto p-4'>
        {tasks.length === 0 ? <div className='flex h-[120px] shrink-0 items-center justify-center rounded-lg border border-dashed border-zinc-200 text-sm text-zinc-400 dark:border-zinc-800'>Drop tasks here</div> : tasks.map(task => <TaskCard key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />)}
      </div>
    </div>
  )
}

export function TaskBoard({ onEdit, onDelete }: TaskBoardProps) {
  const { filteredTasks, updateTask } = useTasks()
  const [draggedOverColumn, setDraggedOverColumn] = useState<string | null>(null)

  const handleDragLeave = (e: React.DragEvent) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const isActuallyLeaving = e.clientX <= rect.left || e.clientX >= rect.right || e.clientY <= rect.top || e.clientY >= rect.bottom
    if (isActuallyLeaving) setDraggedOverColumn(null)
  }

  const onDrop = (e: React.DragEvent, status: string) => {
    setDraggedOverColumn(null)
    const taskId = e.dataTransfer.getData('taskId')
    if (!taskId) return

    const task = filteredTasks.find(t => t.id === taskId)
    if (task && task.status !== status) updateTask({ ...task, status: status as 'Todo' | 'In Progress' | 'Done' })
  }

  return (
    <div className='grid min-h-0 grid-cols-1 gap-4 sm:gap-6 md:grid-cols-3 lg:h-full'>
      {COLUMNS.map(column => (
        <TaskColumn key={column} column={column} tasks={filteredTasks.filter(t => t.status === column)} onEdit={onEdit} onDelete={onDelete} draggedOverColumn={draggedOverColumn} onDragOver={setDraggedOverColumn} onDragLeave={handleDragLeave} onDrop={onDrop} />
      ))}
    </div>
  )
}
