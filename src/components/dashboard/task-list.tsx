import { useMemo } from 'react'
import { type TaskValues } from '@/schema/validations'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { ClipboardList, Edit2, Trash2, Clock, AlertCircle, CheckCircle2, ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react'
import { useTasks } from '@/contexts/tasks-context'
import { TaskPagination } from '@/components/dashboard/task-pagination'

interface TaskListProps {
  onEdit: (task: TaskValues) => void
  onDelete: (id: string) => void
}

export function TaskList({ onEdit, onDelete }: TaskListProps) {
  const { tasks, filteredTasks, currentPage, pageSize, sortBy, setSortBy, sortOrder, setSortOrder } = useTasks()

  const handleSort = (field: 'dueDate' | 'title' | 'status' | 'priority' | 'description') => {
    if (sortBy === field) setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    else {
      setSortBy(field)
      setSortOrder('asc')
    }
  }

  const renderSortIcon = (field: string) => {
    if (sortBy !== field) return <ArrowUpDown className='h-3 w-3 opacity-0 transition-opacity group-hover:opacity-40' />
    return sortOrder === 'asc' ? <ArrowUp className='h-3 w-3 text-blue-600 dark:text-blue-400' /> : <ArrowDown className='h-3 w-3 text-blue-600 dark:text-blue-400' />
  }

  const paginatedTasks = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    return filteredTasks.slice(startIndex, startIndex + pageSize)
  }, [filteredTasks, currentPage, pageSize])

  const totalPages = Math.ceil(filteredTasks.length / pageSize)

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
    <div className='flex h-full flex-col overflow-hidden rounded-xl bg-white shadow-xl dark:bg-zinc-900'>
      <div className='flex shrink-0 flex-col gap-5 px-6 pt-6 pb-4'>
        <div className='flex items-center justify-between'>
          <h2 className='text-xl font-semibold tracking-tight'>Task Overview</h2>
        </div>
      </div>

      <div className='flex min-h-0 flex-1 flex-col p-0 sm:p-6 sm:pt-0'>
        {filteredTasks.length === 0 ? (
          <div className='flex flex-col items-center justify-center py-12 text-center'>
            <div className='mb-4 rounded-full bg-zinc-100 p-4 dark:bg-zinc-800'>
              <ClipboardList className='h-8 w-8 text-zinc-400' />
            </div>
            <h3 className='text-lg font-medium'>{tasks.length === 0 ? 'No tasks found' : 'No matching tasks'}</h3>
            <p className='text-muted-foreground mb-6'>{tasks.length === 0 ? 'Start by creating your first task above.' : 'Try adjusting your search or filters.'}</p>
          </div>
        ) : (
          <div className='flex min-h-0 flex-1 flex-col gap-4'>
            <div className='min-h-0 flex-1 overflow-auto rounded-lg border border-zinc-100 dark:border-zinc-800'>
              <Table>
                <TableHeader className='sticky top-0 z-10 bg-zinc-50/95 backdrop-blur dark:bg-zinc-800/95'>
                  <TableRow>
                    <TableHead className='group cursor-pointer font-semibold select-none' onClick={() => handleSort('title')}>
                      <div className='flex items-center gap-1.5'>Title {renderSortIcon('title')}</div>
                    </TableHead>
                    <TableHead className='group cursor-pointer font-semibold select-none' onClick={() => handleSort('description')}>
                      <div className='flex items-center gap-1.5'>Description {renderSortIcon('description')}</div>
                    </TableHead>
                    <TableHead className='group cursor-pointer font-semibold select-none' onClick={() => handleSort('status')}>
                      <div className='flex items-center gap-1.5'>Status {renderSortIcon('status')}</div>
                    </TableHead>
                    <TableHead className='group cursor-pointer font-semibold select-none' onClick={() => handleSort('priority')}>
                      <div className='flex items-center gap-1.5'>Priority {renderSortIcon('priority')}</div>
                    </TableHead>
                    <TableHead className='group cursor-pointer font-semibold select-none' onClick={() => handleSort('dueDate')}>
                      <div className='flex items-center gap-1.5'>Due Date {renderSortIcon('dueDate')}</div>
                    </TableHead>
                    <TableHead className='text-right font-semibold select-none'>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedTasks.map(task => (
                    <TableRow key={task.id} className='transition-colors hover:bg-zinc-50/50 dark:hover:bg-zinc-800/50'>
                      <TableCell>
                        <span className='font-medium'>{task.title}</span>
                      </TableCell>
                      <TableCell>
                        <span className='text-muted-foreground line-clamp-1 text-xs'>{task.description}</span>
                      </TableCell>
                      <TableCell>{getStatusBadge(task.status)}</TableCell>
                      <TableCell>{getPriorityBadge(task.priority)}</TableCell>
                      <TableCell className='text-sm font-medium'>
                        {new Date(task.dueDate).toLocaleDateString()}
                        {task.dueDate < new Date().toISOString().split('T')[0] && task.status !== 'Done' && <span className='text-destructive mt-1 block text-[10px] font-bold uppercase'>Overdue</span>}
                      </TableCell>
                      <TableCell className='text-right'>
                        <div className='flex justify-end gap-2'>
                          <Button variant='ghost' size='icon' onClick={() => onEdit(task)} className='h-8 w-8 cursor-pointer hover:bg-blue-50 hover:text-blue-600 dark:hover:bg-blue-900/30'>
                            <Edit2 className='h-4 w-4' />
                          </Button>
                          <Button variant='ghost' size='icon' onClick={() => task.id && onDelete(task.id)} className='hover:text-destructive h-8 w-8 cursor-pointer'>
                            <Trash2 className='h-4 w-4' />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className='shrink-0 pt-2'>
              <TaskPagination totalPages={totalPages} filteredCount={filteredTasks.length} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
