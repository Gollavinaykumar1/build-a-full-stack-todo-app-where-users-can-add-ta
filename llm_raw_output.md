# LLM Output

=== FILE: src/App.jsx ===
import React, { useState, useEffect } from 'react'
import { BrowserRouter as HashRouter, Routes, Route, Link } from 'react-router-dom'
import axios from 'axios'
import { ToastContainer } from 'react-toastify'
import { toast } from 'react-toastify'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTrash } from '@fortawesome/free-solid-svg-icons'
import { format } from 'date-fns'
import { useForm } from 'react-hook-form'
import { clsx } from 'clsx'

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:8000"

function App() {
  const [tasks, setTasks] = useState([])
  const [user, setUser] = useState(null)
  const { register, handleSubmit, reset } = useForm()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/login`, data)
      setUser(response.data)
      localStorage.setItem('user', JSON.stringify(response.data))
    } catch (error) {
      toast.error('Invalid credentials')
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
  }

  const addTask = async (data) => {
    try {
      const response = await axios.post(`${BASE_URL}/tasks`, data, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })
      setTasks([...tasks, response.data])
      reset()
    } catch (error) {
      toast.error('Failed to add task')
    }
  }

  const completeTask = async (taskId) => {
    try {
      await axios.patch(`${BASE_URL}/tasks/${taskId}`, { completed: true }, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })
      setTasks(tasks.map((task) => task.id === taskId ? { ...task, completed: true } : task))
    } catch (error) {
      toast.error('Failed to complete task')
    }
  }

  const deleteTask = async (taskId) => {
    try {
      await axios.delete(`${BASE_URL}/tasks/${taskId}`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })
      setTasks(tasks.filter((task) => task.id !== taskId))
    } catch (error) {
      toast.error('Failed to delete task')
    }
  }

  const getTasks = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tasks`, {
        headers: {
          Authorization: `Bearer ${user.token}`
        }
      })
      setTasks(response.data)
    } catch (error) {
      toast.error('Failed to load tasks')
    }
  }

  useEffect(() => {
    if (user) {
      getTasks()
    }
  }, [user])

  return (
    <HashRouter>
      <div className="container mx-auto p-4 pt-6 md:p-6 lg:p-12 xl:p-24">
        <ToastContainer />
        {user ? (
          <div>
            <h1 className="text-3xl font-bold mb-4">Todo App</h1>
            <button className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded" onClick={logout}>
              Logout
            </button>
            <form onSubmit={handleSubmit(addTask)} className="mt-4">
              <input type="text" {...register('title')} placeholder="Task title" className="block w-full p-2 pl-10 text-sm text-gray-700 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              <select {...register('priority')} className="block w-full p-2 pl-10 text-sm text-gray-700 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              <input type="date" {...register('dueDate')} className="block w-full p-2 pl-10 text-sm text-gray-700 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Add Task
              </button>
            </form>
            <ul className="mt-4">
              {tasks.map((task) => (
                <li key={task.id} className={clsx('flex justify-between items-center py-2 px-4 border border-gray-200 rounded-lg', task.completed && 'bg-green-100')}>
                  <span className={clsx('text-sm', task.completed && 'text-gray-500 line-through')}>{task.title}</span>
                  <span className="text-sm">{format(new Date(task.dueDate), 'yyyy-MM-dd')}</span>
                  <span className="text-sm">{task.priority}</span>
                  <button type="button" onClick={() => completeTask(task.id)} className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                    Complete
                  </button>
                  <button type="button" onClick={() => deleteTask(task.id)} className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div>
            <h1 className="text-3xl font-bold mb-4">Login</h1>
            <form onSubmit={handleSubmit(login)} className="mt-4">
              <input type="text" {...register('username')} placeholder="Username" className="block w-full p-2 pl-10 text-sm text-gray-700 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              <input type="password" {...register('password')} placeholder="Password" className="block w-full p-2 pl-10 text-sm text-gray-700 border border-gray-200 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
              <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                Login
              </button>
            </form>
          </div>
        )}
      </div>
    </HashRouter>
  )
}

export default App
=== END ===

=== FILE: src/main.jsx ===
import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
=== END ===

=== FILE: src/index.css ===
@tailwind base;
@tailwind components;
@tailwind utilities;
=== END ===

=== FILE: src/api.js ===
// No implementation needed, API calls are made directly in App.jsx
export {}
=== END ===