import { useQuery } from '@tanstack/react-query'
import { getStats } from '../api/jobs'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import Navbar from '../components/Navbar'

export default function Dashboard() {
  const { data: stats } = useQuery({
    queryKey: ['stats'],
    queryFn: () => getStats().then(r => r.data)
  })

  const chartData = Object.entries(stats?.by_status || {}).map(([name, value]) => ({ name, value }))
  const responseRate = Math.round(
    ((stats?.by_status?.Interview || 0) + (stats?.by_status?.Offer || 0)) /
    (stats?.total || 1) * 100
  )

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <div className='p-6'>
        <h2 className='text-xl font-bold mb-6'>Dashboard</h2>
        <div className='grid grid-cols-4 gap-4 mb-8'>
          {[
            { label: 'Total Applied', value: stats?.total || 0 },
            { label: 'Interviews', value: stats?.by_status?.Interview || 0 },
            { label: 'Offers', value: stats?.by_status?.Offer || 0 },
            { label: 'Response Rate', value: `${responseRate}%` },
          ].map(({ label, value }) => (
            <div key={label} className='bg-white border rounded-lg p-4'>
              <div className='text-2xl font-bold'>{value}</div>
              <div className='text-sm text-gray-500 mt-1'>{label}</div>
            </div>
          ))}
        </div>
        <div className='bg-white border rounded-lg p-6'>
          <h3 className='font-medium mb-4'>Applications by Status</h3>
          <ResponsiveContainer width='100%' height={250}>
            <BarChart data={chartData}>
              <XAxis dataKey='name' />
              <YAxis />
              <Tooltip />
              <Bar dataKey='value' fill='#3C3489' radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}