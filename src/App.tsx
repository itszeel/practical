import { BrowserRouter, Routes, Route } from 'react-router'
import Login from '@/pages/login'
import Dashboard from '@/pages/dashboard'
import { Toaster } from '@/components/ui/sonner'

function App() {
  return (
    <BrowserRouter>
      <Toaster />
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/dashboard' element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
