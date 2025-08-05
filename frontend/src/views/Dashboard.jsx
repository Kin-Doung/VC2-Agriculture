import { useEffect, useState } from "react"
import TaskReminders from "../components/TaskReminders"
import CropTracker from "../components/CropTracker"
import MarketPrices from "../components/MarketPrices"
import QuickActions from "../components/QuickActions"

const API_KEY = "f20a808612250d10cfeb495115efb768"

const WeatherWidget = ({ language }) => {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const translations = {
    en: {
      title: "Current Weather",
      loading: "Loading weather...",
      error: "Unable to load weather data.",
      denied: "Location access denied. Showing Phnom Penh weather.",
      temperature: "Temperature",
      humidity: "Humidity",
      location: "Location",
    },
    km: {
      title: "អាកាសធាតុបច្ចុប្បន្ន",
      loading: "កំពុងផ្ទុកទិន្នន័យអាកាសធាតុ...",
      error: "មិនអាចផ្ទុកទិន្នន័យអាកាសធាតាបានទេ។",
      denied: "ការចូលដំណើរការទីតាំងត្រូវបានបដិសេធ។ កំពុងបង្ហាញអាកាសធាតុនៃភ្នំពេញ។",
      temperature: "សីតុណ្ហភាព",
      humidity: "សំណើម",
      location: "ទីតាំង",
    },
  }

  const t = translations[language] || translations.en

  const fetchWeather = async (lat, lon, fallbackMessage = null) => {
    try {
      const res = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=${language}&appid=${API_KEY}`
      )

      if (!res.ok) {
        throw new Error(`API Error (${res.status})`)
      }

      const data = await res.json()
      setWeather(data)

      if (fallbackMessage) {
        setError(fallbackMessage)
      }
    } catch (err) {
      console.error("Weather fetch error:", err)
      setError(`${t.error} (${err.message})`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        fetchWeather(latitude, longitude)
      },
      () => {
        // Fallback to Phnom Penh
        fetchWeather(11.5564, 104.9282, t.denied)
      }
    )
  }, [language])

  if (loading) {
    return (
      <div className="bg-blue-100 p-4 rounded-lg shadow text-center">
        <p>{t.loading}</p>
      </div>
    )
  }

  if (!weather) {
    return (
      <div className="bg-red-100 p-4 rounded-lg shadow text-center text-red-700">
        <p>{error || t.error}</p>
      </div>
    )
  }

  const iconUrl = `http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`

  return (
    <div className="bg-blue-100 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold mb-2">{t.title}</h3>
      {error && (
        <div className="text-yellow-700 text-sm mb-2 italic">{error}</div>
      )}
      <div className="flex items-center space-x-4">
        <img src={iconUrl} alt="weather icon" className="w-16 h-16" />
        <div>
          <p><strong>{t.location}:</strong> {weather.name}</p>
          <p><strong>{t.temperature}:</strong> {weather.main.temp}°C</p>
          <p><strong>{t.humidity}:</strong> {weather.main.humidity}%</p>
          <p className="capitalize">{weather.weather[0].description}</p>
        </div>
      </div>
    </div>
  )
}

const Dashboard = ({ language }) => {
  const user = JSON.parse(localStorage.getItem("user"))

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
