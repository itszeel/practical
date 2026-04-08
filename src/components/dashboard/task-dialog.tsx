import { useEffect } from 'react'
import { useFormik } from 'formik'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { FormField } from '@/components/common/form-field'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { taskSchema, type TaskValues } from '@/schema/validations'
import { validateWithZod } from '@/lib/form-validation'

interface TaskDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSubmit: (values: TaskValues) => void
  initialValues?: TaskValues
  title: string
}

export const TaskDialog = ({ open, onOpenChange, onSubmit, initialValues, title }: TaskDialogProps) => {
  const formik = useFormik<TaskValues>({
    initialValues: initialValues || {
      title: '',
      description: '',
      status: 'Todo',
      priority: 'Medium',
      dueDate: '',
    },
    validate: values => validateWithZod(taskSchema, values),
    onSubmit: values => {
      onSubmit(values)
      onOpenChange(false)
      formik.resetForm()
    },
    enableReinitialize: true,
  })

  useEffect(() => {
    // Close and reset form when dialog closes
    if (!open) formik.resetForm()
  }, [open])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='p-6 sm:max-w-[500px]'>
        <DialogHeader className='mb-2'>
          <DialogTitle className='text-xl'>{title}</DialogTitle>
          <p className='text-sm text-zinc-500 dark:text-zinc-400'>{initialValues?.id ? 'Make changes to your task details here.' : 'Fill in the details below to create a new task.'}</p>
        </DialogHeader>
        <form onSubmit={formik.handleSubmit} className='space-y-5'>
          <FormField label='Title' name='title' placeholder='e.g. Redesign Dashboard UI' formik={formik} />
          <FormField label='Description' name='description' placeholder='Describe what this task is about...' formik={formik} isTextArea />

          <div className='grid grid-cols-1 gap-5 sm:grid-cols-2'>
            <div className='space-y-2.5'>
              <Label className='text-zinc-700 dark:text-zinc-300'>Status</Label>
              <Select value={formik.values.status} onValueChange={value => formik.setFieldValue('status', value)}>
                <SelectTrigger className='w-full bg-zinc-50/50 shadow-sm dark:bg-zinc-900/50'>
                  <SelectValue placeholder='Select status' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Todo'>Todo</SelectItem>
                  <SelectItem value='In Progress'>In Progress</SelectItem>
                  <SelectItem value='Done'>Done</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className='space-y-2.5'>
              <Label className='text-zinc-700 dark:text-zinc-300'>Priority</Label>
              <Select value={formik.values.priority} onValueChange={value => formik.setFieldValue('priority', value)}>
                <SelectTrigger className='w-full bg-zinc-50/50 shadow-sm dark:bg-zinc-900/50'>
                  <SelectValue placeholder='Select priority' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='Low'>Low</SelectItem>
                  <SelectItem value='Medium'>Medium</SelectItem>
                  <SelectItem value='High'>High</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <FormField label='Due Date' name='dueDate' type='date' formik={formik} />

          <DialogFooter className='-mx-6 mt-6 -mb-6 items-center px-6 py-4 sm:justify-between'>
            <Button type='button' variant='outline' onClick={() => onOpenChange(false)} className='mb-2 w-full sm:mb-0 sm:w-auto'>
              Cancel
            </Button>
            <Button type='submit' className='w-full min-w-[120px] shadow-sm sm:w-auto'>
              {initialValues?.id ? 'Save Changes' : 'Create Task'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
