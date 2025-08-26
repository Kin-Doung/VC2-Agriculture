"use client"

import { Calendar, Clock, X } from "lucide-react"
import { useState, useEffect } from "react"
import axios from "axios"

const TasksView = ({ language }) => {
  const [filter, setFilter] = useState("all")
  const [tasks, setTasks] = useState([])
  const [loading, setLoading] = useState(true)
  const [availableCrops, setAvailableCrops] = useState([])
  const [deleteTaskId, setDeleteTaskId] = useState(null)

  // API URLs
  const TASKS_API_URL = "http://localhost:8000/api/tasks"
  const CROPS_API_URL = "http://127.0.0.1:8000/api/crops"
  const AUTH_TOKEN = localStorage.getItem("token")

  // Translations
  const translations = {
    en: {
      title: "Tasks & Reminders",
      subtitle: "Manage your farming activities and never miss important tasks",
      all: "All Tasks",
      today: "Today",
      overdue: "Overdue",
      upcoming: "Upcoming",
      completed: "Completed",
      noTasks: "No tasks found",
      priority: "Priority",
      high: "High",
      medium: "Medium",
      low: "Low",
      crop: "Crop",
      delete: "Delete",
      confirmDelete: "Are you sure you want to delete this task?",
      cancel: "Cancel",
      loading: "Loading...", // Added
    },
    km: {
      title: "កិច្ចការ និងការរំលឹក",
      subtitle: "គ្រប់គ្រងសកម្មភាពកសិកម្មរបស់អ្នក និងកុំឱ្យខកខានកិច្ចការសំខាន់ៗ",
      all: "កិច្ចការទាំងអស់",
      today: "ថ្ងៃនេះ",
      overdue: "ហួសកាលកំណត់",
      upcoming: "នាពេលខាងមុខ",
      completed: "បានបញ្ចប់",
      noTasks: "រកមិនឃើញកិច្ចការ",
      priority: "អាទិភាព",
      high: "ខ្ពស់",
      medium: "មធ្យម",
      low: "ទាប",
      crop: "ដំណាំ",
      delete: "លុប",
      confirmDelete: "តើអ្នកប្រាកដថាចង់លុបកិច្ចការនេះទេ?",
      cancel: "បោះបង់",
      loading: "កំពុងផ្ទុក...", // Added
    },
  }

  const t = translations[language] || translations.en

  // Fetch available crops
  useEffect(() => {
    const fetchCrops = async () => {
      try {
        const response = await axios.get(CROPS_API_URL, {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            Accept: "application/json",
          },
        })
        setAvailableCrops(response.data)
      } catch (error) {
        console.error("Error fetching crops:", error)
      }
    }
    if (AUTH_TOKEN) fetchCrops()
  }, [])

  // Fetch tasks from the database
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true)
        const response = await axios.get(TASKS_API_URL, {
          headers: {
            Authorization: `Bearer ${AUTH_TOKEN}`,
            Accept: "application/json",
          },
        })
        const mappedTasks = response.data.map((task) => ({
          id: task.id,
          title: task.task_type,
          description: task.description || "",
          dueDate: task.due_date,
          priority: task.priority || "medium",
          status: getTaskStatus(task.due_date, task.is_completed),
          category: task.task_type,
          crop_id: task.crop_id || null,
          crop_name: task.crop ? task.crop.name : "No Crop",
        }))
        setTasks(mappedTasks)
      } catch (error) {
        console.error("Error fetching tasks:", error)
      } finally {
        setLoading(false)
      }
    }
    if (AUTH_TOKEN) fetchTasks()
    else console.error("Authentication token not found")
  }, [])

  // Calculate task status
  const getTaskStatus = (dueDate, isCompleted) => {
    if (isCompleted) return "completed"
    const today = new Date().toISOString().split("T")[0]
    if (dueDate < today) return "overdue"
    if (dueDate === today) return "today"
    return "upcoming"
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "overdue":
        return "bg-red-100 text-red-800"
      case "today":
        return "bg-orange-100 text-orange-800"
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      case "completed":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "text-red-600"
      case "medium":
        return "text-yellow-600"
      case "low":
        return "text-green-600"
      default:
        return "text-gray-600"
    }
  }

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${TASKS_API_URL}/${id}`, {
        headers: {
          Authorization: `Bearer ${AUTH_TOKEN}`,
          Accept: "application/json",
        },
      })
      setTasks(tasks.filter((task) => task.id !== id))
      setDeleteTaskId(null)
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const filteredTasks = filter === "all" ? tasks : tasks.filter((task) => task.status === filter)

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">{t.title}</h1>
          <p className="text-green-600">{t.subtitle}</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg p-4 shadow-lg">
        <div className="flex flex-wrap gap-2">
          {["all", "today", "overdue", "upcoming", "completed"].map(
            (filterOption) => (
              <button
                key={filterOption}
                onClick={() => setFilter(filterOption)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  filter === filterOption
                    ? "bg-green-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {t[filterOption]}
              </button>
            )
          )}
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-12">
            <div className="text-gray-600 text-lg">{t.loading}</div>
            <div className="mt-4 animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600 mx-auto"></div>
          </div>
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {task.title}
                    </h3>
                    <span
                      className={`px-2 py-1 text-xs rounded-full ${getStatusColor(
                        task.status
                      )}`}
                    >
                      {t[task.status]}
                    </span>
                    <span
                      className={`text-sm font-medium ${getPriorityColor(
                        task.priority
                      )}`}
                    >
                      {t[task.priority]} {t.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{task.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{task.dueDate}</span>
                  </div>
                  <p className="text-sm text-gray-500">
                    {t.crop}: {task.crop_name}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setDeleteTaskId(task.id)}
                    className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors"
                  >
                    {t.delete}
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-lg p-12 shadow-lg text-center">
            <Clock className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">{t.noTasks}</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteTaskId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.delete}</h2>
            <p className="text-gray-600 mb-6">{t.confirmDelete}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setDeleteTaskId(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                {t.cancel}
              </button>
              <button
                onClick={() => handleDeleteTask(deleteTaskId)}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                {t.delete}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default TasksView