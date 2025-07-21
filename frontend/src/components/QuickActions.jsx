import { Camera, MapPin, Plus, Scan, MessageCircle, TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"

const QuickActions = ({ language }) => {
  const translations = {
    en: {
      title: "Quick Actions",
      measureLand: "Measure Land",
      scanSeeds: "Scan Seeds",
      addCrop: "Add Crop",
      takePicture: "Take Picture",
      checkPrices: "Check Prices",
      messages: "Messages",
    },
    km: {
      title: "សកម្មភាពរហ័ស",
      measureLand: "វាស់ដី",
      scanSeeds: "ស្កេនគ្រាប់ពូជ",
      addCrop: "បន្ថែមដំណាំ",
      takePicture: "ថតរូប",
      checkPrices: "ពិនិត្យតម្លៃ",
      messages: "សារ",
    },
  }

  const t = translations[language]

  const actions = [
    { icon: MapPin, label: t.measureLand, color: "bg-green-500", path: "/measure" },
    { icon: Scan, label: t.scanSeeds, color: "bg-blue-500", path: "/scanner" },
    { icon: Plus, label: t.addCrop, color: "bg-purple-500", path: "/crops" },
    { icon: Camera, label: t.takePicture, color: "bg-orange-500", path: "/scanner" },
    { icon: TrendingUp, label: t.checkPrices, color: "bg-red-500", path: "/prices" },
    { icon: MessageCircle, label: t.messages, color: "bg-indigo-500", path: "/messages" },
  ]

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-semibold mb-4">{t.title}</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {actions.map((action, index) => (
          <Link
            key={index}
            to={action.path}
            className="flex flex-col items-center gap-2 p-4 border border-gray-200 rounded-lg hover:bg-gray-50 hover:scale-105 transition-all duration-200"
          >
            <div className={`p-3 rounded-full ${action.color} text-white`}>
              <action.icon className="h-6 w-6" />
            </div>
            <span className="text-sm font-medium text-gray-700">{action.label}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default QuickActions
