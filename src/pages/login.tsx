import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import Login from '@/components/login/login'
import SignUp from '@/components/login/sign-up'

const LoginPage = () => {
  return (
    <div className='relative flex min-h-screen items-center justify-center overflow-hidden bg-zinc-50 p-4 dark:bg-zinc-950'>
      <div className='w-full max-w-md'>
        <div className='mb-8 flex flex-col items-center space-y-2'>
          <h1 className='text-3xl font-semibold tracking-tight'>Welcome</h1>
          <p className='text-muted-foreground max-w-[280px] text-center text-sm'>Please sign in to your account or create a new one to get started.</p>
        </div>

        <Tabs defaultValue='login' className='w-full'>
          <TabsList className='mb-6 grid w-full grid-cols-2'>
            <TabsTrigger value='login' className='cursor-pointer'>
              Login
            </TabsTrigger>
            <TabsTrigger value='signup' className='cursor-pointer'>
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value='signup' className='focus-visible:ring-0 focus-visible:outline-none'>
            <SignUp />
          </TabsContent>

          <TabsContent value='login' className='focus-visible:ring-0 focus-visible:outline-none'>
            <Login />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default LoginPage
