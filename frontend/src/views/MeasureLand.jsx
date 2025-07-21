"use client"

import { MapPin, Ruler, Satellite, Save } from "lucide-react"
import { useState } from "react"

const MeasureLand = ({ language }) => {
  const [isRecording, setIsRecording] = useState(false)
  const [measurements, setMeasurements] = useState([])

  const translations = {
    en: {
      title: "Land Measurement Tool",
      subtitle: "Use GPS to accurately measure your farm land",
      startMeasuring: "Start Measuring",
      stopMeasuring: "Stop Measuring",
      saveArea: "Save Area",
      clearAll: "Clear All",
      currentArea: "Current Area",
      totalPoints: "GPS Points",
      accuracy: "GPS Accuracy",
      recentMeasurements: "Recent Measurements",
      fieldName: "Field Name",
      area: "Area",
      date: "Date",
      noMeasurements: "No measurements yet",
      instructions: "Walk around the perimeter of your land to measure the area",
    },
    km: {
      title: "ឧបករណ៍វាស់ដី",
      subtitle: "ប្រើ GPS ដើម្បីវាស់ដីកសិកម្មរបស់អ្នកឱ្យបានត្រឹមត្រូវ",
      startMeasuring: "ចាប់ផ្តើមវាស់",
      stopMeasuring: "បញ្ឈប់ការវាស់",
      saveArea: "រក្សាទុកតំបន់",
      clearAll: "លុបទាំងអស់",
      currentArea: "ផ្ទៃដីបច្ចុប្បន្ន",
      totalPoints: "ចំណុច GPS",
      accuracy: "ភាពត្រឹមត្រូវ GPS",
      recentMeasurements: "ការវាស់ថ្មីៗ",
      fieldName: "ឈ្មោះស្រែ",
      area: "ផ្ទៃដី",
      date: "កាលបរិច្ឆេទ",
      noMeasurements: "មិនទាន់មានការវាស់នៅឡើយ",
      instructions: "ដើរជុំវិញព្រំដែនដីរបស់អ្នកដើម្បីវាស់ផ្ទៃដី",
    },
  }

  const t = translations[language]

  const handleStartMeasuring = () => {
    setIsRecording(true)
    // In a real app, this would start GPS tracking
  }

  const handleStopMeasuring = () => {
    setIsRecording(false)
    // In a real app, this would stop GPS tracking and calculate area
  }

  const mockMeasurements = [
    { id: 1, name: "Rice Field A", area: "6.2 ha", date: "2024-01-15" },
    { id: 2, name: "Corn Field", area: "4.8 ha", date: "2024-01-10" },
    { id: 3, name: "Vegetable Garden", area: "1.5 ha", date: "2024-01-08" },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-2">{t.title}</h1>
        <p className="text-green-600">{t.subtitle}</p>
      </div>

      {/* Measurement Controls */}
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <div className="text-center mb-6">
          <div className="w-32 h-32 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
            <Satellite className={`h-16 w-16 ${isRecording ? "text-green-600 animate-pulse" : "text-green-400"}`} />
          </div>
          <p className="text-gray-600 mb-4">{t.instructions}</p>
        </div>

        <div className="flex justify-center gap-4 mb-6">
          {!isRecording ? (
            <button
              onClick={handleStartMeasuring}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
            >
              <MapPin className="h-5 w-5" />
              {t.startMeasuring}
            </button>
          ) : (
            <button
              onClick={handleStopMeasuring}
              className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2"
            >
              <MapPin className="h-5 w-5" />
              {t.stopMeasuring}
            </button>
          )}
        </div>

        {/* Current Measurement Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Ruler className="h-8 w-8 mx-auto mb-2 text-green-600" />
            <div className="text-2xl font-bold text-gray-800">2.4 ha</div>
            <div className="text-sm text-gray-600">{t.currentArea}</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <MapPin className="h-8 w-8 mx-auto mb-2 text-blue-600" />
            <div className="text-2xl font-bold text-gray-800">12</div>
            <div className="text-sm text-gray-600">{t.totalPoints}</div>
          </div>
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <Satellite className="h-8 w-8 mx-auto mb-2 text-purple-600" />
            <div className="text-2xl font-bold text-gray-800">±3m</div>
            <div className="text-sm text-gray-600">{t.accuracy}</div>
          </div>
        </div>

        {isRecording && (
          <div className="mt-6 flex justify-center gap-4">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
              <Save className="h-4 w-4" />
              {t.saveArea}
            </button>
            <button className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors">
              {t.clearAll}
            </button>
          </div>
        )}
      </div>

      {/* Recent Measurements */}
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">{t.recentMeasurements}</h2>

        {mockMeasurements.length > 0 ? (
          <div className="space-y-3">
            {mockMeasurements.map((measurement) => (
              <div
                key={measurement.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div>
                  <h3 className="font-semibold text-gray-800">{measurement.name}</h3>
                  <p className="text-sm text-gray-600">{measurement.date}</p>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold text-green-600">{measurement.area}</div>
                  <div className="text-sm text-gray-500">{t.area}</div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-gray-500">
            <Ruler className="h-12 w-12 mx-auto mb-2 text-gray-300" />
            <p>{t.noMeasurements}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MeasureLand
