"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { WeatherWidget } from "../components/Weather/weather-widget"
import { WeatherForecast } from "../components/Weather/weather-forecast"
import { HourlyWeather } from "../components/Weather/hourly-weather"
import { LocationSelector } from "../components/Weather/location-selector"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/Card"
import { Separator } from "../components/ui/separator"
import { Sprout, Droplets, Thermometer, Wind, ArrowLeft } from "lucide-react"
import { Button } from "../components/ui/Button"

export default function FarmerDashboard({ language }) {
  const navigate = useNavigate();
  const [currentLocation, setCurrentLocation] = useState({
    name: "Farm Location",
    lat: 40.7128,
    lon: -74.006,
  })

  const [lastUpdated, setLastUpdated] = useState(new Date())
  const [currentWeatherData, setCurrentWeatherData] = useState({
    temperature: 24,
    highTemp: 28,
    lowTemp: 18,
    rainfall: 2.5,
    windSpeed: 12,
    condition: "Partly Cloudy",
    humidity: 65,
  })

  const handleLocationChange = (location) => {
    setCurrentLocation(location)
    setLastUpdated(new Date())
  }

  const handleRefresh = () => {
    setLastUpdated(new Date())
  }

  const handleWeatherDataChange = (weatherData) => {
    setCurrentWeatherData(weatherData)
  }

  // Generate farming status based on real weather data
  const getFarmingStatus = () => {
    const { temperature, rainfall, windSpeed, humidity } = currentWeatherData

    if (temperature > 30 || rainfall > 5 || windSpeed > 20) {
      return { status: "Caution Advised", color: "bg-yellow-600 hover:bg-yellow-700", icon: "⚠️" }
    } else if (temperature < 5 || rainfall > 10) {
      return { status: "Poor Conditions", color: "bg-red-600 hover:bg-red-700", icon: "❌" }
    } else {
      return { status: "Optimal Conditions", color: "bg-green-600 hover:bg-green-700", icon: "✅" }
    }
  }

  // Generate farming advice based on real weather data
  const getFarmingAdvice = (type) => {
    const { temperature, rainfall, windSpeed, humidity } = currentWeatherData

    switch (type) {
      case "temperature":
        if (temperature > 30) return "Very hot - increase watering"
        if (temperature > 25) return "Perfect for crop growth"
        if (temperature > 15) return "Good growing conditions"
        return "Cool - protect sensitive plants"

      case "rainfall":
        if (rainfall > 5) return "Heavy rain - avoid field work"
        if (rainfall > 2) return "Light irrigation needed"
        if (rainfall > 0) return "Natural watering occurring"
        return "Consider irrigation"

      case "wind":
        if (windSpeed > 20) return "Too windy for spraying"
        if (windSpeed > 15) return "Secure loose materials"
        if (windSpeed > 10) return "Ideal for spraying"
        return "Calm conditions"

      default:
        return "Monitor conditions"
    }
  }

  const farmingStatus = getFarmingStatus()

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-emerald-50">
      {/* Header Section */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-green-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-2 py-4">
          <div className="flex gap-40 items-center">
            <Button
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              Go back
            </Button>

            <div className="text-center space-y-3">
              <h1 className="text-5xl font-bold text-green-800 flex items-center justify-center gap-3">
                <Sprout className="h-10 w-10 text-green-600" />
                Farm Weather Dashboard
              </h1>
              <p className="text-lg text-green-700 max-w-2xl mx-auto">
                Real-time weather insights and forecasts to help you make informed farming decisions
              </p>
            </div>

          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Location Selector - Full Width */}
        <div className="w-full">
          <LocationSelector currentLocation={currentLocation} onLocationChange={handleLocationChange} />
        </div>

        {/* Weather Overview Section */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Main Weather Widget - Takes 3 columns on xl screens */}
          <div className="yl:col-span-4 xl:col-span-3">
            <WeatherWidget
              location={currentLocation}
              lastUpdated={lastUpdated}
              onRefresh={handleRefresh}
              onWeatherDataChange={handleWeatherDataChange}
            />
          </div>

          {/* Quick Stats Sidebar - Takes 1 column on xl screens */}
          <div className="space-y-4">
            <div className="text-lg font-semibold text-green-800 mb-4 flex items-center gap-2">
              <Thermometer className="h-5 w-5" />
              Quick Stats
            </div>

            <Card className="bg-gradient-to-br from-red-50 to-orange-50 border-red-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Thermometer className="h-4 w-4 text-red-500" />
                  Temperature Range
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-700">
                  {currentWeatherData.lowTemp}°C - {currentWeatherData.highTemp}°C
                </div>
                <p className="text-sm text-red-600 mt-1">{getFarmingAdvice("temperature")}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 border-blue-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Droplets className="h-4 w-4 text-blue-500" />
                  Rainfall Today
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-700">{currentWeatherData.rainfall}mm</div>
                <p className="text-sm text-blue-600 mt-1">{getFarmingAdvice("rainfall")}</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Wind className="h-4 w-4 text-gray-500" />
                  Wind Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-gray-700">{currentWeatherData.windSpeed} km/h</div>
                <p className="text-sm text-gray-600 mt-1">{getFarmingAdvice("wind")}</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <div className="text-sm text-muted-foreground font-medium">24-Hour Timeline</div>
          <Separator className="flex-1" />
        </div>

        {/* 24-Hour Weather Timeline - Full Width */}
        <div className="w-full">
          <HourlyWeather location={currentLocation} lastUpdated={lastUpdated} />
        </div>

        {/* Divider */}
        <div className="flex items-center gap-4">
          <Separator className="flex-1" />
          <div className="text-sm text-muted-foreground font-medium">7-Day Forecast</div>
          <Separator className="flex-1" />
        </div>

        {/* Weather Forecast - Full Width */}
        <div className="w-full">
          <WeatherForecast location={currentLocation} lastUpdated={lastUpdated} />
        </div>

        {/* Farming Recommendations Section */}
        <div className="w-full">
          <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
            <CardHeader className="bg-white/50 rounded-t-lg">
              <CardTitle className="text-2xl text-green-800 flex items-center gap-2">
                <Sprout className="h-6 w-6" />
                Today's Farming Recommendations
              </CardTitle>
              <CardDescription className="text-base">
                Personalized advice based on current weather conditions for your farm
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                <div className="p-6 bg-white rounded-xl shadow-sm border border-green-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">✅</span>
                    </div>
                    <h4 className="font-semibold text-green-800 text-lg">
                      {currentWeatherData.temperature > 25 ? "Monitor Heat Stress" : "Excellent for Planting"}
                    </h4>
                  </div>
                  <p className="text-green-700 leading-relaxed">
                    {currentWeatherData.temperature > 25
                      ? "High temperatures detected. Ensure adequate water supply and consider shade protection for sensitive crops."
                      : "Soil moisture and temperature are optimal for seed germination. Consider planting heat-sensitive crops today."}
                  </p>
                </div>

                <div className="p-6 bg-white rounded-xl shadow-sm border border-blue-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">💧</span>
                    </div>
                    <h4 className="font-semibold text-blue-800 text-lg">
                      {currentWeatherData.rainfall > 3 ? "Heavy Rain Alert" : "Moderate Watering"}
                    </h4>
                  </div>
                  <p className="text-blue-700 leading-relaxed">
                    {currentWeatherData.rainfall > 3
                      ? "Significant rainfall detected. Avoid heavy machinery and check for waterlogging in low-lying areas."
                      : "Recent rainfall reduces irrigation needs. Monitor soil moisture levels and water only if necessary."}
                  </p>
                </div>

                <div className="p-6 bg-white rounded-xl shadow-sm border border-yellow-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">{currentWeatherData.windSpeed > 15 ? "⚠️" : "🌬️"}</span>
                    </div>
                    <h4 className="font-semibold text-yellow-800 text-lg">
                      {currentWeatherData.windSpeed > 15 ? "High Wind Warning" : "Wind Advisory"}
                    </h4>
                  </div>
                  <p className="text-yellow-700 leading-relaxed">
                    {currentWeatherData.windSpeed > 15
                      ? "Strong winds detected. Secure loose materials and postpone spraying activities until conditions improve."
                      : "Moderate winds are perfect for spraying pesticides, but secure any loose materials around the farm."}
                  </p>
                </div>

                <div className="p-6 bg-white rounded-xl shadow-sm border border-purple-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">🌾</span>
                    </div>
                    <h4 className="font-semibold text-purple-800 text-lg">
                      {currentWeatherData.humidity > 80 ? "High Humidity Alert" : "Harvest Ready"}
                    </h4>
                  </div>
                  <p className="text-purple-700 leading-relaxed">
                    {currentWeatherData.humidity > 80
                      ? "High humidity levels may promote fungal diseases. Ensure good air circulation and monitor crops closely."
                      : "Clear skies and low humidity make this an ideal time for harvesting mature crops."}
                  </p>
                </div>

                <div className="p-6 bg-white rounded-xl shadow-sm border border-orange-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">🚜</span>
                    </div>
                    <h4 className="font-semibold text-orange-800 text-lg">Equipment Maintenance</h4>
                  </div>
                  <p className="text-orange-700 leading-relaxed">
                    {currentWeatherData.condition.includes("Rain")
                      ? "Rainy conditions are perfect for indoor equipment maintenance and planning activities."
                      : "Good weather for outdoor equipment maintenance and repairs. Check irrigation systems while conditions are dry."}
                  </p>
                </div>

                <div className="p-6 bg-white rounded-xl shadow-sm border border-emerald-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center">
                      <span className="text-xl">🌱</span>
                    </div>
                    <h4 className="font-semibold text-emerald-800 text-lg">Soil Preparation</h4>
                  </div>
                  <p className="text-emerald-700 leading-relaxed">
                    {currentWeatherData.rainfall > 2
                      ? "Recent rainfall has moistened the soil. Wait for proper drainage before heavy tillage operations."
                      : "Perfect conditions for tilling and soil preparation. Consider adding organic matter to improve soil structure."}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="text-center py-8 border-t border-green-200 bg-white/50 rounded-lg">
          <p className="text-muted-foreground">
            Weather data updates automatically every hour • Last updated: {lastUpdated.toLocaleString()}
          </p>
        </div>
      </div>
    </div>
  )
}