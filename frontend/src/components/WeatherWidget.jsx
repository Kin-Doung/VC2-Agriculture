import { Cloud, Sun, CloudRain, Wind, Droplets } from "lucide-react"

const WeatherWidget = ({ language }) => {
  const translations = {
    en: {
      title: "Today's Weather",
      temperature: "28°C",
      condition: "Partly Cloudy",
      humidity: "Humidity: 65%",
      wind: "Wind: 12 km/h",
      rainfall: "Rainfall: 2mm",
      recommendation: "Good day for outdoor farming activities",
    },
    km: {
      title: "អាកាសធាតុថ្ងៃនេះ",
      temperature: "២៨°C",
      condition: "មានពពកខ្លះ",
      humidity: "សំណើម: ៦៥%",
      wind: "ខ្យល់: ១២ គ.ម/ម៉ោង",
      rainfall: "ទឹកភ្លៀង: ២មម",
      recommendation: "ថ្ងៃល្អសម្រាប់ធ្វើកសិកម្មក្រៅផ្ទះ",
    },
  }

  const t = translations[language]

  return (
    <div className="bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg p-6 shadow-lg">
      <div className="flex items-center gap-2 mb-4">
        <Sun className="h-6 w-6" />
        <h3 className="text-xl font-semibold">{t.title}</h3>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-3xl font-bold">{t.temperature}</div>
          <div className="text-blue-100">{t.condition}</div>
        </div>
        <Cloud className="h-16 w-16 text-blue-200" />
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm mb-4">
        <div className="flex items-center gap-1">
          <Droplets className="h-4 w-4" />
          <span>{t.humidity}</span>
        </div>
        <div className="flex items-center gap-1">
          <Wind className="h-4 w-4" />
          <span>{t.wind}</span>
        </div>
        <div className="flex items-center gap-1">
          <CloudRain className="h-4 w-4" />
          <span>{t.rainfall}</span>
        </div>
      </div>

      <div className="p-3 bg-blue-500 rounded-lg">
        <p className="text-sm">{t.recommendation}</p>
      </div>
    </div>
  )
}

export default WeatherWidget
