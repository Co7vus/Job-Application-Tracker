import { useState } from 'react'
import { createJob, updateJob } from '../api/jobs'

export default function JobModel({ job, onSave, onClose }) {
  const [form, setForm] = useState({
    company: job?.company || '',
    role: job?.role || '',
    status: job?.status || 'Applied',
    salary: job?.salary || '',
    applied_date: job?.applied_date || new Date().toISOString().split('T')[0],
    followup_date: job?.followup_date || '',
    notes: job?.notes || ''
  })

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (job) {
      await updateJob(job.id, form)
    } else {
      await createJob(form)
    }
    onSave()
  }

  return (
    <div className='fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-md'>
        <h2 className='font-bold text-lg mb-4'>{job ? 'Edit Job' : 'Add Job'}</h2>
        <form onSubmit={handleSubmit} className='flex flex-col gap-3'>
          <input name='company' placeholder='Company' value={form.company} onChange={handleChange} className='border rounded px-3 py-2 text-sm' required />
          <input name='role' placeholder='Role' value={form.role} onChange={handleChange} className='border rounded px-3 py-2 text-sm' required />
          <select name='status' value={form.status} onChange={handleChange} className='border rounded px-3 py-2 text-sm'>
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
            <option>Rejected</option>
          </select>
          <input name='salary' placeholder='Salary (optional)' value={form.salary} onChange={handleChange} className='border rounded px-3 py-2 text-sm' />
          <div>
            <label className='text-xs text-gray-500'>Applied Date</label>
            <input type='date' name='applied_date' value={form.applied_date} onChange={handleChange} className='border rounded px-3 py-2 text-sm w-full mt-1' required />
          </div>
          <div>
            <label className='text-xs text-gray-500'>Follow-up Date (optional)</label>
            <input type='date' name='followup_date' value={form.followup_date} onChange={handleChange} className='border rounded px-3 py-2 text-sm w-full mt-1' />
          </div>
          <textarea name='notes' placeholder='Notes (optional)' value={form.notes} onChange={handleChange} className='border rounded px-3 py-2 text-sm' rows={3} />
          <div className='flex gap-2 justify-end mt-2'>
            <button type='button' onClick={onClose} className='px-4 py-2 text-sm text-gray-500 hover:text-gray-700'>Cancel</button>
            <button type='submit' className='px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700'>{job ? 'Save' : 'Add Job'}</button>
          </div>
        </form>
      </div>
    </div>
  )
}