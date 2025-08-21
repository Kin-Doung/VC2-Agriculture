"use client"

import { Calendar, Clock, CheckCircle } from "lucide-react"
import { useState } from "react"

const TasksView = ({ language }) => {
  const [filter, setFilter] = useState("all")
  const [tasks, setTasks] = useState([
    {
      id: 1,
      title: "Apply fertilizer to rice field",
      description: "Apply NPK fertilizer to Rice Field A",
      dueDate: "2024-01-20",
      priority: "high",
      status: "overdue",
      category: "fertilizing",
    },
    {
      id: 2,
      title: "Water tomato plants",
      description: "Morning watering for tomato garden",
      dueDate: "2024-01-22",
      priority: "medium",
      status: "today",
      category: "watering",
    },
    {
      id: 3,
      title: "Harvest corn",
      description: "Corn Field B is ready for harvest",
      dueDate: "2024-01-22",
      priority: "high",
      status: "today",
      category: "harvesting",
    },
    {
      id: 4,
      title: "Inspect crops for pests",
      description: "Weekly pest inspection",
      dueDate: "2024-01-25",
      priority: "medium",
      status: "upcoming",
      category: "inspection",
    },
  ])
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState(null)
  const [editForm, setEditForm] = useState({ title: "", description: "", dueDate: "", priority: "" })

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
      save: "Save",
      cancel: "Cancel",
      confirmDelete: "Are you sure you want to delete this task?",
      editTask: "Edit Task",
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
      save: "រក្សាទុក",
      cancel: "បោះបង់",
      confirmDelete: "តើអ្នកប្រាកដជាចង់លុបកិច្ចការនេះមែនទេ?",
      editTask: "កែប្រែកិច្ចការ",
    },
  }

  const t = translations[language]

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

  const handleEditClick = (task) => {
    setCurrentTask(task)
    setEditForm({
      title: task.title,
      description: task.description,
      dueDate: task.dueDate,
      priority: task.priority,
    })
    setIsEditModalOpen(true)
  }

  const handleDeleteClick = (task) => {
    setCurrentTask(task)
    setIsDeleteModalOpen(true)
  }

  const handleEditSubmit = () => {
    setTasks(tasks.map((task) =>
      task.id === currentTask.id
        ? { ...task, ...editForm }
        : task
    ))
    setIsEditModalOpen(false)
    setCurrentTask(null)
  }

  const handleDeleteConfirm = () => {
    setTasks(tasks.filter((task) => task.id !== currentTask.id))
    setIsDeleteModalOpen(false)
    setCurrentTask(null)
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
        {filteredTasks.length > 0 ? (
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
                    <button className="px-3 py-1 text-sm bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors flex items-center gap-1">
                      <CheckCircle className="h-4 w-4" />
                      {t.markDone}
                    </button>
                  )}
                  <button
                    onClick={() => handleEditClick(task)}
                    className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
                  >
                    {t.edit}
                  </button>
                  <button
                    onClick={() => handleDeleteClick(task)}
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
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t.editTask}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Title</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-600 focus:ring-green-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-600 focus:ring-green-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Due Date</label>
                <input
                  type="date"
                  value={editForm.dueDate}
                  onChange={(e) => setEditForm({ ...editForm, dueDate: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-600 focus:ring-green-600"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Priority</label>
                <select
                  value={editForm.priority}
                  onChange={(e) => setEditForm({ ...editForm, priority: e.target.value })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-600 focus:ring-green-600"
                >
                  <option value="high">{t.high}</option>
                  <option value="medium">{t.medium}</option>
                  <option value="low">{t.low}</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleEditSubmit}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                {t.save}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t.delete}</h2>
            <p className="text-gray-600 mb-6">{t.confirmDelete}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleDeleteConfirm}
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