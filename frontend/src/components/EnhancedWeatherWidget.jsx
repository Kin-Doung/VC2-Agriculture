"use client"

import { useEffect, useState } from "react"
import CambodiaLocationSelector from "./CambodiaLocationSelector"

const API_KEY = "f20a808612250d10cfeb495115efb768"

const WeatherDetailPage = ({ weather, forecast, location, onBack, language }) => {
  const translations = {
    en: {
      backToMain: "← Back to Dashboard",
      weatherDetails: "Weather Details",
      hourlyForecast: "Hourly Forecast",
      weeklyForecast: "Weekly Forecast",
      temperature: "Temperature",
      feelsLike: "Feels Like",
      humidity: "Humidity",
      pressure: "Pressure",
      visibility: "Visibility",
      uvIndex: "UV Index",
      sunrise: "Sunrise",
      sunset: "Sunset",
      wind: "Wind",
      rainfall: "Rainfall",
      today: "Today",
      tomorrow: "Tomorrow",
    },
    km: {
      backToMain: "← ត្រលប់ទៅផ្ទាំងគ្រប់គ្រង",
      weatherDetails: "ព័ត៌មានលម្អិតអាកាសធាតុ",
      hourlyForecast: "ការព្យាករណ៍ម៉ោង",
      weeklyForecast: "ការព្យាករណ៍សប្តាហ៍",
      temperature: "សីតុណ្ហភាព",
      feelsLike: "ដូចជា",
      humidity: "សំណើម",
      pressure: "សម្ពាធ",
      visibility: "ភាពមើលឃើញ",
      uvIndex: "សន្ទស្សន៍ UV",
      sunrise: "ពេលថ្ងៃរះ",
      sunset: "ពេលថ្ងៃលិច",
      wind: "ខ្យល់",
      rainfall: "ទឹកភ្លៀង",
      today: "ថ្ងៃនេះ",
      tomorrow: "ថ្ងៃស្អែក",
    },
  }

  const t = translations[language] || translations.en

  const getWeatherIcon = (weatherCode) => {
    const iconMap = {
      "01d": "☀️",
      "01n": "🌙",
      "02d": "⛅",
      "02n": "☁️",
      "03d": "☁️",
      "03n": "☁️",
      "04d": "☁️",
      "04n": "☁️",
      "09d": "🌧️",
      "09n": "🌧️",
      "10d": "🌦️",
      "10n": "🌧️",
      "11d": "⛈️",
      "11n": "⛈️",
      "13d": "❄️",
      "13n": "❄️",
      "50d": "🌫️",
      "50n": "🌫️",
    }
    return iconMap[weatherCode] || "☁️"
  }

  const hourlyData = forecast
    ? forecast.list.slice(0, 12).map((item) => ({
        time: new Date(item.dt * 1000).toLocaleTimeString("en-US", {
          hour: "numeric",
          hour12: true,
        }),
        temp: Math.round(item.main.temp),
        icon: getWeatherIcon(item.weather[0].icon),
        description: item.weather[0].description,
      }))
    : []

  const dailyData = forecast
    ? forecast.list
        .filter((item, index) => index % 8 === 0)
        .slice(0, 7)
        .map((item) => ({
          day: new Date(item.dt * 1000).toLocaleDateString("en-US", { weekday: "short" }),
          high: Math.round(item.main.temp_max),
          low: Math.round(item.main.temp_min),
          icon: getWeatherIcon(item.weather[0].icon),
          description: item.weather[0].description,
        }))
    : []

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #4f9cf9 0%, #1e40af 100%)",
        color: "white",
        padding: "20px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          marginBottom: "30px",
        }}
      >
        <button
          onClick={onBack}
          style={{
            backgroundColor: "rgba(255,255,255,0.2)",
            border: "none",
            color: "white",
            padding: "10px 20px",
            borderRadius: "25px",
            cursor: "pointer",
            fontSize: "16px",
          }}
        >
          {t.backToMain}
        </button>
      </div>

      {/* Main Weather Info */}
      <div
        style={{
          textAlign: "center",
          marginBottom: "40px",
        }}
      >
        <h1
          style={{
            fontSize: "48px",
            margin: "0 0 10px 0",
            fontWeight: "bold",
          }}
        >
          {Math.round(weather.main.temp)}°C
        </h1>
        <h2
          style={{
            fontSize: "24px",
            margin: "0 0 10px 0",
            fontWeight: "normal",
            opacity: 0.9,
          }}
        >
          {location}
        </h2>
        <p
          style={{
            fontSize: "18px",
            margin: 0,
            opacity: 0.8,
            textTransform: "capitalize",
          }}
        >
          {weather.weather[0].description}
        </p>
      </div>

      {/* Weather Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
          gap: "20px",
          marginBottom: "40px",
        }}
      >
        {[
          { label: t.feelsLike, value: `${Math.round(weather.main.feels_like)}°C`, icon: "🌡️" },
          { label: t.humidity, value: `${weather.main.humidity}%`, icon: "💧" },
          { label: t.wind, value: `${Math.round(weather.wind?.speed * 3.6 || 0)} km/h`, icon: "💨" },
          { label: t.pressure, value: `${weather.main.pressure} hPa`, icon: "📊" },
          { label: t.visibility, value: `${(weather.visibility / 1000).toFixed(1)} km`, icon: "👁️" },
          { label: t.rainfall, value: `${weather.rain ? Math.round(weather.rain["1h"] || 0) : 0}mm`, icon: "☔" },
        ].map((stat, index) => (
          <div
            key={index}
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              padding: "20px",
              borderRadius: "15px",
              textAlign: "center",
            }}
          >
            <div style={{ fontSize: "24px", marginBottom: "10px" }}>{stat.icon}</div>
            <div style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "5px" }}>{stat.value}</div>
            <div style={{ fontSize: "14px", opacity: 0.8 }}>{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Hourly Forecast */}
      <div style={{ marginBottom: "40px" }}>
        <h3
          style={{
            fontSize: "20px",
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          {t.hourlyForecast}
        </h3>
        <div
          style={{
            display: "flex",
            overflowX: "auto",
            gap: "15px",
            padding: "10px 0",
          }}
        >
          {hourlyData.map((hour, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                padding: "15px",
                borderRadius: "12px",
                textAlign: "center",
                minWidth: "80px",
                flexShrink: 0,
              }}
            >
              <div style={{ fontSize: "12px", marginBottom: "8px", opacity: 0.8 }}>{hour.time}</div>
              <div style={{ fontSize: "24px", marginBottom: "8px" }}>{hour.icon}</div>
              <div style={{ fontSize: "16px", fontWeight: "bold" }}>{hour.temp}°</div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Forecast */}
      <div>
        <h3
          style={{
            fontSize: "20px",
            marginBottom: "20px",
            fontWeight: "bold",
          }}
        >
          {t.weeklyForecast}
        </h3>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          }}
        >
          {dailyData.map((day, index) => (
            <div
              key={index}
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                padding: "15px 20px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                <div style={{ fontSize: "24px" }}>{day.icon}</div>
                <div>
                  <div style={{ fontSize: "16px", fontWeight: "bold" }}>
                    {index === 0 ? t.today : index === 1 ? t.tomorrow : day.day}
                  </div>
                  <div style={{ fontSize: "14px", opacity: 0.8, textTransform: "capitalize" }}>{day.description}</div>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <span style={{ fontSize: "18px", fontWeight: "bold" }}>{day.high}°</span>
                <span style={{ fontSize: "16px", opacity: 0.7, marginLeft: "8px" }}>{day.low}°</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function EnhancedWeatherWidget({ language }) {
  const [weather, setWeather] = useState(null)
  const [forecast, setForecast] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showDetail, setShowDetail] = useState(false)
  const [currentLocation, setCurrentLocation] = useState("")
  const [searchLocation, setSearchLocation] = useState("")
  const [showLocationSearch, setShowLocationSearch] = useState(false)
  const [showCambodiaSelector, setShowCambodiaSelector] = useState(false)
  const [lastUpdated, setLastUpdated] = useState(null)
  const [autoRefresh, setAutoRefresh] = useState(true)

  const translations = {
    en: {
      todaysWeather: "Today's Weather",
      partlyCloudy: "Partly Cloudy",
      humidity: "Humidity",
      wind: "Wind",
      rainfall: "Rainfall",
      goodDay: "Good day for outdoor farming activities",
      loading: "Loading weather...",
      error: "Unable to load weather data.",
      denied: "Location access denied. Showing Phnom Penh weather.",
      searchLocation: "Search location...",
      changeLocation: "Change Location",
      cambodiaLocations: "Cambodia Locations",
      refreshing: "Updating...",
      refresh: "Refresh",
      lastUpdated: "Last updated",
    },
    km: {
      todaysWeather: "អាកាសធាតុថ្ងៃនេះ",
      partlyCloudy: "មានពពកខ្លះ",
      humidity: "សំណើម",
      wind: "ខ្យល់",
      rainfall: "ទឹកភ្លៀង",
      goodDay: "ថ្ងៃល្អសម្រាប់សកម្មភាពកសិកម្មក្រៅផ្ទះ",
      loading: "កំពុងផ្ទុកទិន្នន័យអាកាសធាតុ...",
      error: "មិនអាចផ្ទុកទិន្នន័យអាកាសធាតាបានទេ។",
      denied: "ការចូលដំណើរការទីតាំងត្រូវបានបដិសេធ។ កំពុងបង្ហាញអាកាសធាតុនៃភ្នំពេញ។",
      searchLocation: "ស្វែងរកទីតាំង...",
      changeLocation: "ផ្លាស់ប្តូរទីតាំង",
      cambodiaLocations: "ទីតាំងកម្ពុជា",
      refreshing: "កំពុងធ្វើបច្ចុប្បន្នភាព...",
      refresh: "ធ្វើបច្ចុប្បន្នភាព",
      lastUpdated: "ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ",
    },
  }

  const t = translations[language] || translations.en

  const fetchWeatherData = async (lat, lon, locationName = "", fallbackMessage = null) => {
    try {
      const currentRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&lang=${language}&appid=${API_KEY}`,
      )

      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=metric&lang=${language}&appid=${API_KEY}`,
      )

      if (!currentRes.ok || !forecastRes.ok) {
        throw new Error(`API Error`)
      }

      const currentData = await currentRes.json()
      const forecastData = await forecastRes.json()

      setWeather(currentData)
      setForecast(forecastData)
      setCurrentLocation(locationName || currentData.name)
      setLastUpdated(new Date())

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

  const searchLocationByName = async (locationName) => {
    try {
      const geocodeRes = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${locationName}&limit=1&appid=${API_KEY}`,
      )

      if (!geocodeRes.ok) {
        throw new Error("Location not found")
      }

      const geocodeData = await geocodeRes.json()

      if (geocodeData.length > 0) {
        const { lat, lon, name, country } = geocodeData[0]
        await fetchWeatherData(lat, lon, `${name}, ${country}`)
        setShowLocationSearch(false)
        setSearchLocation("")
      } else {
        throw new Error("Location not found")
      }
    } catch (err) {
      console.error("Location search error:", err)
      setError(`Location "${locationName}" not found`)
    }
  }

  const handleLocationSelect = (location) => {
    const locationName = language === "km" ? location.nameKm : location.name
    const provinceName = language === "km" ? location.provinceKm : location.province
    fetchWeatherData(location.lat, location.lon, `${locationName}, ${provinceName}`)
    setShowCambodiaSelector(false)
  }

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        fetchWeatherData(latitude, longitude)
      },
      () => {
        fetchWeatherData(11.5564, 104.9282, "Phnom Penh, Cambodia", t.denied)
      },
    )
  }, [language])

  // Auto-refresh weather data every hour
  useEffect(() => {
    if (!autoRefresh) return
    const interval = setInterval(() => {
      if (navigator.geolocation && !searchLocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords
            fetchWeatherData(latitude, longitude)
          },
          () => {
            fetchWeatherData(11.5564, 104.9282, "Phnom Penh, Cambodia")
          },
        )
      }
    }, 3600000) // 1 hour = 3600000ms

    return () => clearInterval(interval)
  }, [autoRefresh, searchLocation])

  const handleManualRefresh = () => {
    setLoading(true)
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords
          fetchWeatherData(latitude, longitude)
        },
        () => {
          fetchWeatherData(11.5564, 104.9282, "Phnom Penh, Cambodia")
        },
      )
    }
  }

  if (showDetail && weather && forecast) {
    return (
      <WeatherDetailPage
        weather={weather}
        forecast={forecast}
        location={currentLocation}
        onBack={() => setShowDetail(false)}
        language={language}
      />
    )
  }

  if (loading) {
    return (
      <div
        style={{
          background: "linear-gradient(135deg, #4f9cf9 0%, #1e40af 100%)",
          padding: "24px",
          borderRadius: "16px",
          marginBottom: "24px",
          color: "white",
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0 }}>{t.loading}</p>
      </div>
    )
  }

  if (!weather) {
    return (
      <div
        style={{
          background: "linear-gradient(135deg, #4f9cf9 0%, #1e40af 100%)",
          padding: "24px",
          borderRadius: "16px",
          marginBottom: "24px",
          color: "white",
          textAlign: "center",
        }}
      >
        <p style={{ margin: 0 }}>{error || t.error}</p>
      </div>
    )
  }

  const currentTemp = Math.round(weather.main.temp)
  const humidity = weather.main.humidity
  const windSpeed = Math.round(weather.wind?.speed * 3.6) || 0
  const rainfall = weather.rain ? Math.round(weather.rain["1h"] || 0) : 0

  return (
    <>
      <div
        onClick={() => setShowDetail(true)}
        style={{
          background: "linear-gradient(135deg, #4f9cf9 0%, #1e40af 100%)",
          padding: "24px",
          borderRadius: "16px",
          marginBottom: "24px",
          color: "white",
          cursor: "pointer",
          position: "relative",
          transition: "transform 0.2s ease",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = "translateY(-2px)"
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = "translateY(0)"
        }}
      >
        {/* Header with location search */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "20px" }}>☀️</span>
            <h3
              style={{
                fontSize: "18px",
                fontWeight: "bold",
                margin: 0,
              }}
            >
              {t.todaysWeather}
            </h3>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <button
              onClick={(e) => {
                e.stopPropagation()
                handleManualRefresh()
              }}
              disabled={loading}
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                border: "none",
                color: "white",
                padding: "8px 12px",
                borderRadius: "20px",
                cursor: loading ? "not-allowed" : "pointer",
                fontSize: "12px",
                opacity: loading ? 0.6 : 1,
              }}
            >
              🔄 {loading ? t.refreshing : t.refresh}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowLocationSearch(!showLocationSearch)
              }}
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                border: "none",
                color: "white",
                padding: "8px 12px",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              📍 {t.changeLocation}
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation()
                setShowCambodiaSelector(true)
              }}
              style={{
                backgroundColor: "rgba(255,255,255,0.2)",
                border: "none",
                color: "white",
                padding: "8px 12px",
                borderRadius: "20px",
                cursor: "pointer",
                fontSize: "12px",
              }}
            >
              🇰🇭 {t.cambodiaLocations}
            </button>
          </div>
        </div>

        {/* Location Search */}
        {showLocationSearch && (
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              padding: "15px",
              borderRadius: "12px",
              marginBottom: "20px",
            }}
          >
            <input
              type="text"
              placeholder={t.searchLocation}
              value={searchLocation}
              onChange={(e) => setSearchLocation(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === "Enter" && searchLocation.trim()) {
                  searchLocationByName(searchLocation.trim())
                }
              }}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "8px",
                border: "none",
                fontSize: "14px",
                backgroundColor: "rgba(255,255,255,0.9)",
                color: "#333",
              }}
            />
          </div>
        )}

        {/* Main content */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: "20px",
          }}
        >
          {/* Left side - Temperature and location */}
          <div>
            <h1
              style={{
                fontSize: "48px",
                fontWeight: "bold",
                margin: "0 0 5px 0",
                lineHeight: 1,
              }}
            >
              {currentTemp}°C
            </h1>
            <p
              style={{
                fontSize: "16px",
                margin: "0 0 5px 0",
                opacity: 0.9,
                textTransform: "capitalize",
              }}
            >
              {weather.weather[0].description}
            </p>
            <p
              style={{
                fontSize: "14px",
                margin: 0,
                opacity: 0.8,
              }}
            >
              {currentLocation}
            </p>
          </div>
          {/* Right side - Cloud icon */}
          <div
            style={{
              fontSize: "80px",
              opacity: 0.3,
            }}
          >
            ☁️
          </div>
        </div>

        {/* Weather stats */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginBottom: "20px",
            gap: "20px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>💧</span>
            <div>
              <div style={{ fontSize: "12px", opacity: 0.8 }}>{t.humidity}</div>
              <div style={{ fontSize: "14px", fontWeight: "bold" }}>{humidity}%</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>💨</span>
            <div>
              <div style={{ fontSize: "12px", opacity: 0.8 }}>{t.wind}</div>
              <div style={{ fontSize: "14px", fontWeight: "bold" }}>{windSpeed} km/h</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "16px" }}>☔</span>
            <div>
              <div style={{ fontSize: "12px", opacity: 0.8 }}>{t.rainfall}</div>
              <div style={{ fontSize: "14px", fontWeight: "bold" }}>{rainfall}mm</div>
            </div>
          </div>
        </div>

        {/* Bottom message */}
        <div
          style={{
            backgroundColor: "rgba(255,255,255,0.15)",
            padding: "12px",
            borderRadius: "8px",
            fontSize: "14px",
            textAlign: "center",
            opacity: 0.9,
          }}
        >
          <div>{t.goodDay}</div>
          {lastUpdated && (
            <div style={{ fontSize: "12px", marginTop: "4px", opacity: 0.7 }}>
              {t.lastUpdated}: {lastUpdated.toLocaleTimeString()}
            </div>
          )}
        </div>

        {/* Click indicator */}
        <div
          style={{
            position: "absolute",
            bottom: "8px",
            right: "12px",
            fontSize: "12px",
            opacity: 0.6,
          }}
        >
          Click for details →
        </div>
      </div>

      {/* Cambodia Location Selector Modal */}
      {showCambodiaSelector && (
        <CambodiaLocationSelector
          onLocationSelect={handleLocationSelect}
          onClose={() => setShowCambodiaSelector(false)}
          language={language}
          currentLocation={currentLocation}
        />
      )}
    </>
  )
}
