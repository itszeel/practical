import { z } from 'zod'

export const signupSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50, 'Name must be less than 50 characters').trim().nonempty('Full name is required'),
    email: z.string().email('Invalid email address').toLowerCase().trim().nonempty('Email is required'),
    password: z.string().min(8, 'Password must be at least 8 characters').regex(/[a-z]/, 'Password must contain at least one lowercase letter').regex(/[A-Z]/, 'Password must contain at least one uppercase letter').regex(/[0-9]/, 'Password must contain at least one number').nonempty('Password is required'),
    confirmPassword: z.string().nonempty('Please confirm your password'),
  })
  .refine(data => data.password === data.confirmPassword, {
    message: 'Passwords must match',
    path: ['confirmPassword'],
  })

export const loginSchema = z.object({
  email: z.string().email('Invalid email address').toLowerCase().trim().nonempty('Email is required'),
  password: z.string().nonempty('Password is required'),
})

export const taskSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  description: z.string().min(1, 'Description is required'),
  status: z.enum(['Todo', 'In Progress', 'Done']).default('Todo'),
  priority: z.enum(['Low', 'Medium', 'High']).default('Medium'),
  dueDate: z.string().nonempty('Due date is required'),
})

// Infer TypeScript types from the schemas
export type SignupFormValues = z.infer<typeof signupSchema>
export type LoginFormValues = z.infer<typeof loginSchema>
export type TaskValues = z.infer<typeof taskSchema>
