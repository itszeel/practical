import * as React from 'react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Eye, EyeOff } from 'lucide-react'
import { FormikProps } from 'formik'

interface FormFieldProps<T extends Record<string, unknown>> {
  label: string
  name: keyof T & string
  placeholder?: string
  type?: string
  formik: FormikProps<T>
  showPasswordToggle?: boolean
  className?: string
  rightElement?: React.ReactNode
  isTextArea?: boolean
}

export const FormField = <T extends Record<string, unknown>>({ label, name, placeholder, type = 'text', formik, showPasswordToggle = false, className, rightElement, isTextArea = false }: FormFieldProps<T>) => {
  const [showPassword, setShowPassword] = React.useState(false)
  const isError = Boolean(formik.touched[name] && formik.errors[name])

  const inputType = showPasswordToggle ? (showPassword ? 'text' : 'password') : type

  const commonProps = {
    id: name,
    name: name,
    placeholder: placeholder,
    className: `bg-background/50 ${showPasswordToggle ? 'pr-10' : ''} ${isError ? 'border-destructive focus-visible:ring-destructive' : ''} ${type === 'date' ? 'cursor-pointer' : ''}`,
    onChange: formik.handleChange,
    onBlur: formik.handleBlur,
    value: (formik.values[name] as string | number | readonly string[]) ?? '',
    onClick: (e: React.MouseEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      if (type === 'date' && 'showPicker' in e.currentTarget) (e.currentTarget as HTMLInputElement).showPicker()
    },
  }

  return (
    <div className={`space-y-2 ${className}`}>
      <div className='flex items-center justify-between'>
        <Label htmlFor={name} className={isError ? 'text-destructive' : ''}>
          {label}
        </Label>
        {rightElement}
      </div>

      <div className='relative'>
        {isTextArea ? <Textarea {...commonProps} /> : <Input {...commonProps} type={inputType} />}

        {showPasswordToggle && (
          <button type='button' onClick={() => setShowPassword(!showPassword)} className='text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer transition-colors'>
            {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
          </button>
        )}
      </div>

      {isError && <p className='text-destructive text-[0.8rem] font-medium'>{formik.errors[name] as string}</p>}
    </div>
  )
}
