import { useState } from 'react'
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { getJobs, updateJob, deleteJob } from '../api/jobs'
import JobCard from '../components/JobCard'
import JobModel from '../components/JobModel'
import Navbar from '../components/Navbar'

const STATUSES = ['Applied', 'Interview', 'Offer', 'Rejected']

export default function Board() {
  const queryClient = useQueryClient()
  const [editJob, setEditJob] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const { data: jobs = [] } = useQuery({
    queryKey: ['jobs'],
    queryFn: () => getJobs().then(r => r.data)
  })

  const onDragEnd = async (result) => {
    if (!result.destination) return
    const newStatus = result.destination.droppableId
    await updateJob(result.draggableId, { status: newStatus })
    queryClient.invalidateQueries(['jobs'])
  }

  const handleDelete = async (id) => {
    await deleteJob(id)
    queryClient.invalidateQueries(['jobs'])
  }

  const handleEdit = (job) => {
    setEditJob(job)
    setShowModal(true)
  }

  const handleSave = () => {
    setShowModal(false)
    setEditJob(null)
    queryClient.invalidateQueries(['jobs'])
  }

  const exportCSV = () => {
    const headers = ['Company','Role','Status','Salary','Applied Date','Follow Up','Notes']
    const rows = jobs.map(j => [j.company, j.role, j.status, j.salary||'', j.applied_date, j.followup_date||'', j.notes||''])
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'my-jobs.csv'; a.click()
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <Navbar />
      <div className='p-6'>
        <div className='flex justify-between items-center mb-6'>
          <h2 className='text-xl font-bold'>My Applications</h2>
          <div className='flex gap-2'>
            <button onClick={exportCSV} className='border px-4 py-2 rounded-lg text-sm hover:bg-gray-50'>Export CSV</button>
            <button onClick={() => { setEditJob(null); setShowModal(true) }} className='bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700'>+ Add Job</button>
          </div>
        </div>
        <DragDropContext onDragEnd={onDragEnd}>
          <div className='grid grid-cols-4 gap-4'>
            {STATUSES.map(status => (
              <Droppable droppableId={status} key={status}>
                {(provided) => (
                  <div ref={provided.innerRef} {...provided.droppableProps} className='bg-white border rounded-lg p-3 min-h-64'>
                    <h3 className='font-medium text-sm mb-3 text-gray-700'>
                      {status} <span className='text-xs text-gray-400'>({jobs.filter(j => j.status === status).length})</span>
                    </h3>
                    {jobs.filter(j => j.status === status).map((job, index) => (
                      <Draggable key={job.id} draggableId={String(job.id)} index={index}>
                        {(provided) => (
                          <div ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
                            <JobCard job={job} onEdit={handleEdit} onDelete={handleDelete} />
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            ))}
          </div>
        </DragDropContext>
      </div>
      {showModal && (
        <JobModel job={editJob} onSave={handleSave} onClose={() => { setShowModal(false); setEditJob(null) }} />
      )}
    </div>
  )
}