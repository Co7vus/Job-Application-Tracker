export default function JobCard({ job, onEdit, onDelete }) {
  const isOverdue = job.followup_date && new Date(job.followup_date) < new Date()

  return (
    <div className='bg-white border rounded-lg p-3 mb-2 shadow-sm'>
      <div className='font-medium text-sm'>{job.company}</div>
      <div className='text-xs text-gray-500 mt-1'>{job.role}</div>
      {job.salary && (
        <div className='text-xs text-green-600 mt-1'>{job.salary}</div>
      )}
      {job.followup_date && (
        <div className={`text-xs mt-1 ${isOverdue ? 'text-red-500 font-medium' : 'text-blue-500'}`}>
          Follow up: {job.followup_date}
        </div>
      )}
      <div className='flex gap-3 mt-2'>
        <button onClick={() => onEdit(job)} className='text-xs text-blue-500 hover:underline'>Edit</button>
        <button onClick={() => onDelete(job.id)} className='text-xs text-red-400 hover:underline'>Delete</button>
      </div>
    </div>
  )
}