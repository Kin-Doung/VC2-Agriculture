"use client"

import { useState, useEffect } from "react"
import {
  ArrowLeft,
  Search,
  MapPin,
  Calendar,
  Ruler,
  Trash2,
  ChevronDown,
  AlertCircle,
  Download,
  Eye,
  BarChart3,
  Layers,
  Target,
  TrendingUp,
  Wheat,
  Sprout,
  Leaf,
  Database,
  FileText,
  Activity,
  Globe,
  Zap,
  Package,
  Clock,
  SortAsc,
  SortDesc,
  Map,
  Compass,
  TreePine,
  Droplets,
  CloudRain,
} from "lucide-react"
import { Button } from "../components/ui/Button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/Card"
import { getLands, deleteLand } from "../api"

// Translation object for English and Khmer
const translations = {
  en: {
    backToDashboard: "Back to Dashboard",
    measurementHistory: "Measurement History",
    measurementsCount: "{count} measurement{plural}",
    totalArea: "{area} ha total",
    searchPlaceholder: "Search measurements...",
    sortByDate: "Sort by Date",
    sortByName: "Sort by Name",
    sortByArea: "Sort by Area",
    asc: "Asc",
    desc: "Desc",
    totalFields: "Total Fields",
    totalAreaLabel: "Total Area (ha)",
    averageSize: "Average Size (ha)",
    loadingMeasurements: "Loading measurements...",
    noMeasurementsYet: "No Measurements Yet",
    noResultsFound: "No Results Found",
    startMeasuringPrompt: "Start measuring your land to see your history here.",
    adjustSearchPrompt: "Try adjusting your search terms or filters.",
    startMeasuring: "Start Measuring",
    delete: "Delete",
    viewDetails: "View Details",
    exportCSV: "Export CSV",
    farmlandName: "Farmland Name",
    areaHa: "Area (ha)",
    seedAmount: "Seed Amount (kg)",
    fertilizerAmount: "Fertilizer Amount",
    date: "Date",
    landType: "Land Type",
    recommendedRiceVarieties: "Recommended Rice Varieties:",
    fertilizerPlan: "Fertilizer Plan:",
    deleteConfirm: 'Are you sure you want to delete "{name}"? This action cannot be undone.',
    deleteSuccess: 'Land "{name}" deleted successfully',
    deleteError: "Failed to delete land. Please try again.",
    fetchError: "Failed to fetch land data after multiple attempts. Please check your connection or try again later.",
    noFertilizerData: "No fertilizer data",
    unnamed: "Unnamed",
    points: "{count} points",
    acres: "{acres} acres",
    notSpecified: "Not specified",
    landTypes: [
      { value: "Lowland Rainfed", label: "Lowland Rainfed" },
      { value: "Agricultural", label: "Agricultural" },
    ],
    recommendations: {
      tonle_sap_basin: {
        rice: "High-yield varieties like IR36, IR42, or Phka Romdoul (fragrant, export-quality). Yields >1 ton/ha.",
        fertilizerPlan: [
          "Before planting: 25 kg DAP + 500 kg compost",
          "Tillering stage (20 days): 30 kg urea",
          "Panicle initiation (40–50 days): 25 kg urea + 20 kg MOP",
        ],
      },
      coastal_plains: {
        rice: "Traditional varieties or improved strains like IR36. Yields ~0.8 ton/ha.",
        fertilizerPlan: [
          "Before planting: 20 kg DAP + 400 kg compost",
          "Tillering stage (20 days): 25 kg urea",
          "Panicle initiation (40–50 days): 20 kg urea + 15 kg MOP",
        ],
      },
      highlands: {
        rice: "Floating rice for flood-prone areas. Yields <0.6 ton/ha.",
        fertilizerPlan: [
          "Before planting: 15 kg DAP + 300 kg compost",
          "Tillering stage (20 days): 20 kg urea",
          "Panicle initiation (40–50 days): 15 kg urea + 10 kg MOP",
        ],
      },
      Agricultural: {
        rice: "General-purpose varieties suitable for agricultural land.",
        fertilizerPlan: [
          "Before planting: 20 kg DAP + 500 kg compost",
          "Tillering stage: 25 kg urea",
          "Panicle initiation: 20 kg urea",
        ],
      },
    },
  },
  km: {
    backToDashboard: "ត្រលប់ទៅផ្ទាំងគ្រប់គ្រង",
    measurementHistory: "ប្រវត្តិការវាស់វែង",
    measurementsCount: "{count} ការវាស់វែង{plural}",
    totalArea: "{area} ហិកតាសរុប",
    searchPlaceholder: "ស្វែងរកការវាស់វែង...",
    sortByDate: "តម្រៀបតាមកាលបរិច្ឆេទ",
    sortByName: "តម្រៀបតាមឈ្មោះ",
    sortByArea: "តម្រៀបតាមផ្ទៃដី",
    asc: "ឡើង",
    desc: "ចុះ",
    totalFields: "ចំនួនវាលសរុប",
    totalAreaLabel: "ផ្ទៃដីសរុប (ហិកតា)",
    averageSize: "ទំហំជាមធ្យម (ហិកតា)",
    loadingMeasurements: "កំពុងផ្ទុកការវាស់វែង...",
    noMeasurementsYet: "មិនទាន់មានការវាស់វែង",
    noResultsFound: "រកមិនឃើញលទ្ធផល",
    startMeasuringPrompt: "ចាប់ផ្តើមវាស់ដីរបស់អ្នកដើម្បីមើលប្រវត្តិនៅទីនេះ។",
    adjustSearchPrompt: "ព្យាយាមកែសម្រួលលក្ខខណ្ឌស្វែងរក ឬតម្រង។",
    startMeasuring: "ចាប់ផ្តើមវាស់",
    delete: "លុប",
    viewDetails: "មើលលម្អិត",
    exportCSV: "នាំចេញ CSV",
    farmlandName: "ឈ្មោះកសិដ្ឋាន",
    areaHa: "ផ្ទៃដី (ហិកតា)",
    seedAmount: "បរិមាណគ្រាប់ពូជ (គីឡូក្រាម)",
    fertilizerAmount: "បរិមាណជី",
    date: "កាលបរិច្ឆេទ",
    landType: "ប្រភេទដី",
    recommendedRiceVarieties: "ពូជស្រូវដែលបានណែនាំ:",
    fertilizerPlan: "ផែនការជី:",
    deleteConfirm: 'តើអ្នកប្រាកដទេថាចង់លុប "{name}"? សកម្មភាពនេះមិនអាចត្រឡប់វិញបានទេ។',
    deleteSuccess: 'ដី "{name}" ត្រូវបានលុបដោយជោគជ័យ',
    deleteError: "បរាជ័យក្នុងការលុបដី។ សូមព្យាយាមម្តងទៀត។",
    fetchError: "បរាជ័យក្នុងការទៅយកទិន្នន័យដីបន្ទាប់ពីការព្យាយាមច្រើនដង។ សូមពិនិត្យការតភ្ជាប់របស់អ្នក ឬព្យាយាមម្តងទៀតនៅពេលក្រោយ។",
    noFertilizerData: "គ្មានទិន្នន័យជី",
    unnamed: "គ្មានឈ្មោះ",
    points: "{count} ចំណុច",
    acres: "{acres} អា",
    notSpecified: "មិនបានបញ្ជាក់",
   
    recommendations: {
      tonle_sap_basin: {
        rice: "ពូជទិន្នផលខ្ពស់ដូចជា IR36, IR42, ឬ Phka Romdoul (ក្រអូប, គុណភាពនាំចេញ)។ ទិន្នផល >១ តោន/ហិកតា។",
        fertilizerPlan: [
          "មុនពេលដាំ: ២៥ គីឡូក្រាម DAP + ៥០០ គីឡូក្រាមជីកំប៉ុស្ត",
          "ដំណាក់កាលដុះស្លឹក (២០ ថ្ងៃ): ៣០ គីឡូក្រាម urea",
          "ដំណាក់កាលចេញផ្កា (៤០-៥០ ថ្ងៃ): ២៥ គីឡូក្រាម urea + ២០ គីឡូក្រាម MOP",
        ],
      },
      coastal_plains: {
        rice: "ពូជប្រពៃណី ឬពូជកែលម្អដូចជា IR36។ ទិន្នផល ~០.៨ តោន/ហិកតា។",
        fertilizerPlan: [
          "មុនពេលដាំ: ២០ គីឡូក្រាម DAP + ៤០០ គីឡូក្រាមជីកំប៉ុស្ត",
          "ដំណាក់កាលដុះស្លឹក (២០ ថ្ងៃ): ២៥ គីឡូក្រាម urea",
          "ដំណាក់កាលចេញផ្កា (៤០-៥០ ថ្ងៃ): ២០ គីឡូក្រាម urea + ១៥ គីឡូក្រាម MOP",
        ],
      },
      highlands: {
        rice: "ស្រូវអណ្តែតសម្រាប់តំបន់ងាយជន់លិច។ ទិន្នផល <០.៦ តោន/ហិកតា។",
        fertilizerPlan: [
          "មុនពេលដាំ: ១៥ គីឡូក្រាម DAP + ៣០០ គីឡូក្រាមជីកំប៉ុស្ត",
          "ដំណាក់កាលដុះស្លឹក (២០ ថ្ងៃ): ២០ គីឡូក្រាម urea",
          "ដំណាក់កាលចេញផ្កា (៤០-៥០ ថ្ងៃ): ១៥ គីឡូក្រាម urea + ១០ គីឡូក្រាម MOP",
        ],
      },
      Agricultural: {
        rice: "ពូជគោលបំណងទូទៅសមរម្យសម្រាប់ដីកសិកម្ម។",
        fertilizerPlan: [
          "មុនពេលដាំ: ២០ គីឡូក្រាម DAP + ៥០០ គីឡូក្រាមជីកំប៉ុស្ត",
          "ដំណាក់កាលដុះស្លឹក: ២៥ គីឡូក្រាម urea",
          "ដំណាក់កាលចេញផ្កា: ២០ គីឡូក្រាម urea",
        ],
      },
    },
  },
};

