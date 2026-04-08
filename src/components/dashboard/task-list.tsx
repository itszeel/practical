import { type TaskValues } from '@/schema/validations'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ClipboardList, Edit2, Trash2, Clock, AlertCircle, CheckCircle2 } from 'lucide-react'

interface TaskListProps {
  tasks: TaskValues[]
  onEdit: (task: TaskValues) => void
  onDelete: (id: string) => void
}

export function TaskList({ tasks, onEdit, onDelete }: TaskListProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Todo':
        return (
          <Badge variant='outline' className='flex w-fit items-center gap-1'>
            <Clock className='h-3 w-3' /> Todo
          </Badge>
        )
      case 'In Progress':
        return (
          <Badge variant='default' className='flex w-fit items-center gap-1 bg-blue-500 hover:bg-blue-600'>
            <AlertCircle className='h-3 w-3' /> In Progress
          </Badge>
        )
      case 'Done':
        return (
          <Badge variant='default' className='flex w-fit items-center gap-1 bg-green-500 hover:bg-green-600'>
            <CheckCircle2 className='h-3 w-3' /> Done
          </Badge>
        )
      default:
        return <Badge>{status}</Badge>
    }
  }

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'High':
        return <Badge variant='destructive'>High</Badge>
      case 'Medium':
        return (
          <Badge variant='default' className='border-transparent bg-amber-500 text-white hover:bg-amber-600'>
            Medium
          </Badge>
        )
      case 'Low':
        return <Badge variant='secondary'>Low</Badge>
      default:
        return <Badge>{priority}</Badge>
    }
  }

  return (
    <div className='overflow-hidden rounded-xl bg-white shadow-xl dark:bg-zinc-900'>
      <div className='px-6 pt-6 pb-4'>
        <h2 className='text-xl font-semibold tracking-tight'>Task Overview</h2>
        <p className='text-sm text-zinc-500 dark:text-zinc-400'>Manage and track your project tasks here.</p>
      </div>
      <div className='p-0 sm:p-6 sm:pt-0'>
        {tasks.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <div className='mb-4 rounded-full bg-zinc-100 p-4 dark:bg-zinc-800'>
              <ClipboardList className='h-8 w-8 text-zinc-400' />
            </div>
            <h3 className='text-lg font-medium'>No tasks found</h3>
            <p className='text-muted-foreground mb-6'>Start by creating your first task above.</p>
          </div>
        ) : (
          <div className='overflow-x-auto rounded-lg border border-zinc-100 dark:border-zinc-800'>
            <Table>
              <TableHeader className='bg-zinc-50/80 dark:bg-zinc-800/50'>
                <TableRow>
                  <TableHead className='font-semibold'>Title</TableHead>
                  <TableHead className='font-semibold'>Status</TableHead>
                  <TableHead className='font-semibold'>Priority</TableHead>
                  <TableHead className='font-semibold'>Due Date</TableHead>
                  <TableHead className='text-right font-semibold'>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tasks.map(task => (
                  <TableRow key={task.id} className='transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50'>
                    <TableCell>
                      <div className='flex flex-col gap-0.5'>
                        <span className='font-medium'>{task.title}</span>
                        <span className='text-muted-foreground line-clamp-1 text-xs'>{task.description}</span>
                      </div>
                    </TableCell>
                    <TableCell>{getStatusBadge(task.status)}</TableCell>
                    <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                    <TableCell className='text-sm font-medium'>
                      {new Date(task.dueDate).toLocaleDateString()}
                      {task.dueDate < new Date().toISOString().split('T')[0] && task.status !== 'Done' && <span className='text-destructive mt-1 block text-[10px] font-bold uppercase'>Overdue</span>}
                    </TableCell>
                    <TableCell className='text-right'>
                      <div className='flex justify-end gap-2'>
                        <Button variant='ghost' size='icon' onClick={() => onEdit(task)} className='h-8 w-8 hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30'>
                          <Edit2 className='h-4 w-4' />
                        </Button>
                        <Button variant='ghost' size='icon' onClick={() => task.id && onDelete(task.id)} className='hover:bg-destructive/10 hover:text-destructive h-8 w-8'>
                          <Trash2 className='h-4 w-4' />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  )
}
