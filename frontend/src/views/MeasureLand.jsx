"use client"

import { useState, useEffect } from "react"
import { Button } from "../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import {
  Wheat,
  Compass,
  History,
  TrendingUp,
  MapPin,
  Ruler,
  Sprout,
  BarChart3,
  Calendar,
  Loader2,
  AlertTriangle,
  Plus,
  Eye,
  Layers,
  Target,
} from "lucide-react"
import { getLands } from "../api"

// Helper to format land type label (aligned with LandMeasurement landTypes)
const formatLandType = (landType) => {
  const landTypeOptions = {
    "Lowland Rainfed": "Lowland Rainfed",
    "Irrigated Paddy Field": "Irrigated Paddy Field",
    // Add more mappings as needed for display purposes
  }
  return landTypeOptions[landType] || landType || "Not specified"
}

// Helper to format fertilizer_total JSON into a readable string (in kilograms)
const formatFertilizer = (fertilizerTotal) => {
  try {
    if (!fertilizerTotal || typeof fertilizerTotal !== "object" || Array.isArray(fertilizerTotal)) {
      return "Not specified"
    }
    let parsedFertilizer = fertilizerTotal
    if (typeof fertilizerTotal === "string") {
      parsedFertilizer = JSON.parse(fertilizerTotal)
    }
    if (!parsedFertilizer || typeof parsedFertilizer !== "object") {
      return "Not specified"
    }
    return (
      Object.entries(parsedFertilizer)
        .map(([key, value]) => {
          const numValue = Number.parseFloat(value)
          if (isNaN(numValue)) return null
          // Convert tonnes to kilograms (multiply by 1000) and format to 2 decimal places
          return `${key}: ${(numValue * 1000).toFixed(2)} Kg`
        })
        .filter(Boolean)
        .join(", ") || "Not specified"
    )
  } catch (error) {
    console.error("Error formatting fertilizer_total:", error, { fertilizerTotal })
    return "Error formatting fertilizer"
  }
}

// Helper to safely format data_area_ha
const formatArea = (dataAreaHa) => {
  try {
    if (dataAreaHa == null || typeof dataAreaHa === "object" || Array.isArray(dataAreaHa)) {
      console.warn("Invalid data_area_ha value:", dataAreaHa)
      return "0.00"
    }
    const parsedArea = Number.parseFloat(dataAreaHa)
    return isNaN(parsedArea) ? "0.00" : parsedArea.toFixed(2)
  } catch (error) {
    console.error("Error formatting data_area_ha:", error, { dataAreaHa })
    return "0.00"
  }
}

export default function MeasureLand({ onMeasure, onHistory, language }) {
  const [measurements, setMeasurements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Fetch land data from API on component mount
  useEffect(() => {
    const fetchLands = async () => {
      try {
        setLoading(true)
        const data = await getLands()
        console.log("API response from getLands:", data)
        setMeasurements(Array.isArray(data) ? data : [])
        setLoading(false)
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || "Failed to fetch land data. Please try again later."
        console.error("Error fetching lands:", err.response?.data || err)
        setError(errorMessage)
        setLoading(false)
      }
    }
    fetchLands()
  }, [])

  // Calculate total area, number of fields, and average size
  const totalArea = measurements.reduce((sum, m) => {
    const area = Number.parseFloat(m.data_area_ha)
    if (isNaN(area)) {
      console.warn("Invalid data_area_ha in measurement:", m)
      return sum
    }
    return sum + area
  }, 0)

  const numberOfFields = measurements.length
  const averageSize = numberOfFields > 0 ? (totalArea / numberOfFields).toFixed(2) : "0.00"

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Wheat className="w-8 h-8 text-green-600" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            Measure, track, and manage your agricultural land efficiently
          </h1>
        </div>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Layers className="w-8 h-8 mr-2" />
                <div className="text-xl sm:text-2xl font-bold">{isNaN(totalArea) ? "0.00" : totalArea.toFixed(2)}</div>
              </div>
              <div className="text-green-100 text-sm sm:text-base">Total Land Measured (hectares)</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <Target className="w-8 h-8 mr-2" />
                <div className="text-xl sm:text-2xl font-bold">{numberOfFields}</div>
              </div>
              <div className="text-blue-100 text-sm sm:text-base">Number of Fields</div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="flex items-center justify-center mb-3">
                <BarChart3 className="w-8 h-8 mr-2" />
                <div className="text-xl sm:text-2xl font-bold">{averageSize}</div>
              </div>
              <div className="text-purple-100 text-sm sm:text-base">Average Field Size (ha)</div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Compass className="w-8 h-8 text-green-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Measure My Land</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                Use GPS and interactive maps to accurately measure your land area. Draw boundaries and get precise
                calculations.
              </p>
              <Button
                onClick={onMeasure}
                className="bg-green-600 hover:bg-green-700 w-full text-sm sm:text-base py-2 sm:py-3 shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                Start Measuring
              </Button>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow duration-300">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Measurement History</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                View, edit, and manage all your saved land measurements. Track changes over time and organize your
                fields.
              </p>
              <Button
                onClick={onHistory}
                variant="outline"
                className="w-full text-sm sm:text-base py-2 sm:py-3 border-2 hover:bg-blue-50 bg-transparent"
              >
                <Eye className="w-4 h-4 mr-2" />
                View History
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
            <CardTitle className="text-base sm:text-lg flex items-center">
              <Sprout className="w-5 h-5 mr-2 text-green-600" />
              Recent Measurements
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <p className="text-gray-600 text-sm sm:text-base">Loading measurements...</p>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertTriangle className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-red-600 text-sm sm:text-base">{error}</p>
              </div>
            ) : measurements.length === 0 ? (
              <div className="text-center py-8">
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Ruler className="w-8 h-8 text-gray-400" />
                </div>
                <p className="text-gray-600 text-sm sm:text-base">
                  No measurements available. Start measuring your land!
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {measurements.map((measurement) => (
                  <div
                    key={measurement.id}
                    className="bg-white p-4 rounded-lg border border-gray-200 flex justify-between items-center hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                  >
                    <div className="flex items-center">
                      <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center mr-3">
                        <MapPin className="w-5 h-5 text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{measurement.name || "Unnamed Field"}</p>
                        <div className="flex items-center text-xs text-gray-600">
                          <Ruler className="w-3 h-3 mr-1" />
                          {measurement.data_area_ha} hectares
                          <Calendar className="w-3 h-3 ml-3 mr-1" />
                          {measurement.date ? measurement.date.slice(0, 10) : "N/A"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {measurement.data_area_ha} ha
                      </span>
                      <TrendingUp className="w-4 h-4 text-green-600 ml-2" />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