// Comprehensive land type data
const landTypes = [
  { value: "Lowland Rainfed", seedRate: [80, 100], fertilizer: { Urea: 60, DAP: 50 } },
  { value: "Agricultural", seedRate: [80, 100], fertilizer: { Urea: 60, DAP: 50 } },
];

// Estimate seed and fertilizer amounts
const estimateAmounts = (area, landType) => {
  const selectedType = landTypes.find((type) => type.value === landType) || landTypes[0]
  const seedRateMin = selectedType.seedRate[0]
  const seedRateMax = selectedType.seedRate[1]
  const fertilizer = selectedType.fertilizer

  const seedAmountMin = area * seedRateMin
  const seedAmountMax = area * seedRateMax
  const fertilizerTotal = {}

  for (const [key, value] of Object.entries(fertilizer)) {
    fertilizerTotal[key] = area * (value / 1000)
  }

  return {
    seedAmountMin,
    seedAmountMax,
    fertilizerTotal,
  }
}

// Helper function to get land type icon
const getLandTypeIcon = (landType) => {
  switch (landType?.toLowerCase()) {
    case "lowland rainfed":
      return <CloudRain className="w-4 h-4" />
    case "irrigated paddy field":
      return <Droplets className="w-4 h-4" />
    case "agricultural":
      return <Wheat className="w-4 h-4" />
    case "highlands":
      return <TreePine className="w-4 h-4" />
    default:
      return <Leaf className="w-4 h-4" />
  }
}

