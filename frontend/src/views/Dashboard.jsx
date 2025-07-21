import WeatherWidget from "../components/WeatherWidget"
import TaskReminders from "../components/TaskReminders"
import CropTracker from "../components/CropTracker"
import MarketPrices from "../components/MarketPrices"
import QuickActions from "../components/QuickActions"

const Dashboard = ({ language }) => {
  const translations = {
    en: {
      welcome: "Welcome back, Farmer!",
      subtitle: "Manage your farm efficiently with our tools",
    },
    km: {
      welcome: "សូមស្វាគមន៍ កសិករ!",
      subtitle: "គ្រប់គ្រងកសិដ្ឋានរបស់អ្នកប្រកបដោយប្រសិទ្ធភាព",
    },
  }

  const t = translations[language]

  return (
    <div className="p-4 space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-green-800 mb-2">{t.welcome}</h2>
        <p className="text-green-600">{t.subtitle}</p>
      </div>

      <WeatherWidget language={language} />
      <QuickActions language={language} />
      <TaskReminders language={language} />
      <CropTracker language={language} />
      <MarketPrices language={language} />
    </div>
  )
}

export default Dashboard
