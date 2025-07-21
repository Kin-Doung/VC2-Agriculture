"use client"

import { Calendar, Clock, Plus, CheckCircle } from "lucide-react"
import { useState } from "react"

const TasksView = ({ language }) => {
  const [filter, setFilter] = useState("all")

  const translations = {
    en: {
      title: "Tasks & Reminders",
      subtitle: "Manage your farming activities and never miss important tasks",
      addTask: "Add New Task",
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
    },
    km: {
      title: "កិច្ចការ និងការរំលឹក",
      subtitle: "គ្រប់គ្រងសកម្មភាពកសិកម្មរបស់អ្នក និងកុំឱ្យខកខានកិច្ចការសំខាន់ៗ",
      addTask: "បន្ថែមកិច្ចការថ្មី",
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
    },
  }

  const t = translations[language]

  const tasks = [
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
  ]

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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-green-800 mb-2">{t.title}</h1>
          <p className="text-green-600">{t.subtitle}</p>
        </div>
        <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {t.addTask}
        </button>
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
                  <button className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors">
                    {t.edit}
                  </button>
                  <button className="px-3 py-1 text-sm bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors">
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
    </div>
  )
}

export default TasksView
