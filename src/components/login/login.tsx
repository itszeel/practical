import { useState } from 'react'
import { useFormik } from 'formik'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { loginSchema, type LoginFormValues, type SignupFormValues } from '@/schema/validations'
import { useNavigate } from 'react-router'
import { validateWithZod } from '@/lib/form-validation'
import { FormField } from '@/components/common/form-field'

const Login = () => {
  const [isLoading, setIsLoading] = useState(false)
  const navigate = useNavigate()

  const formik = useFormik<LoginFormValues>({
    initialValues: {
      email: '',
      password: '',
    },
    validate: values => validateWithZod(loginSchema, values),
    onSubmit: async (values: LoginFormValues) => {
      setIsLoading(true)
      setTimeout(() => {
        const usersList = JSON.parse(localStorage.getItem('users') || '[]')
        const user = usersList.find((u: SignupFormValues) => u.email === values.email && u.password === values.password)

        if (!user) {
          setIsLoading(false)
          toast.error('Invalid email or password')
          return
        }

        localStorage.setItem('userInfo', JSON.stringify(user))

        setIsLoading(false)
        toast.success('Successfully logged in!')
        navigate('/dashboard')
      }, 1000)
    },
  })

  return (
    <div className='bg-card text-card-foreground border-border/40 rounded-xl border p-8 shadow-xl backdrop-blur-md'>
      <form onSubmit={formik.handleSubmit}>
        <div className='mb-6'>
          <h2 className='text-2xl font-semibold tracking-tight'>Login</h2>
          <p className='text-muted-foreground mt-1.5 text-sm'>Welcome back! Please enter your details.</p>
        </div>

        <div className='space-y-4'>
          <FormField label='Email' name='email' type='email' placeholder='name@example.com' formik={formik} />

          <FormField label='Password' name='password' placeholder='••••••••' formik={formik} showPasswordToggle />
        </div>

        <div className='mt-8'>
          <Button className='w-full cursor-pointer font-medium shadow-md' type='submit' disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default Login
