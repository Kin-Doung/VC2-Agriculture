"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card"
import { Badge } from "../ui/Badge"
import { Calendar, TrendingUp, TrendingDown } from "lucide-react"

export function WeatherForecast({ location, lastUpdated }) {
  const [forecastData, setForecastData] = useState([])

  // Generate mock forecast data
  useEffect(() => {
    const generateForecast = () => {
      const forecast = []
      const today = new Date()

      const conditions = [
        { icon: "☀️", condition: "Sunny", advice: "Perfect for harvesting and field work" },
        { icon: "⛅", condition: "Partly Cloudy", advice: "Good conditions for most farming activities" },
        { icon: "☁️", condition: "Cloudy", advice: "Ideal for transplanting seedlings" },
        { icon: "🌦️", condition: "Light Rain", advice: "Natural irrigation - avoid heavy machinery" },
        { icon: "🌧️", condition: "Rain", advice: "Indoor tasks recommended" },
        { icon: "🌤️", condition: "Mostly Sunny", advice: "Excellent for spraying and fertilizing" },
      ]

      for (let i = 0; i < 7; i++) {
        const date = new Date(today)
        date.setDate(today.getDate() + i)

        const conditionIndex = Math.floor(Math.random() * conditions.length)
        const selectedCondition = conditions[conditionIndex]

        forecast.push({
          date,
          dayName: i === 0 ? "Today" : i === 1 ? "Tomorrow" : date.toLocaleDateString("en-US", { weekday: "short" }),
          icon: selectedCondition.icon,
          condition: selectedCondition.condition,
          highTemp: Math.round(20 + Math.random() * 15),
          lowTemp: Math.round(10 + Math.random() * 10),
          humidity: Math.round(40 + Math.random() * 40),
          rainfall: Math.round(Math.random() * 10 * 10) / 10,
          windSpeed: Math.round(5 + Math.random() * 15),
          farmingAdvice: selectedCondition.advice,
        })
      }

      setForecastData(forecast)
    }

    generateForecast()
  }, [location, lastUpdated])

  const getRainfallColor = (rainfall) => {
    if (rainfall === 0) return "text-gray-500"
    if (rainfall < 2) return "text-blue-400"
    if (rainfall < 5) return "text-blue-600"
    return "text-blue-800"
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Calendar className="h-5 w-5 text-green-600" />
          7-Day Weather Forecast
        </CardTitle>
        <CardDescription>Extended forecast for {location.name}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-4">
          {forecastData.map((day, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border transition-all hover:shadow-md ${
                index === 0 ? "bg-green-50 border-green-200" : "bg-white border-gray-200"
              }`}
            >
              {/* Day and Date */}
              <div className="text-center mb-3">
                <div className={`font-semibold ${index === 0 ? "text-green-800" : "text-gray-800"}`}>{day.dayName}</div>
                <div className="text-xs text-muted-foreground">
                  {day.date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                </div>
              </div>

              {/* Weather Icon and Condition */}
              <div className="text-center mb-3">
                <div className="text-3xl mb-1">{day.icon}</div>
                <div className="text-xs text-muted-foreground">{day.condition}</div>
              </div>

              {/* Temperature */}
              <div className="flex items-center justify-center gap-2 mb-3">
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-3 w-3 text-red-500" />
                  <span className="font-semibold text-red-600">{day.highTemp}°</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingDown className="h-3 w-3 text-blue-500" />
                  <span className="font-semibold text-blue-600">{day.lowTemp}°</span>
                </div>
              </div>

              {/* Weather Details */}
              <div className="space-y-2 text-xs">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Humidity:</span>
                  <span>{day.humidity}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Rain:</span>
                  <span className={getRainfallColor(day.rainfall)}>{day.rainfall}mm</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Wind:</span>
                  <span>{day.windSpeed} km/h</span>
                </div>
              </div>

              {/* Farming Advice */}
              {index < 3 && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <Badge variant="outline" className="text-xs p-1 h-auto">
                    💡 {day.farmingAdvice}
                  </Badge>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
