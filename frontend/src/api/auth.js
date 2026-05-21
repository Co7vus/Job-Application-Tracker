import { data } from 'autoprefixer';
import axios from 'axios';

const API = axios.create({baseURL: import.meta.env.VITE_API_URL})

export const register = (data) => API.post('auth/register', data)
export const login = (data) => API.post('auth/login', 
    new URLSearchParams({ username: data.email, password: data.password}),
    { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
)

