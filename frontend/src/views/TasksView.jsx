"use client"

import { Calendar, Clock, CheckCircle, Trash, List, MoreVertical, Bell } from "lucide-react"
import { useState, useEffect } from "react"

const TasksView = ({ language = "en", outOfStockProducts = [], outOfStockCount = 0 }) => {
  const [filter, setFilter] = useState("all")
  const [tasks, setTasks] = useState([])
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
  const [currentTask, setCurrentTask] = useState(null)
  const [openMenuId, setOpenMenuId] = useState(null)
  const [slideTasks, setSlideTasks] = useState(new Set())
  const [successMessage, setSuccessMessage] = useState(null)
  const [outOfStockMessage, setOutOfStockMessage] = useState(null)

  const translations = {
    en: {
      title: "Tasks & Reminders",
      subtitle: "Manage your farming activities and never miss important tasks",
      all: "All Tasks",
      today: "Today",
      overdue: "Overdue",
      top10: "Top 10",
      delete: "Delete",
      noTasks: "No tasks found",
      priority: "Priority",
      high: "High",
      medium: "Medium",
      low: "Low",
      cancel: "Cancel",
      confirmDelete: "Are you sure you want to delete this task?",
      outOfStockMessage: "Product out of stock, please set more",
      restockTaskTitle: "Restock Product",
      sortByDueDate: "Sort by Due Date",
      sortByPriority: "Sort by Priority",
      sortByStatus: "Sort by Status",
      successMessage: "Task deleted successfully",
    },
    km: {
      title: "កិច្ចការ និងការរំលឹក",
      subtitle: "គ្រប់គ្រងសកម្មភាពកសិកម្មរបស់អ្នក និងកុំឱ្យខកខានកិច្ចការសំខាន់ៗ",
      all: "កិច្ចការទាំងអស់",
      today: "ថ្ងៃនេះ",
      overdue: "ហួសកំណត់",
      top10: "ធំ ១០",
      delete: "លុប",
      noTasks: "រកមិនឃើញកិច្ចការ",
      priority: "អាទិភាព",
      high: "ខ្ពស់",
      medium: "មធ្យម",
      low: "ទាប",
      cancel: "បោះបង់",
      confirmDelete: "តើអ្នកប្រាកដជាចង់លុបកិច្ចការនេះមែនទេ?",
      outOfStockMessage: "ផលិតផលអស់ស្តុក សូមបន្ថែមបរិមាណ",
      restockTaskTitle: "បំពេញស្តុកផលិតផល",
      sortByDueDate: "តម្រៀបតាមកាលបរិច្ឆេទផុតកំណត់",
      sortByPriority: "តម្រៀបតាមអាទិភាព",
      sortByStatus: "តម្រៀបតាមស្ថានភាព",
      successMessage: "កិច្ចការត្រូវបានលុបដោយជោគជ័យ",
    },
  }

  const t = translations[language] || translations.en

  // Load tasks from localStorage and notifications on component mount
  useEffect(() => {
    const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]")
    const notifications = JSON.parse(localStorage.getItem("notifications") || "[]")
    const notificationTasks = notifications
      .filter((n) => n.status !== "completed")
      .map((n) => ({
        id: n.id,
        productId: n.productId,
        title: t.restockTaskTitle,
        description: n.message,
        dueDate: new Date().toISOString().split("T")[0],
        priority: "medium",
        status: n.status,
      }))
    const combinedTasks = [...storedTasks, ...notificationTasks.filter(nt => !storedTasks.some(st => st.id === nt.id))]
    setTasks(combinedTasks)
  }, [t.restockTaskTitle])

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem("tasks", JSON.stringify(tasks))
  }, [tasks])

  // Clear success message or out-of-stock message after 3 seconds
  useEffect(() => {
    if (successMessage || outOfStockMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage(null)
        setOutOfStockMessage(null)
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [successMessage, outOfStockMessage])

  // Create tasks for out-of-stock products
  useEffect(() => {
    if (!Array.isArray(outOfStockProducts) || outOfStockProducts.length === 0) {
      return
    }

    const storedTasks = JSON.parse(localStorage.getItem("tasks") || "[]")
    const existingTaskIds = storedTasks.map((task) => task.productId).filter(Boolean)
    const hasShownOutOfStockMessage = localStorage.getItem("hasShownOutOfStockMessage") === "true"

    const newTasks = outOfStockProducts
      .filter((product) => !existingTaskIds.includes(product.id))
      .map((product) => ({
        id: `task-${product.id}-${Date.now()}`,
        productId: product.id,
        title: t.restockTaskTitle,
        description: `${t.outOfStockMessage} (Product: ${product.name || "Phka Rumduol"})`,
        dueDate: new Date().toISOString().split("T")[0],
        priority: "medium",
        status: "today",
      }))

    if (newTasks.length > 0) {
      setTasks((prevTasks) => [...prevTasks, ...newTasks])
      // Show out-of-stock message only if not previously shown
      if (!hasShownOutOfStockMessage) {
        setOutOfStockMessage(t.outOfStockMessage)
        localStorage.setItem("hasShownOutOfStockMessage", "true")
      }
    }
  }, [outOfStockProducts, t.outOfStockMessage, t.restockTaskTitle])

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

  const handleDeleteClick = (task) => {
    setCurrentTask(task)
    setIsDeleteModalOpen(true)
    setOpenMenuId(null)
    setSlideTasks(new Set())
  }

  const handleDeleteConfirm = () => {
    // Filter out the task from the state
    const updatedTasks = tasks.filter((task) => task.id !== currentTask.id)
    setTasks(updatedTasks)
    
    // Update tasks in localStorage by removing the task
    localStorage.setItem("tasks", JSON.stringify(updatedTasks))

    // Remove the corresponding notification from localStorage
    const notifications = JSON.parse(localStorage.getItem("notifications") || "[]")
    const updatedNotifications = notifications.filter((n) => n.id !== currentTask.id)
    localStorage.setItem("notifications", JSON.stringify(updatedNotifications))

    // Set success message
    setSuccessMessage(t.successMessage)

    // Close modal and reset current task
    setIsDeleteModalOpen(false)
    setCurrentTask(null)
  }

  const toggleMenu = (taskId) => {
    setOpenMenuId(openMenuId === taskId ? null : taskId)
  }

  const toggleSlide = (taskId, e) => {
    e.stopPropagation()
    const newSlideTasks = new Set(slideTasks)
    if (newSlideTasks.has(taskId)) {
      newSlideTasks.delete(taskId)
    } else {
      newSlideTasks.add(taskId)
    }
    setSlideTasks(newSlideTasks)
  }

  const filteredTasks = (() => {
    switch (filter) {
      case "all":
        return tasks
      case "top10":
        return tasks.slice(0, 10)
      case "today":
      case "overdue":
      case "upcoming":
      case "completed":
        return tasks.filter((task) => task.status === filter)
      case "sortDueDate":
        return [...tasks].sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
      case "sortPriority":
        return [...tasks].sort((a, b) => {
          const priorityOrder = { high: 1, medium: 2, low: 3 }
          return priorityOrder[a.priority] - priorityOrder[b.priority]
        })
      case "sortStatus":
        return [...tasks].sort((a, b) => a.status.localeCompare(b.status))
      default:
        return tasks
    }
  })()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">{t.title}</h1>
          <p className="text-green-600">{t.subtitle}</p>
        </div>
      </div>

      {/* Success Message */}
      {successMessage && (
        <div className="bg-green-100 text-green-800 p-4 rounded-lg shadow-lg mb-6 flex items-center gap-2 border border-gray-200">
          <CheckCircle className="h-5 w-5" />
          <p className="text-sm">{successMessage}</p>
        </div>
      )}

      {/* Out-of-Stock Message */}
      {outOfStockMessage && (
        <div className="bg-red-100 text-red-800 p-4 rounded-lg shadow-lg mb-6 flex items-center gap-2 border border-gray-200">
          <Bell className="h-5 w-5" />
          <p className="text-sm">{outOfStockMessage}</p>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center justify-between bg-white rounded-lg p-4 shadow-lg mb-6 border border-gray-200">
        <div className="flex flex-wrap gap-2">
          {[
            { key: "all", label: t.all, icon: <CheckCircle className="h-5 w-5" /> },
            { key: "today", label: t.today, icon: <Calendar className="h-5 w-5" /> },
            { key: "overdue", label: t.overdue, icon: <Clock className="h-5 w-5" /> },
            { key: "top10", label: t.top10, icon: <List className="h-5 w-5" /> },
          ].map((filterOption) => (
            <button
              key={filterOption.key}
              onClick={() => setFilter(filterOption.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                filter === filterOption.key ? "bg-green-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
              aria-label={`Filter tasks by ${filterOption.label}`}
            >
              {filterOption.icon}
              {filterOption.label}
            </button>
          ))}
        </div>

        <div className="relative">
          <button
            onClick={() => setOpenMenuId(openMenuId === "sort" ? null : "sort")}
            className="p-2 rounded-md bg-gray-100 hover:bg-gray-200 transition-colors"
            aria-label="Open sort menu"
          >
            <List className="h-5 w-5 inline-block" />
            <span className="ml-1">▼</span>
          </button>
          {openMenuId === "sort" && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
              <button
                onClick={() => {
                  setFilter("sortDueDate")
                  setOpenMenuId(null)
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {t.sortByDueDate}
              </button>
              <button
                onClick={() => {
                  setFilter("sortPriority")
                  setOpenMenuId(null)
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {t.sortByPriority}
              </button>
              <button
                onClick={() => {
                  setFilter("sortStatus")
                  setOpenMenuId(null)
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                {t.sortByStatus}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Task List */}
      <div className="space-y-4">
        {filteredTasks.length === 0 ? (
          <div className="bg-white rounded-lg p-12 shadow-lg text-center border border-gray-200">
            <Clock className="h-16 w-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-600 text-lg">{t.noTasks}</p>
          </div>
        ) : (
          filteredTasks.map((task) => {
            const isSliding = slideTasks.has(task.id)

            return (
              <div key={task.id} className="bg-white rounded-lg shadow-md transition-all overflow-hidden relative border border-gray-200">
                <div
                  className={`transition-transform duration-300 ease-in-out p-4 ${
                    isSliding ? "transform -translate-x-20" : ""
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-800 mb-1">{task.title}</h3>
                      <p className="text-gray-500 text-sm mb-2">{task.description}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">📅 {new Date(task.dueDate).toLocaleDateString()}</span>
                        <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                          {t[task.status] || task.status}
                        </span>
                        <span className={`text-xs px-2 py-1 rounded-full bg-orange-100 text-orange-800`}>
                          {t[task.priority] || task.priority} {t.priority}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <button
                        onClick={(e) => toggleSlide(task.id, e)}
                        className="p-2 rounded-md hover:bg-gray-100 transition-colors"
                        aria-label={`More options for ${task.title}`}
                      >
                        <MoreVertical className="h-5 w-5 text-gray-500" />
                      </button>
                    </div>
                  </div>
                </div>

                <div
                  className={`absolute top-0 right-0 h-full w-20 bg-gray-200 flex items-center justify-center transition-opacity duration-300 ${
                    isSliding ? "opacity-100" : "opacity-0 pointer-events-none"
                  }`}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteClick(task)
                    }}
                    className="p-3 rounded-md hover:bg-gray-300 transition-colors"
                    aria-label={`Delete task ${task.title}`}
                  >
                    <Trash className="h-6 w-6 text-red-500 hover:text-red-600" />
                  </button>
                </div>
              </div>
            )
          })
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {isDeleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-sm border border-gray-200">
            <h2 className="text-xl font-bold text-gray-800 mb-4">{t.delete}</h2>
            <p className="text-gray-600 mb-6">{t.confirmDelete}</p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200"
                aria-label="Cancel delete"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                aria-label="Confirm delete"
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