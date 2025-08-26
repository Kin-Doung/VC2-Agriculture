"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Cloud, Sun, CloudRain, Wind, Droplets } from "lucide-react"

const WeatherWidget = ({ language, lastUpdated, onWeatherDataChange, weatherData }) => {
  const navigate = useNavigate()
  const [currentWeatherData, setCurrentWeatherData] = useState(null)

  const translations = {
    en: {
      title: "Today's Weather",
      humidity: "Humidity",
      wind: "Wind",
      rainfall: "Rainfall",
      temperatureHot: "Very hot - increase watering",
      temperaturePerfect: "Perfect for crop growth",
      temperatureGood: "Good growing conditions",
      temperatureCool: "Cool - protect sensitive plants",
      rainfallHeavy: "Heavy rain - avoid field work",
      rainfallLight: "Light irrigation needed",
      rainfallNatural: "Natural watering occurring",
      rainfallNone: "Consider irrigation",
      windHigh: "Too windy for spraying",
      windModerate: "Secure loose materials",
      windIdeal: "Ideal for spraying",
      windCalm: "Calm conditions",
      defaultAdvice: "Monitor conditions",
    },
    km: {
      title: "អាកាសធាតុថ្ងៃនេះ",
      humidity: "សំណើម",
      wind: "ខ្យល់",
      rainfall: "ទឹកភ្លៀង",
      temperatureHot: "ក្តៅខ្លាំង - បង្កើនការស្រោចទឹក",
      temperaturePerfect: "ល្អឥតខ្ចោះសម្រាប់ការលូតលាស់ដំណាំ",
      temperatureGood: "លក្ខខណ្ឌល្អសម្រាប់ការលូតលាស់",
      temperatureCool: "ត្រជាក់ - ការពាររុក្ខជាតិងាយរងគ្រោះ",
      rainfallHeavy: "ភ្លៀងធ្ងន់ - ជៀសវាងការងារវាលស្រែ",
      rainfallLight: "ត្រូវការស្រោចទឹកស្រាល",
      rainfallNatural: "ការស្រោចទឹកធម្មជាតិកំពុងកើតឡើង",
      rainfallNone: "ពិចារណាស្រោចទឹក",
      windHigh: "ខ្យល់ខ្លាំងពេកសម្រាប់ការបាញ់ថ្នាំ",
      windModerate: "ធានាសម្ភារៈរលុង",
      windIdeal: "ល្អសម្រាប់ការបាញ់ថ្នាំ",
      windCalm: "លក្ខខណ្ឌស្ងប់ស្ងាត់",
      defaultAdvice: "តាមដានលក្ខខណ្ឌ",
    },
  }

  const t = translations[language] || translations.en

  // fallback local data
  const fallbackData = {
    temperature: 24,
    highTemp: 28,
    lowTemp: 18,
    rainfall: 2.5,
    windSpeed: 12,
    condition: 2, // cloudy
    humidity: 65,
  }

  // map weathercode → icon
  const getWeatherIcon = (code) => {
    if (code === 0) return <Sun className="h-16 w-16 text-yellow-300" />       // clear
    if ([1, 2, 3].includes(code)) return <Cloud className="h-16 w-16 text-blue-200" /> // partly/overcast
    if ([45, 48].includes(code)) return <Cloud className="h-16 w-16 text-gray-300" />  // fog
    if ([51, 53, 55, 61, 63, 65, 80, 81, 82].includes(code)) return <CloudRain className="h-16 w-16 text-blue-400" /> // rain
    return <Cloud className="h-16 w-16 text-blue-200" /> // default
  }

  // fetch weather data
  useEffect(() => {
    if (weatherData) {
      setCurrentWeatherData(weatherData)
      return
    }

    const fetchWeather = async () => {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=11.55&longitude=104.92&current_weather=true&daily=temperature_2m_max,temperature_2m_min,precipitation_sum&timezone=auto`
        )
        const data = await res.json()

        const parsed = {
          temperature: data.current_weather.temperature,
          highTemp: data.daily?.temperature_2m_max?.[0] ?? null,
          lowTemp: data.daily?.temperature_2m_min?.[0] ?? null,
          rainfall: data.daily?.precipitation_sum?.[0] ?? null,
          windSpeed: data.current_weather.windspeed,
          condition: data.current_weather.weathercode,
          humidity: 65,
        }

        setCurrentWeatherData(parsed)
        if (onWeatherDataChange) onWeatherDataChange(parsed)
      } catch (err) {
        console.error("Weather fetch failed, using fallback:", err)
        setCurrentWeatherData(fallbackData)
      }
    }

    fetchWeather()
    const interval = setInterval(fetchWeather, 24 * 60 * 60 * 1000)
    return () => clearInterval(interval)
  }, [weatherData])

  const getFarmingAdvice = (type) => {
    if (!currentWeatherData) return t.defaultAdvice
    const { temperature, rainfall, windSpeed } = currentWeatherData

    switch (type) {
      case "temperature":
        if (temperature > 30) return t.temperatureHot
        if (temperature > 25) return t.temperaturePerfect
        if (temperature > 15) return t.temperatureGood
        return t.temperatureCool
      case "rainfall":
        if (rainfall > 5) return t.rainfallHeavy
        if (rainfall > 2) return t.rainfallLight
        if (rainfall > 0) return t.rainfallNatural
        return t.rainfallNone
      case "wind":
        if (windSpeed > 20) return t.windHigh
        if (windSpeed > 15) return t.windModerate
        if (windSpeed > 10) return t.windIdeal
        return t.windCalm
      default:
        return t.defaultAdvice
    }
  }

  const handleClick = () => navigate("/weather")

  const formattedLastUpdated =
    lastUpdated instanceof Date && !isNaN(lastUpdated)
      ? lastUpdated.toLocaleString()
      : new Date().toLocaleString()

  if (!currentWeatherData) return <div className="p-6">Loading weather...</div>

  return (
    <div
      className="bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-lg p-6 shadow-lg cursor-pointer hover:shadow-xl transition-shadow"
      onClick={handleClick}
    >
      <div className="flex items-center gap-2 mb-4">
        <Sun className="h-6 w-6" />
        <h3 className="text-xl font-semibold">{t.title}</h3>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="text-3xl font-bold">
            {currentWeatherData.lowTemp}°C - {currentWeatherData.highTemp}°C
          </div>
          <p className="text-sm text-blue-200 mt-1">
            {getFarmingAdvice("temperature")}
          </p>
        </div>
        {getWeatherIcon(currentWeatherData.condition)}
      </div>

      <div className="grid grid-cols-3 gap-4 text-sm mb-4">
        <div className="flex items-center gap-1">
          <Droplets className="h-4 w-4" />
          <span>{t.humidity}: {currentWeatherData.humidity}%</span>
        </div>
        <div className="flex items-center gap-1">
          <Wind className="h-4 w-4" />
          <span>{t.wind}: {currentWeatherData.windSpeed} km/h</span>
        </div>
        <div className="flex items-center gap-1">
          <CloudRain className="h-4 w-4" />
          <span>{t.rainfall}: {currentWeatherData.rainfall}mm</span>
        </div>
      </div>

      <div className="p-3 bg-blue-500 rounded-lg">
        <p className="text-sm">{getFarmingAdvice("rainfall")}</p>
        <p className="text-sm">{getFarmingAdvice("wind")}</p>
      </div>

      <div className="text-xs text-blue-200 mt-4">
        Last updated: {formattedLastUpdated}
      </div>
    </div>
  )
}

export default WeatherWidget
