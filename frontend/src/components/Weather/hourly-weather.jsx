"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card"
import { Clock, Droplets, Wind } from "lucide-react"

export function HourlyWeather({ location, lastUpdated }) {
  const [hourlyData, setHourlyData] = useState([])

  // Generate mock hourly weather data for 24 hours
  useEffect(() => {
    const generateHourlyData = () => {
      const hourly = []
      const now = new Date()

      // Weather conditions with icons
      const conditions = [
        { icon: "☀️", condition: "Sunny" },
        { icon: "⛅", condition: "Partly Cloudy" },
        { icon: "☁️", condition: "Cloudy" },
        { icon: "🌦️", condition: "Light Rain" },
        { icon: "🌧️", condition: "Rain" },
        { icon: "🌤️", condition: "Mostly Sunny" },
        { icon: "🌫️", condition: "Foggy" },
      ]

      for (let i = 0; i < 24; i++) {
        const hour = new Date(now)
        hour.setHours(now.getHours() + i)

        // Simulate temperature variation throughout the day
        const baseTemp = 20
        const hourOfDay = hour.getHours()
        let tempVariation = 0

        if (hourOfDay >= 6 && hourOfDay <= 12) {
          // Morning: gradual increase
          tempVariation = (hourOfDay - 6) * 2
        } else if (hourOfDay > 12 && hourOfDay <= 16) {
          // Afternoon: peak temperature
          tempVariation = 12 + Math.random() * 3
        } else if (hourOfDay > 16 && hourOfDay <= 20) {
          // Evening: gradual decrease
          tempVariation = 15 - (hourOfDay - 16) * 2
        } else {
          // Night: cooler temperatures
          tempVariation = Math.random() * 5
        }

        const conditionIndex = Math.floor(Math.random() * conditions.length)
        const selectedCondition = conditions[conditionIndex]

        hourly.push({
          time: hour,
          hour: hour.getHours(),
          temperature: Math.round(baseTemp + tempVariation),
          feelsLike: Math.round(baseTemp + tempVariation + Math.random() * 4 - 2),
          humidity: Math.round(40 + Math.random() * 40),
          windSpeed: Math.round(5 + Math.random() * 15),
          windDirection: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(Math.random() * 8)],
          precipitation: Math.round(Math.random() * 5 * 10) / 10,
          icon: selectedCondition.icon,
          condition: selectedCondition.condition,
          uvIndex: hourOfDay >= 6 && hourOfDay <= 18 ? Math.round(1 + Math.random() * 9) : 0,
        })
      }

      setHourlyData(hourly)
    }

    generateHourlyData()
  }, [location, lastUpdated])

  const formatHour = (hour) => {
    if (hour === 0) return "12 AM"
    if (hour === 12) return "12 PM"
    if (hour < 12) return `${hour} AM`
    return `${hour - 12} PM`
  }

  const getCurrentHourIndex = () => {
    const currentHour = new Date().getHours()
    return hourlyData.findIndex((data) => data.hour === currentHour)
  }

  const getTemperatureColor = (temp) => {
    if (temp <= 10) return "text-blue-600"
    if (temp <= 20) return "text-green-600"
    if (temp <= 30) return "text-yellow-600"
    return "text-red-600"
  }

  const getPrecipitationColor = (precip) => {
    if (precip === 0) return "text-gray-400"
    if (precip < 1) return "text-blue-400"
    if (precip < 3) return "text-blue-600"
    return "text-blue-800"
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Clock className="h-5 w-5 text-green-600" />
          24-Hour Weather Timeline
        </CardTitle>
        <CardDescription>Hourly weather conditions for today at {location.name}</CardDescription>
      </CardHeader>

      <CardContent>
        <div className="overflow-x-auto">
          <div className="flex gap-4 pb-4" style={{ minWidth: "max-content" }}>
            {hourlyData.map((data, index) => {
              const isCurrentHour = index === getCurrentHourIndex()

              return (
                <div
                  key={index}
                  className={`flex-shrink-0 p-4 rounded-lg border transition-all ${
                    isCurrentHour
                      ? "bg-green-50 border-green-300 shadow-md"
                      : "bg-white border-gray-200 hover:shadow-sm"
                  }`}
                  style={{ minWidth: "140px" }}
                >
                  {/* Time */}
                  <div className="text-center mb-3">
                    <div className={`font-semibold text-sm ${isCurrentHour ? "text-green-800" : "text-gray-700"}`}>
                      {formatHour(data.hour)}
                    </div>
                    {isCurrentHour && <div className="text-xs text-green-600 font-medium">Now</div>}
                  </div>

                  {/* Weather Icon and Condition */}
                  <div className="text-center mb-3">
                    <div className="text-2xl mb-1">{data.icon}</div>
                    <div className="text-xs text-muted-foreground leading-tight">{data.condition}</div>
                  </div>

                  {/* Temperature */}
                  <div className="text-center mb-3">
                    <div className={`text-lg font-bold ${getTemperatureColor(data.temperature)}`}>
                      {data.temperature}°C
                    </div>
                    <div className="text-xs text-muted-foreground">Feels {data.feelsLike}°</div>
                  </div>

                  {/* Weather Details */}
                  <div className="space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Droplets className="h-3 w-3 text-blue-500" />
                        <span className="text-muted-foreground">Humidity</span>
                      </div>
                      <span className="font-medium">{data.humidity}%</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        <Wind className="h-3 w-3 text-gray-500" />
                        <span className="text-muted-foreground">Wind</span>
                      </div>
                      <span className="font-medium">{data.windSpeed} km/h</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">Rain</span>
                      <span className={`font-medium ${getPrecipitationColor(data.precipitation)}`}>
                        {data.precipitation}mm
                      </span>
                    </div>

                    {data.uvIndex > 0 && (
                      <div className="flex items-center justify-between">
                        <span className="text-muted-foreground">UV</span>
                        <span className="font-medium text-orange-600">{data.uvIndex}</span>
                      </div>
                    )}
                  </div>

                  {/* Farming Tip for next few hours */}
                  {index < 6 && (
                    <div className="mt-3 pt-3 border-t border-gray-200">
                      <div className="text-xs text-center">
                        {data.temperature > 25 && data.precipitation === 0 && (
                          <span className="text-orange-600">🌡️ Hot - Water crops</span>
                        )}
                        {data.precipitation > 2 && <span className="text-blue-600">🌧️ Rain - Indoor work</span>}
                        {data.windSpeed > 15 && <span className="text-gray-600">💨 Windy - Secure items</span>}
                        {data.temperature <= 25 && data.precipitation <= 1 && data.windSpeed <= 15 && (
                          <span className="text-green-600">✅ Good conditions</span>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>

        {/* Summary Stats */}
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-3 bg-red-50 rounded-lg text-center">
            <div className="text-sm text-muted-foreground">Today's High</div>
            <div className="text-lg font-bold text-red-600">{Math.max(...hourlyData.map((d) => d.temperature))}°C</div>
          </div>

          <div className="p-3 bg-blue-50 rounded-lg text-center">
            <div className="text-sm text-muted-foreground">Today's Low</div>
            <div className="text-lg font-bold text-blue-600">{Math.min(...hourlyData.map((d) => d.temperature))}°C</div>
          </div>

          <div className="p-3 bg-cyan-50 rounded-lg text-center">
            <div className="text-sm text-muted-foreground">Total Rain</div>
            <div className="text-lg font-bold text-cyan-600">
              {hourlyData.reduce((sum, d) => sum + d.precipitation, 0).toFixed(1)}mm
            </div>
          </div>

          <div className="p-3 bg-gray-50 rounded-lg text-center">
            <div className="text-sm text-muted-foreground">Avg Wind</div>
            <div className="text-lg font-bold text-gray-600">
              {Math.round(hourlyData.reduce((sum, d) => sum + d.windSpeed, 0) / hourlyData.length)} km/h
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