export default function MeasurementHistoryTranslate({ onBack, onDelete, language }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("date")
  const [sortOrder, setSortOrder] = useState("desc")
  const [expandedDetails, setExpandedDetails] = useState({})
  const [measurements, setMeasurements] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [successMessage, setSuccessMessage] = useState(null)

  // Fetch lands with retry logic
  useEffect(() => {
    const fetchLands = async (retries = 3, delay = 1000) => {
      try {
        setLoading(true)
        const data = await getLands()
        const processedData = Array.isArray(data)
          ? data.map((measurement) => {
              let boundaryPoints = []
              try {
                boundaryPoints =
                  typeof measurement.boundary_points === "string"
                    ? JSON.parse(measurement.boundary_points)
                    : Array.isArray(measurement.boundary_points)
                      ? measurement.boundary_points
                      : []
              } catch (e) {
                console.error(`Error parsing boundary_points for ${measurement.name}:`, e)
                boundaryPoints = []
              }

              const area = Number(measurement.data_area_ha) || 0
              const estimated = !measurement.seed_amount_min || !measurement.fertilizer_total
                ? estimateAmounts(area, measurement.land_type)
                : {}

              return {
                ...measurement,
                id: measurement.id || `temp-${Math.random().toString(36).substr(2, 9)}`, // Ensure unique ID
                area,
                boundary_points: boundaryPoints,
                data_area_acres: Number(measurement.data_area_acres) || area * 2.471,
                seed_amount_min: Number(measurement.seed_amount_min) || estimated.seedAmountMin || 0,
                seed_amount_max: Number(measurement.seed_amount_max) || estimated.seedAmountMax || 0,
                fertilizer_total: measurement.fertilizer_total || estimated.fertilizerTotal || {},
                date: measurement.date || new Date().toISOString().slice(0, 10),
                land_type: measurement.land_type || "Unknown",
              }
            })
          : []

        setMeasurements(processedData)
        setLoading(false)
        setError(null)
      } catch (err) {
        if (retries > 0) {
          console.warn(`Retrying fetchLands, ${retries} attempts left...`)
          await new Promise((resolve) => setTimeout(resolve, delay))
          return fetchLands(retries - 1, delay * 2)
        }
        setError(translations[language].fetchError)
        setLoading(false)
      }
    }

    fetchLands()
  }, [language])

  // Handle delete with refetch
  const handleDelete = async (id, name) => {
    if (window.confirm(translations[language].deleteConfirm.replace("{name}", name || translations[language].unnamed))) {
      try {
        await deleteLand(id, async () => {
          // Refetch lands to update state
          const data = await getLands()
          const processedData = Array.isArray(data)
            ? data.map((measurement) => {
                let boundaryPoints = []
                try {
                  boundaryPoints =
                    typeof measurement.boundary_points === "string"
                      ? JSON.parse(measurement.boundary_points)
                      : Array.isArray(measurement.boundary_points)
                        ? measurement.boundary_points
                        : []
                } catch (e) {
                  console.error(`Error parsing boundary_points for ${measurement.name}:`, e)
                  boundaryPoints = []
                }
                const area = Number(measurement.data_area_ha) || 0
                const estimated = !measurement.seed_amount_min || !measurement.fertilizer_total
                  ? estimateAmounts(area, measurement.land_type)
                  : {}

                return {
                  ...measurement,
                  id: measurement.id || `temp-${Math.random().toString(36).substr(2, 9)}`,
                  area,
                  boundary_points: boundaryPoints,
                  data_area_acres: Number(measurement.data_area_acres) || area * 2.471,
                  seed_amount_min: Number(measurement.seed_amount_min) || estimated.seedAmountMin || 0,
                  seed_amount_max: Number(measurement.seed_amount_max) || estimated.seedAmountMax || 0,
                  fertilizer_total: measurement.fertilizer_total || estimated.fertilizerTotal || {},
                  date: measurement.date || new Date().toISOString().slice(0, 10),
                  land_type: measurement.land_type || "Unknown",
                }
              })
            : []
          setMeasurements(processedData)
        })
        setSuccessMessage(translations[language].deleteSuccess.replace("{name}", name || translations[language].unnamed))
        setError(null)
        setTimeout(() => setSuccessMessage(null), 3000)
        if (onDelete && typeof onDelete === "function") {
          onDelete(id)
        }
      } catch (error) {
        setError(translations[language].deleteError)
        setSuccessMessage(null)
      }
    }
  }

  // Filter and sort measurements
  const filteredMeasurements = measurements
    .filter((measurement) => measurement?.name?.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a, b) => {
      let comparison = 0
      switch (sortBy) {
        case "name":
          comparison = (a.name || "").localeCompare(b.name || "")
          break
        case "area":
          comparison = (a.area || 0) - (b.area || 0)
          break
        case "date":
        default:
          comparison = new Date(a.date || 0) - new Date(b.date || 0)
          break
      }
      return sortOrder === "asc" ? comparison : -comparison
    })

  // Calculate total area
  const totalArea = measurements.reduce((sum, measurement) => {
    const area = Number(measurement.area) || 0
    return sum + area
  }, 0)

  // Enhanced CSV export with more fields
  const exportToCSV = (measurement) => {
    if (!measurement) return

    const headers = [
      translations[language].farmlandName,
      translations[language].areaHa,
      translations[language].acres.replace("{acres}", ""),
      translations[language].landType,
      translations[language].date,
      translations[language].seedAmount,
      translations[language].seedAmount,
      "Fertilizer Urea (kg)",
      "Fertilizer DAP (kg)",
      translations[language].points.replace("{count}", ""),
    ].join(",")

    const fertilizerUrea = measurement.fertilizer_total?.Urea
      ? Math.round(Number(measurement.fertilizer_total.Urea) * 1000)
      : ""
    const fertilizerDAP = measurement.fertilizer_total?.DAP
      ? Math.round(Number(measurement.fertilizer_total.DAP) * 1000)
      : ""

    const boundaryPoints = Array.isArray(measurement.boundary_points)
      ? measurement.boundary_points
          .map((point, index) => `Point ${index + 1}: (${point[0]},${point[1]})`)
          .join("; ")
      : ""

    const row = [
      `"${measurement.name || translations[language].unnamed}"`,
      Number(measurement.area).toFixed(2),
      Number(measurement.data_area_acres).toFixed(2),
      measurement.land_type || translations[language].notSpecified,
      measurement.date || "N/A",
      Math.round(Number(measurement.seed_amount_min) || 0),
      Math.round(Number(measurement.seed_amount_max) || 0),
      fertilizerUrea,
      fertilizerDAP,
      `"${boundaryPoints}"`,
    ].join(",")

    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${row}`
    const link = document.createElement("a")
    link.setAttribute("href", encodeURI(csvContent))
    link.setAttribute("download", `${measurement.name || "measurement"}_details.csv`)
    link.click()
  }

  const toggleDetails = (id) => {
    setExpandedDetails((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <div className="bg-white border-b border-gray-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button onClick={onBack} variant="ghost" size="sm" className="hover:bg-green-50">
              <ArrowLeft className="w-4 h-4" />
              {translations[language].backToDashboard}
            </Button>
            <div className="flex items-center space-x-2">
              <Database className="w-6 h-6 text-green-600" />
              <h1 className="text-2xl font-bold text-gray-900">{translations[language].measurementHistory}</h1>
            </div>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 px-3 py-2 rounded-lg">
            <Activity className="w-4 h-4" />
            <span>
              {translations[language].measurementsCount
                .replace("{count}", filteredMeasurements.length)
                .replace("{plural}", filteredMeasurements.length !== 1 ? "s" : "")} •{" "}
              {translations[language].totalArea.replace("{area}", isNaN(totalArea) ? "0.00" : totalArea.toFixed(2))}
            </span>
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="max-w-6xl mx-auto">
          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 text-green-800 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {successMessage}
            </div>
          )}
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-100 text-red-800 rounded-lg flex items-center">
              <AlertCircle className="w-5 h-5 mr-2" />
              {error}
            </div>
          )}
          <div className="mb-6 flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder={translations[language].searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white shadow-sm appearance-none"
                >
                  <option value="date">{translations[language].sortByDate}</option>
                  <option value="name">{translations[language].sortByName}</option>
                  <option value="area">{translations[language].sortByArea}</option>
                </select>
              </div>
              <Button
                onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                variant="outline"
                size="sm"
                className="shadow-sm hover:bg-green-50"
              >
                {sortOrder === "asc" ? <SortAsc className="w-4 h-4 mr-1" /> : <SortDesc className="w-4 h-4 mr-1" />}
                {translations[language][sortOrder === "asc" ? "asc" : "desc"]}
              </Button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600 text-white">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Target className="w-8 h-8 mr-2" />
                  <div className="text-2xl font-bold">{filteredMeasurements.length}</div>
                </div>
                <div className="text-blue-100">{translations[language].totalFields}</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600 text-white">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Layers className="w-8 h-8 mr-2" />
                  <div className="text-2xl font-bold">{isNaN(totalArea) ? "0.00" : totalArea.toFixed(2)}</div>
                </div>
                <div className="text-green-100">{translations[language].totalAreaLabel}</div>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600 text-white">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <BarChart3 className="w-8 h-8 mr-2" />
                  <div className="text-2xl font-bold">
                    {filteredMeasurements.length > 0 && !isNaN(totalArea)
                      ? (totalArea / filteredMeasurements.length).toFixed(2)
                      : "0.00"}
                  </div>
                </div>
                <div className="text-purple-100">{translations[language].averageSize}</div>
              </CardContent>
            </Card>
          </div>

          {loading ? (
            <Card className="text-center py-12 border-0 shadow-lg">
              <CardContent>
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Activity className="w-8 h-8 text-blue-600 animate-pulse" />
                </div>
                <p className="text-gray-600">{translations[language].loadingMeasurements}</p>
              </CardContent>
            </Card>
          ) : error ? (
            <Card className="text-center py-12 border-0 shadow-lg">
              <CardContent>
                <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-8 h-8 text-red-600" />
                </div>
                <p className="text-red-600 flex items-center justify-center">{error}</p>
              </CardContent>
            </Card>
          ) : filteredMeasurements.length === 0 ? (
            <Card className="text-center py-12 border-0 shadow-lg">
              <CardContent>
                <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Map className="w-8 h-8 text-gray-400" />
                </div>
                <CardHeader>
                  <CardTitle>
                    {measurements.length === 0 ? translations[language].noMeasurementsYet : translations[language].noResultsFound}
                  </CardTitle>
                </CardHeader>
                <p className="text-gray-600 mb-6">
                  {measurements.length === 0
                    ? translations[language].startMeasuringPrompt
                    : translations[language].adjustSearchPrompt}
                </p>
                {measurements.length === 0 && (
                  <Button onClick={onBack} className="bg-green-600 hover:bg-green-700 shadow-lg">
                    <Compass className="w-4 h-4 mr-2" />
                    {translations[language].startMeasuring}
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            <>
              {filteredMeasurements.map((measurement) => (
                <div key={measurement.id} className="border-0 shadow-lg mb-6 rounded-lg overflow-hidden bg-white">
                  <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 flex items-center justify-between border-b">
                    <div className="flex items-center space-x-3">
                      <div className="bg-white p-2 rounded-full shadow-sm">
                        <Sprout className="w-5 h-5 text-green-600" />
                      </div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium flex items-center">
                          <Wheat className="w-3 h-3 mr-1" />
                          {measurement.name || translations[language].unnamed} ({Number(measurement.area).toFixed(2)} ha)
                        </span>
                        <span className="text-gray-600 text-sm flex items-center">
                          <Calendar className="w-3 h-3 mr-1" />
                          {measurement.date ? measurement.date.slice(0, 10) : "N/A"}
                        </span>
                        <span className="text-gray-600 text-sm flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {translations[language].points.replace("{count}", measurement.boundary_points.length)}
                        </span>
                        <span className="text-gray-600 text-sm flex items-center">
                          <Ruler className="w-3 h-3 mr-1" />
                          {translations[language].acres.replace("{acres}", Number(measurement.data_area_acres).toFixed(2))}
                        </span>
                        <span className="text-gray-600 text-sm flex items-center">
                          {getLandTypeIcon(measurement.land_type)}
                          <span className="ml-1">
                            {translations[language].landTypes.find(lt => lt.value === measurement.land_type)?.label || translations[language].notSpecified}
                          </span>
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button
                        onClick={() => handleDelete(measurement.id, measurement.name)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                      >
                        <Trash2 className="w-4 h-4 mr-1" />
                        {translations[language].delete}
                      </Button>
                    </div>
                  </div>

                  <div className="p-4 bg-gray-50 flex items-center justify-between">
                    <Button
                      onClick={() => toggleDetails(measurement.id)}
                      variant="ghost"
                      size="sm"
                      className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      {translations[language].viewDetails}
                      <ChevronDown
                        className={`w-4 h-4 ml-1 transition-transform ${expandedDetails[measurement.id] ? "rotate-180" : ""}`}
                      />
                    </Button>
                    <Button
                      onClick={() => exportToCSV(measurement)}
                      variant="ghost"
                      size="sm"
                      className="text-green-600 hover:text-green-700 hover:bg-green-50 flex items-center"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      {translations[language].exportCSV}
                    </Button>
                  </div>

                  {expandedDetails[measurement.id] && (
                    <div className="p-6 bg-white border-t">
                      <div className="overflow-x-auto">
                        <table className="w-full border-collapse bg-white rounded-lg overflow-hidden shadow-sm">
                          <thead>
                            <tr className="bg-gradient-to-r from-gray-100 to-gray-200">
                              <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700 flex items-center">
                                <FileText className="w-4 h-4 mr-2" />
                                {translations[language].farmlandName}
                              </th>
                              <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">
                                <div className="flex items-center">
                                  <Layers className="w-4 h-4 mr-2" />
                                  {translations[language].areaHa}
                                </div>
                              </th>
                              <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">
                                <div className="flex items-center">
                                  <Package className="w-4 h-4 mr-2" />
                                  {translations[language].seedAmount}
                                </div>
                              </th>
                              <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">
                                <div className="flex items-center">
                                  <Zap className="w-4 h-4 mr-2" />
                                  {translations[language].fertilizerAmount}
                                </div>
                              </th>
                              <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-2" />
                                  {translations[language].date}
                                </div>
                              </th>
                              <th className="border border-gray-300 p-3 text-left font-semibold text-gray-700">
                                <div className="flex items-center">
                                  <Leaf className="w-4 h-4 mr-2" />
                                  {translations[language].landType}
                                </div>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <tr className="hover:bg-gray-50 transition-colors">
                              <td className="border border-gray-300 p-3">{measurement.name || translations[language].unnamed}</td>
                              <td className="border border-gray-300 p-3 font-medium text-green-600">
                                {Number(measurement.area).toFixed(2)}
                              </td>
                              <td className="border border-gray-300 p-3">
                                <div className="flex items-center">
                                  <Package className="w-3 h-3 mr-1 text-blue-600" />
                                  {Math.round(Number(measurement.seed_amount_min) || 0)} -{" "}
                                  {Math.round(Number(measurement.seed_amount_max) || 0)} kg
                                </div>
                              </td>
                              <td className="border border-gray-300 p-3">
                                <div className="space-y-1">
                                  {measurement.fertilizer_total
                                    ? Object.entries(measurement.fertilizer_total).map(([key, value]) => (
                                        <div key={key} className="flex items-center text-sm">
                                          <Zap className="w-3 h-3 mr-1 text-yellow-600" />
                                          {key}: {Math.round(Number(value) * 1000)} kg
                                        </div>
                                      ))
                                    : <div className="text-sm">{translations[language].noFertilizerData}</div>}
                                </div>
                              </td>
                              <td className="border border-gray-300 p-3">
                                <div className="flex items-center">
                                  <Calendar className="w-3 h-3 mr-1 text-gray-500" />
                                  {measurement.date ? measurement.date.slice(0, 10) : "N/A"}
                                </div>
                              </td>
                              <td className="border border-gray-300 p-3">
                                <div className="flex items-center">
                                  {getLandTypeIcon(measurement.land_type)}
                                  <span className="ml-1">
                                      {measurement.land_type || translations[language].notSpecified}
                                  </span>
                                </div>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      {measurement.land_type && translations[language].recommendations[measurement.land_type.toLowerCase()] && (
                        <div className="mt-6 p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200">
                          <div className="mb-4">
                            <div className="flex items-center mb-2">
                              <Sprout className="w-5 h-5 mr-2 text-green-600" />
                              <span className="font-semibold text-gray-700">{translations[language].recommendedRiceVarieties}</span>
                            </div>
                            <p className="text-gray-600 ml-7">{translations[language].recommendations[measurement.land_type.toLowerCase()].rice}</p>
                          </div>
                          <div>
                            <div className="flex items-center mb-2">
                              <Zap className="w-5 h-5 mr-2 text-yellow-600" />
                              <span className="font-semibold text-gray-700">{translations[language].fertilizerPlan}</span>
                            </div>
                            <ul className="list-none space-y-1 ml-7">
                              {translations[language].recommendations[measurement.land_type.toLowerCase()].fertilizerPlan.map((step, index) => (
                                <li key={index} className="flex items-start text-gray-600">
                                  <TrendingUp className="w-3 h-3 mr-2 mt-1 text-blue-600 flex-shrink-0" />
                                  {step}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  )
}