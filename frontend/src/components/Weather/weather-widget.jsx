"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card"
import { Button } from "../ui/Button"
import { Badge } from "../ui/Badge"
import { RefreshCw, MapPin, Clock, Thermometer, Droplets, Eye, Wind } from "lucide-react"

export function WeatherWidget({ location, lastUpdated, onRefresh, onWeatherDataChange }) {
  const [weatherData, setWeatherData] = useState({
    temperature: 24,
    feelsLike: 26,
    humidity: 65,
    pressure: 1013,
    visibility: 10,
    windSpeed: 12,
    windDirection: "NW",
    condition: "Partly Cloudy",
    icon: "⛅",
    uvIndex: 6,
    rainfall: 2.5,
    highTemp: 28,
    lowTemp: 18,
  })
  const [isRefreshing, setIsRefreshing] = useState(false)

  // Simulate API call to fetch weather data
  const fetchWeatherData = async () => {
    setIsRefreshing(true)

    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Mock weather data - in real implementation, this would be an API call
    const mockData = {
      temperature: Math.round(20 + Math.random() * 15),
      feelsLike: Math.round(22 + Math.random() * 15),
      humidity: Math.round(50 + Math.random() * 40),
      pressure: Math.round(1000 + Math.random() * 30),
      visibility: Math.round(8 + Math.random() * 7),
      windSpeed: Math.round(5 + Math.random() * 20),
      windDirection: ["N", "NE", "E", "SE", "S", "SW", "W", "NW"][Math.floor(Math.random() * 8)],
      condition: ["Sunny", "Partly Cloudy", "Cloudy", "Light Rain", "Clear"][Math.floor(Math.random() * 5)],
      icon: ["☀️", "⛅", "☁️", "🌦️", "🌤️"][Math.floor(Math.random() * 5)],
      uvIndex: Math.round(1 + Math.random() * 10),
      rainfall: Math.round(Math.random() * 10 * 10) / 10,
      highTemp: Math.round(25 + Math.random() * 10),
      lowTemp: Math.round(15 + Math.random() * 8),
    }

    setWeatherData(mockData)
    setIsRefreshing(false)

    // Pass weather data to parent component for Quick Stats
    if (onWeatherDataChange) {
      onWeatherDataChange(mockData)
    }
  }

  // Auto-refresh every hour
  useEffect(() => {
    fetchWeatherData()
    const interval = setInterval(fetchWeatherData, 60 * 60 * 1000) // 1 hour
    return () => clearInterval(interval)
  }, [location])

  const handleRefresh = () => {
    fetchWeatherData()
    onRefresh()
  }

  const getUVIndexColor = (index) => {
    if (index <= 2) return "bg-green-500"
    if (index <= 5) return "bg-yellow-500"
    if (index <= 7) return "bg-orange-500"
    if (index <= 10) return "bg-red-500"
    return "bg-purple-500"
  }

  const getUVIndexLabel = (index) => {
    if (index <= 2) return "Low"
    if (index <= 5) return "Moderate"
    if (index <= 7) return "High"
    if (index <= 10) return "Very High"
    return "Extreme"
  }

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-2xl flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              {location.name}
              {location.name === "Farm Location" && (
                <Badge variant="outline" className="text-xs ml-2">
                  Default Location
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Clock className="h-4 w-4" />
              Last updated: {lastUpdated.toLocaleTimeString()}
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={handleRefresh} disabled={isRefreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Current Temperature */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-6xl">{weatherData.icon}</div>
            <div>
              <div className="text-4xl font-bold">{weatherData.temperature}°C</div>
              <div className="text-lg text-muted-foreground">Feels like {weatherData.feelsLike}°C</div>
              <div className="text-sm font-medium text-green-700">{weatherData.condition}</div>
            </div>
          </div>
          <Badge variant="secondary" className={`${getUVIndexColor(weatherData.uvIndex)} text-white`}>
            UV {weatherData.uvIndex} - {getUVIndexLabel(weatherData.uvIndex)}
          </Badge>
        </div>

        {/* Weather Details Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
            <Droplets className="h-5 w-5 text-blue-600" />
            <div>
              <div className="text-sm text-muted-foreground">Humidity</div>
              <div className="font-semibold">{weatherData.humidity}%</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-lg">
            <Wind className="h-5 w-5 text-gray-600" />
            <div>
              <div className="text-sm text-muted-foreground">Wind</div>
              <div className="font-semibold">
                {weatherData.windSpeed} km/h {weatherData.windDirection}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
            <Thermometer className="h-5 w-5 text-purple-600" />
            <div>
              <div className="text-sm text-muted-foreground">Pressure</div>
              <div className="font-semibold">{weatherData.pressure} hPa</div>
            </div>
          </div>

          <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
            <Eye className="h-5 w-5 text-green-600" />
            <div>
              <div className="text-sm text-muted-foreground">Visibility</div>
              <div className="font-semibold">{weatherData.visibility} km</div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
