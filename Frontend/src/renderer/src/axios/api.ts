import axios from 'axios'

export const authApi = axios.create({
  baseURL: 'http://localhost:5000/api/auth',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})

export const chatApi = axios.create({
  baseURL: 'http://localhost:5000/api/chat',
  headers: {
    'Content-Type': 'application/json'
  },
  withCredentials: true
})
