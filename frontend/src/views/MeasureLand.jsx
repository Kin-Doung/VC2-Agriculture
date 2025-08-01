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

// Translation object
const translations = {
  en: {
    title: "Measure, track, and manage your agricultural land efficiently",
    totalLandMeasured: "Total Land Measured (hectares)",
    numberOfFields: "Number of Fields",
    averageFieldSize: "Average Field Size (ha)",
    measureMyLand: "Measure My Land",
    measureMyLandDescription:
      "Use GPS and interactive maps to accurately measure your land area. Draw boundaries and get precise calculations.",
    startMeasuring: "Start Measuring",
    measurementHistory: "Measurement History",
    measurementHistoryDescription:
      "View, edit, and manage all your saved land measurements. Track changes over time and organize your fields.",
    viewHistory: "View History",
    recentMeasurements: "Recent Measurements",
    loadingMeasurements: "Loading measurements...",
    noMeasurements: "No measurements available. Start measuring your land!",
    unnamedField: "Unnamed Field",
    hectares: "hectares",
    errorLoading: "Failed to fetch land data. Please try again later.",
    notSpecified: "Not specified",
    errorFormattingFertilizer: "Error formatting fertilizer",
  },
  km: {
    title: "វាស់ តាមដាន និងគ្រប់គ្រងដីកសិកម្មរបស់អ្នកប្រកបដោយប្រសិទ្ធភាព",
    totalLandMeasured: "ផ្ទៃដីសរុបដែលបានវាស់ (ហិកតា)",
    numberOfFields: "ចំនួនវាល",
    averageFieldSize: "ទំហំវាលជាមធ្យម (ហិកតា)",
    measureMyLand: "វាស់ដីរបស់ខ្ញុំ",
    measureMyLandDescription:
      "ប្រើ GPS និងផែនទីអន្តរកម្មដើម្បីវាស់ផ្ទៃដីរបស់អ្នកបានត្រឹមត្រូវ។ គូសព្រំប្រទល់ និងទទួលបានការគណនាច្បាស់លាស់។",
    startMeasuring: "ចាប់ផ្តើមវាស់",
    measurementHistory: "ប្រវត្តិនៃការវាស់វែង",
    measurementHistoryDescription:
      "មើល កែសម្រួល និងគ្រប់គ្រងរាល់ការវាស់វែងដីដែលបានរក្សាទុក។ តាមដានការផ្លាស់ប្តូរតាមពេលវេលា និងរៀបចំវាលរបស់អ្នក។",
    viewHistory: "មើលប្រវត្តិ",
    recentMeasurements: "ការវាស់វែងថ្មីៗ",
    loadingMeasurements: "កំពុងផ្ទុកការវាស់វែង...",
    noMeasurements: "គ្មានការវាស់វែងទេ។ ចាប់ផ្តើមវាស់ដីរបស់អ្នក!",
    unnamedField: "វាលគ្មានឈ្មោះ",
    hectares: "ហិកតា",
    errorLoading: "បរាជ័យក្នុងការទាញយកទិន្នន័យដី។ សូមព្យាយាមម្តងទៀតនៅពេលក្រោយ។",
    notSpecified: "មិនបានបញ្ជាក់",
    errorFormattingFertilizer: "កំហុសក្នុងការធ្វើទ្រង់ទ្រាយជី",
  },
};

// Helper to format land type label (aligned with LandMeasurement landTypes)
const formatLandType = (landType, language) => {
  const landTypeOptions = {
    en: {
      "Lowland Rainfed": "Lowland Rainfed",
      "Irrigated Paddy Field": "Irrigated Paddy Field",
    },
    km: {
      "Lowland Rainfed": "ដីទំនាបពឹងផ្អែកលើទឹកភ្លៀង",
      "Irrigated Paddy Field": "វាលស្រែប្រព័ន្ធធារាសាស្ត្រ",
    },
  };
  return landTypeOptions[language][landType] || landType || translations[language].notSpecified;
};

// Helper to format fertilizer_total JSON into a readable string (in kilograms)
const formatFertilizer = (fertilizerTotal, language) => {
  try {
    if (!fertilizerTotal || typeof fertilizerTotal !== "object" || Array.isArray(fertilizerTotal)) {
      return translations[language].notSpecified;
    }
    let parsedFertilizer = fertilizerTotal;
    if (typeof fertilizerTotal === "string") {
      parsedFertilizer = JSON.parse(fertilizerTotal);
    }
    if (!parsedFertilizer || typeof parsedFertilizer !== "object") {
      return translations[language].notSpecified;
    }
    return (
      Object.entries(parsedFertilizer)
        .map(([key, value]) => {
          const numValue = Number.parseFloat(value);
          if (isNaN(numValue)) return null;
          return `${key}: ${(numValue * 1000).toFixed(2)} Kg`;
        })
        .filter(Boolean)
        .join(", ") || translations[language].notSpecified
    );
  } catch (error) {
    console.error("Error formatting fertilizer_total:", error, { fertilizerTotal });
    return translations[language].errorFormattingFertilizer;
  }
};

