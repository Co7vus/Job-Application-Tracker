import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

API.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

export const getJobs = () => API.get('/jobs/');
export const createJob = (data) => API.post('/jobs/', data);
export const updateJob = (id, data) => API.patch(`/jobs/${id}`, data);
export const deleteJob = (id) => API.delete(`/jobs/${id}`);
export const getStats = () => API.get('/jobs/stats');