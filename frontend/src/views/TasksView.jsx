"use client"

import { Calendar, Clock, CheckCircle, X } from "lucide-react"
import { useState, useEffect } from "react"
import axios from "axios"

const TasksView = ({ language }) => {
  const [filter, setFilter] = useState("all")
  const [tasks, setTasks] = useState([])
  const [editTask, setEditTask] = useState(null)
  const [deleteTaskId, setDeleteTaskId] = useState(null)
  const [formErrors, setFormErrors] = useState({})
  const [loading, setLoading] = useState(true)

  // API base URL (adjust to your Laravel API endpoint)
  const API_URL = "http://localhost:8000/api/tasks"

  // Translations (unchanged)
  const translations = {
    en: {
      title: "Tasks & Reminders",
      subtitle: "Manage your farming activities and never miss important tasks",
      all: "All Tasks",
      today: "Today",
      overdue: "Overdue",
      upcoming: "Upcoming",
      completed: "Completed",
      markDone: "Mark Done",
      edit: "Edit",
      delete: "Delete",
      noTasks: "No tasks found",
      priority: "Priority",
      high: "High",
      medium: "Medium",
      low: "Low",
      editTask: "Edit Task",
      save: "Save",
      cancel: "Cancel",
      confirmDelete: "Are you sure you want to delete this task?",
      titleRequired: "Title is required",
      dueDateRequired: "Due date is required",
    },
    km: {
      title: "កិច្ចការ និងការរំលឹក",
      subtitle: "គ្រប់គ្រងសកម្មភាពកសិកម្មរបស់អ្នក និងកុំឱ្យខកខានកិច្ចការសំខាន់ៗ",
      all: "កិច្ចការទាំងអស់",
      today: "ថ្ងៃនេះ",
      overdue: "ហួសកាលកំណត់",
      upcoming: "នាពេលខាងមុខ",
      completed: "បានបញ្ចប់",
      markDone: "សម្គាល់ថាបានធ្វើ",
      edit: "កែប្រែ",
      delete: "លុប",
      noTasks: "រកមិនឃើញកិច្ចការ",
      priority: "អាទិភាព",
      high: "ខ្ពស់",
      medium: "មធ្យម",
      low: "ទាប",
      editTask: "កែប្រែកិច្ចការ",
      save: "រក្សាទុក",
      cancel: "បោះបង់",
      confirmDelete: "តើអ្នកប្រាកដថាចង់លុបកិច្ចការនេះទេ?",
      titleRequired: "ចំណងជើងត្រូវបានទាមទារ",
      dueDateRequired: "កាលបរិច្ឆេទកំណត់ត្រូវបានទាមទារ",
    },
  }

  const t = translations[language]

  // Fetch tasks from the database
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true)
        const response = await axios.get(API_URL)
        // Map backend data to frontend format
        const mappedTasks = response.data.map((task) => ({
          id: task.id,
          title: task.task_type, // Map task_type to title
          description: task.description || "",
          dueDate: task.due_date,
          priority: "medium", // Default priority (since not in DB schema)
          status: getTaskStatus(task.due_date, task.is_completed), // Calculate status
          category: task.task_type, // Use task_type as category
        }))
        setTasks(mappedTasks)
      } catch (error) {
        console.error("Error fetching tasks:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchTasks()
  }, [])

  // Calculate task status based on due date and completion
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

  const filteredTasks = filter === "all" ? tasks : tasks.filter((task) => task.status === filter)

  const handleEditTask = (task) => {
    setEditTask({ ...task })
    setFormErrors({})
  }

  const handleSaveEdit = async () => {
    const errors = {}
    if (!editTask?.title) errors.title = t.titleRequired
    if (!editTask?.dueDate) errors.dueDate = t.dueDateRequired

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }

    try {
      const response = await axios.put(`${API_URL}/${editTask.id}`, {
        user_id: 1, // Replace with actual user ID (e.g., from auth context)
        crop_id: null, // Adjust based on your needs
        task_type: editTask.title,
        description: editTask.description,
        due_date: editTask.dueDate,
        is_completed: editTask.status === "completed",
      })
      setTasks(tasks.map((t) => (t.id === editTask.id ? { ...editTask, ...response.data } : t)))
      setEditTask(null)
    } catch (error) {
      console.error("Error updating task:", error)
      setFormErrors({ api: "Failed to update task" })
    }
  }

  const handleDeleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`)
      setTasks(tasks.filter((task) => task.id !== id))
      setDeleteTaskId(null)
    } catch (error) {
      console.error("Error deleting task:", error)
    }
  }

  const handleMarkDone = async (id) => {
    try {
      const task = tasks.find((t) => t.id === id)
      await axios.put(`${API_URL}/${id}`, {
        user_id: 1, // Replace with actual user ID
        crop_id: null, // Adjust based on your needs
        task_type: task.title,
        description: task.description,
        due_date: task.dueDate,
        is_completed: true,
      })
      setTasks(
        tasks.map((task) =>
          task.id === id ? { ...task, status: "completed" } : task
        )
      )
    } catch (error) {
      console.error("Error marking task as done:", error)
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-2">{t.title}</h1>
        <p className="text-green-600">{t.subtitle}</p>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-lg p-4 shadow-lg">
        <div className="flex flex-wrap gap-2">
          {["all", "today", "overdue", "upcoming", "completed"].map((filterOption) => (
            <button
              key={filterOption}
              onClick={() => setFilter(filterOption)}
              className={`px-4 py-2 rounded-lg transition-colors ${
                filter === filterOption ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {t[filterOption]}
            </button>
          ))}
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : filteredTasks.length > 0 ? (
          filteredTasks.map((task) => (
            <div key={task.id} className="bg-white rounded-lg p-6 shadow-lg">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-800">{task.title}</h3>
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(task.status)}`}>
                      {t[task.status]}
                    </span>
                    <span className={`text-sm font-medium ${getPriorityColor(task.priority)}`}>
                      {t[task.priority]} {t.priority}
                    </span>
                  </div>
                  <p className="text-gray-600 mb-2">{task.description}</p>
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <Calendar className="h-4 w-4" />
                    <span>{task.dueDate}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {task.status !== "completed" && (
                    <button
                      onClick={() => handleMarkDone(task.id)}
                      className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-1"
                    >
                      <CheckCircle className="h-4 w-4" />
                      {t.markDone}
                    </button>
                  )}
                  <button
                    onClick={() => handleEditTask(task)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    {t.edit}
                  </button>
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

      {/* Edit Task Modal */}
      {editTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-800">{t.editTask}</h2>
              <button onClick={() => setEditTask(null)} className="text-gray-500 hover:text-gray-700">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">{t.title}</label>
                <input
                  type="text"
                  value={editTask.title}
                  onChange={(e) => setEditTask({ ...editTask, title: e.target.value })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 ${
                    formErrors.title ? "border-red-500" : ""
                  }`}
                />
                {formErrors.title && <p className="text-red-500 text-sm mt-1">{formErrors.title}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t.description}</label>
                <textarea
                  value={editTask.description}
                  onChange={(e) => setEditTask({ ...editTask, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                  rows="3"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t.dueDate}</label>
                <input
                  type="date"
                  value={editTask.dueDate}
                  onChange={(e) => setEditTask({ ...editTask, dueDate: e.target.value })}
                  className={`mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 ${
                    formErrors.dueDate ? "border-red-500" : ""
                  }`}
                />
                {formErrors.dueDate && <p className="text-red-500 text-sm mt-1">{formErrors.dueDate}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">{t.priority}</label>
                <select
                  value={editTask.priority}
                  onChange={(e) => setEditTask({ ...editTask, priority: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
                >
                  <option value="high">{t.high}</option>
                  <option value="medium">{t.medium}</option>
                  <option value="low">{t.low}</option>
                </select>
              </div>
            </div>
            {formErrors.api && <p className="text-red-500 text-sm mt-2">{formErrors.api}</p>}
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setEditTask(null)}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleSaveEdit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}

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