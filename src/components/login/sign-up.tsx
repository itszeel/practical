import { useState } from 'react'
import { useFormik } from 'formik'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { signupSchema, type SignupFormValues } from '@/schema/validations'
import { validateWithZod } from '@/lib/form-validation'
import { FormField } from '@/components/common/form-field'

const SignUp = () => {
  const [isLoading, setIsLoading] = useState(false)

  const formik = useFormik<SignupFormValues>({
    initialValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    validate: values => validateWithZod(signupSchema, values),
    onSubmit: async (values: SignupFormValues) => {
      setIsLoading(true)
      setTimeout(() => {
        const usersList = JSON.parse(localStorage.getItem('users') || '[]')
        const isUserAlreadyPresent = usersList.find((user: SignupFormValues) => user.email === values.email)

        if (isUserAlreadyPresent) {
          toast.error('User with this email is already present')
          setIsLoading(false)
          return
        }

        delete values.confirmPassword
        usersList.push(values)

        localStorage.setItem('users', JSON.stringify(usersList))
        setIsLoading(false)
        toast.success('Success! Your account has been created. Please log in.')
        formik.resetForm()
      }, 1000)
    },
  })

  return (
    <div className='bg-card text-card-foreground border-border/40 rounded-xl border p-8 shadow-xl backdrop-blur-md'>
      <form onSubmit={formik.handleSubmit}>
        <div className='mb-6'>
          <h2 className='text-2xl font-semibold tracking-tight'>Create an account</h2>
          <p className='text-muted-foreground mt-1.5 text-sm'>Enter your information to get started.</p>
        </div>

        <div className='space-y-4'>
          <FormField label='Full Name' name='name' placeholder='John Doe' formik={formik} />
          <FormField label='Email' name='email' type='email' placeholder='name@example.com' formik={formik} />
          <FormField label='Password' name='password' placeholder='••••••••' formik={formik} showPasswordToggle />
          <FormField label='Confirm Password' name='confirmPassword' placeholder='••••••••' formik={formik} showPasswordToggle />
        </div>

        <div className='mt-8'>
          <Button className='w-full cursor-pointer font-medium shadow-md' type='submit' disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Creating account...
              </>
            ) : (
              'Create Account'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}

export default SignUp
