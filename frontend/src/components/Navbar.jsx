import { useAuth } from '../context/AuthContext'
import { useNavigate, Link } from 'react-router-dom'

export default function Navbar() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  return (
    <nav className='flex justify-between items-center px-6 py-4 border-b bg-white'>
      <h1 className='font-bold text-lg text-blue-600'>JobTracker</h1>
      <div className='flex gap-6 text-sm'>
        <Link to='/' className='text-gray-600 hover:text-blue-600'>Board</Link>
        <Link to='/dashboard' className='text-gray-600 hover:text-blue-600'>Dashboard</Link>
        <button
          onClick={() => { logout(); navigate('/login') }}
          className='text-red-400 hover:text-red-600'
        >Logout</button>
      </div>
    </nav>
  )
}