// Helper to safely format data_area_ha
const formatArea = (dataAreaHa) => {
  try {
    if (dataAreaHa == null || typeof dataAreaHa === "object" || Array.isArray(dataAreaHa)) {
      console.warn("Invalid data_area_ha value:", dataAreaHa);
      return "0.00";
    }
    const parsedArea = Number.parseFloat(dataAreaHa);
    return isNaN(parsedArea) ? "0.00" : parsedArea.toFixed(2);
  } catch (error) {
    console.error("Error formatting data_area_ha:", error, { dataAreaHa });
    return "0.00";
  }
};

export default function MeasureLand({ onMeasure, onHistory, language }) {
  const [measurements, setMeasurements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch land data from API on component mount
  useEffect(() => {
    const fetchLands = async () => {
      try {
        setLoading(true);
        const data = await getLands();
        console.log("API response from getLands:", data);
        setMeasurements(Array.isArray(data) ? data : []);
        setLoading(false);
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || err.message || translations[language].errorLoading;
        console.error("Error fetching lands:", err.response?.data || err);
        setError(errorMessage);
        setLoading(false);
      }
    };
    fetchLands();
  }, [language]);

  // Calculate total area, number of fields, and average size
  const totalArea = measurements.reduce((sum, m) => {
    const area = Number.parseFloat(m.data_area_ha);
    if (isNaN(area)) {
      console.warn("Invalid data_area_ha in measurement:", m);
      return sum;
    }
    return sum + area;
  }, 0);

  const numberOfFields = measurements.length;
  const averageSize = numberOfFields > 0 ? (totalArea / numberOfFields).toFixed(2) : "0.00";

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4 sm:p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <Wheat className="w-8 h-8 text-green-600" />
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
            {translations[language].title}
          </h1>
        </div>

        <div className="grid md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">{translations[language].totalLandMeasured}</div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {isNaN(totalArea) ? "0.00" : totalArea.toFixed(2)}
                  </div>
                </div>
                <div className="bg-green-100 p-3 rounded-lg">
                  <Layers className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">{translations[language].numberOfFields}</div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">{numberOfFields}</div>
                </div>
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Target className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-lg border bg-white shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 sm:p-6">
              <div className="flex items-start justify-between">
                <div>
                  <div className="text-sm text-gray-600 mb-1">{translations[language].averageFieldSize}</div>
                  <div className="text-2xl sm:text-3xl font-bold text-gray-900">{averageSize}</div>
                </div>
                <div className="bg-purple-100 p-3 rounded-lg">
                  <BarChart3 className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
          <Card className="rounded-lg bg-card text-card-foreground shadow-2xs hover:shadow-lg transition-shadow border-2 border-green-200">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Compass className="w-8 h-8 text-green-500" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{translations[language].measureMyLand}</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                {translations[language].measureMyLandDescription}
              </p>
              <Button
                onClick={onMeasure}
                className="bg-green-500 hover:bg-green-600 w-full text-sm sm:text-base py-2 sm:py-3 shadow-lg"
              >
                <Plus className="w-4 h-4 mr-2" />
                {translations[language].startMeasuring}
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-lg bg-card text-card-foreground shadow-2xs hover:shadow-lg transition-shadow border-2 border-green-200">
            <CardContent className="p-4 sm:p-6 text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <History className="w-8 h-8 text-blue-600" />
              </div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{translations[language].measurementHistory}</h3>
              <p className="text-gray-600 mb-3 sm:mb-4 text-sm sm:text-base">
                {translations[language].measurementHistoryDescription}
              </p>
              <Button
                onClick={onHistory}
                variant="outline"
                className="w-full text-sm sm:text-base py-2 sm:py-3 border-2 hover:bg-blue-50 bg-transparent"
              >
                <Eye className="w-4 h-4 mr-2" />
                {translations[language].viewHistory}
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100">
            <CardTitle className="text-base sm:text-lg flex items-center">
              <Sprout className="w-5 h-5 mr-2 text-green-600" />
              {translations[language].recentMeasurements}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-4 sm:p-6">
            {loading ? (
              <div className="text-center py-8">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Loader2 className="w-8 h-8 text-blue-600 animate-spin" />
                </div>
                <p className="text-gray-600 text-sm sm:text-base">{translations[language].loadingMeasurements}</p>
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
                <p className="text-gray-600 text-sm sm:text-base">{translations[language].noMeasurements}</p>
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
                        <p className="text-sm font-medium text-gray-900">
                          {measurement.name || translations[language].unnamedField}
                        </p>
                        <div className="flex items-center text-xs text-gray-600">
                          <Ruler className="w-3 h-3 mr-1" />
                          {formatArea(measurement.data_area_ha)} {translations[language].hectares}
                          <Calendar className="w-3 h-3 ml-3 mr-1" />
                          {measurement.date ? measurement.date.slice(0, 10) : "N/A"}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span className="bg-gradient-to-r from-green-100 to-green-200 text-green-800 text-xs font-semibold px-3 py-1 rounded-full">
                        {formatArea(measurement.data_area_ha)} {translations[language].hectares}
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
  );
}