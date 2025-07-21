import { Clock, AlertCircle, Sprout } from "lucide-react"
import { Link } from "react-router-dom"

const TaskReminders = ({ language }) => {
  const translations = {
    en: {
      title: "Today's Tasks & Reminders",
      fertilizer: "Apply fertilizer to rice field",
      watering: "Water tomato plants",
      harvest: "Harvest corn - ready today",
      inspection: "Inspect crops for pests",
      overdue: "Overdue",
      today: "Today",
      upcoming: "Upcoming",
      markDone: "Mark Done",
      viewAll: "View All Tasks",
    },
    km: {
      title: "កិច្ចការ និងការរំលឹកថ្ងៃនេះ",
      fertilizer: "ដាក់ជីកម្រុកស្រូវ",
      watering: "ស្រោចទឹកដំណាំប៉េងប៉ោះ",
      harvest: "ច្រូតពោត - ត្រៀមរួចថ្ងៃនេះ",
      inspection: "ពិនិត្យដំណាំរកសត្វល្អិត",
      overdue: "ហួសកាលកំណត់",
      today: "ថ្ងៃនេះ",
      upcoming: "នាពេលខាងមុខ",
      markDone: "សម្គាល់ថាបានធ្វើ",
      viewAll: "មើលកិច្ចការទាំងអស់",
    },
  }

  const t = translations[language]

  const tasks = [
    { id: 1, task: t.fertilizer, status: "overdue", icon: Sprout },
    { id: 2, task: t.watering, status: "today", icon: Clock },
    { id: 3, task: t.harvest, status: "today", icon: AlertCircle },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "overdue":
        return "text-red-600 bg-red-50"
      case "today":
        return "text-orange-600 bg-orange-50"
      case "upcoming":
        return "text-green-600 bg-green-50"
      default:
        return "text-gray-600 bg-gray-50"
    }
  }

  const getStatusLabel = (status) => {
    switch (status) {
      case "overdue":
        return t.overdue
      case "today":
        return t.today
      case "upcoming":
        return t.upcoming
      default:
        return status
    }
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          <h3 className="text-xl font-semibold">{t.title}</h3>
        </div>
        <Link to="/tasks" className="text-sm text-green-600 hover:text-green-700 font-medium">
          {t.viewAll}
        </Link>
      </div>

      <div className="space-y-3">
        {tasks.map((task) => (
          <div key={task.id} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div className="flex items-center gap-3">
              <task.icon className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium">{task.task}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(task.status)}`}>
                  {getStatusLabel(task.status)}
                </span>
              </div>
            </div>
            <button className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
              {t.markDone}
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

export default TaskReminders
