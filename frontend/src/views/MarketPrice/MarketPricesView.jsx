"use client"

import { useState, useEffect } from "react"
import { debounce } from 'lodash';
import { useNavigate } from "react-router-dom"

// Responsive Chart Component
const SimpleLineChart = ({ data, products, colors }) => {
  const maxValue = Math.max(...data.flatMap((d) => products.map((p) => d[p.key])))
  const minValue = Math.min(...data.flatMap((d) => products.map((p) => d[p.key])))
  const range = maxValue - minValue

  // Responsive chart dimensions
  const getChartDimensions = () => {
    if (typeof window !== "undefined") {
      const width = window.innerWidth
      if (width < 640) return { width: 320, height: 180, padding: 30 } // mobile
      if (width < 768) return { width: 500, height: 200, padding: 35 } // tablet
      if (width < 1024) return { width: 600, height: 220, padding: 40 } // desktop
      return { width: 700, height: 240, padding: 45 } // large desktop
    }
    return { width: 600, height: 200, padding: 40 }
  }

  const { width: chartWidth, height: chartHeight, padding } = getChartDimensions()

  const getY = (value) => {
    return chartHeight - ((value - minValue) / range) * (chartHeight - padding * 2) - padding
  }

  const getX = (index) => {
    return (index / (data.length - 1)) * (chartWidth - padding * 2) + padding
  }

  return (
    <div className="w-full overflow-x-auto">
      <svg
        width={chartWidth}
        height={chartHeight + 80}
        className="w-full min-w-[320px] sm:min-w-[500px] lg:min-w-[600px]"
        viewBox={`0 0 ${chartWidth} ${chartHeight + 80}`}
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Grid lines */}
        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
          const y = chartHeight - ratio * (chartHeight - padding * 2) - padding
          return (
            <g key={ratio}>
              <line
                x1={padding}
                y1={y}
                x2={chartWidth - padding}
                y2={y}
                stroke="#e5f3e5"
                strokeDasharray="2,2"
                className="sm:stroke-dasharray-[3,3]"
              />
              <text
                x={padding - 5}
                y={y + 3}
                fontSize="10"
                fill="#16a34a"
                textAnchor="end"
                className="text-[8px] sm:text-[10px] md:text-[12px]"
              >
                ${Math.round(minValue + range * ratio)}
              </text>
            </g>
          )
        })}

        {/* X-axis labels */}
        {data.map((point, index) => (
          <text
            key={index}
            x={getX(index)}
            y={chartHeight + 15}
            fontSize="10"
            fill="#16a34a"
            textAnchor="middle"
            className="text-[8px] sm:text-[10px] md:text-[12px]"
          >
            {point.date.split(" ")[1] || point.date} {/* Show only day on mobile */}
          </text>
        ))}

        {/* Lines for each product */}
        {products.map((product, productIndex) => {
          const points = data.map((point, index) => `${getX(index)},${getY(point[product.key])}`).join(" ")
          return (
            <g key={product.key}>
              <polyline
                points={points}
                fill="none"
                stroke={colors[productIndex]}
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="sm:stroke-[3px]"
              />
              {/* Data points */}
              {data.map((point, index) => (
                <circle
                  key={index}
                  cx={getX(index)}
                  cy={getY(point[product.key])}
                  r="3"
                  fill={colors[productIndex]}
                  className="hover:r-5 transition-all cursor-pointer sm:r-4"
                >
                  <title>{`${product.name}: $${point[product.key]} (${point.date})`}</title>
                </circle>
              ))}
            </g>
          )
        })}

        {/* Responsive Legend */}
        <g className="hidden sm:block">
          {products.slice(0, 3).map((product, index) => (
            <g key={`legend-${product.key}`}>
              <circle cx={padding + index * 120} cy={chartHeight + 45} r="5" fill={colors[index]} />
              <text
                x={padding + index * 120 + 12}
                y={chartHeight + 49}
                fontSize="11"
                fill="#166534"
                className="text-[10px] sm:text-[11px]"
              >
                {product.name.length > 15 ? product.name.substring(0, 15) + "..." : product.name}
              </text>
            </g>
          ))}
        </g>

        {/* Second row of legend for remaining items */}
        <g className="hidden sm:block">
          {products.slice(3).map((product, index) => (
            <g key={`legend2-${product.key}`}>
              <circle cx={padding + index * 120} cy={chartHeight + 65} r="5" fill={colors[index + 3]} />
              <text
                x={padding + index * 120 + 12}
                y={chartHeight + 69}
                fontSize="11"
                fill="#166534"
                className="text-[10px] sm:text-[11px]"
              >
                {product.name.length > 15 ? product.name.substring(0, 15) + "..." : product.name}
              </text>
            </g>
          ))}
        </g>
      </svg>

      {/* Mobile Legend */}
      <div className="sm:hidden mt-4 grid grid-cols-2 gap-2">
        {products.map((product, index) => (
          <div key={`mobile-legend-${product.key}`} className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[index] }}></div>
            <span className="text-xs text-green-700 truncate">{product.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// Translations
const translations = {
  en: {
    marketPrices: "Market Prices",
    subtitle: "Current rice and paddy prices for local and export markets",
    refreshPrices: "Refresh Prices",
    localPrices: "Local Prices",
    exportPrices: "Export Prices",
    riceVarieties: "Rice Varieties",
    paddyVarieties: "Paddy Varieties",
    riceExportPrices: "Rice Export Prices",
    paddyExportPrices: "Paddy Export Prices",
    localPrice: "Local Price",
    exportPrice: "Export Price",
    lastUpdated: "Last updated",
    priceTrends: "Price Trends - Top 5 Rice Products in Cambodia (Last 7 Days)",
    trendsDescription: "Historical price movements for Cambodia's most traded rice varieties",
    priceAlerts: "Price Alerts",
    alertsDescription: "Set alerts to be notified when prices reach your target levels",
    selectVariety: "Select Variety",
    chooseVariety: "Choose variety...",
    alertPrice: "Alert Price (USD)",
    enterPrice: "Enter price",
    addAlert: "Add Alert",
    activeAlerts: "Active Alerts",
    alertWhen: "Alert when price goes above",
    remove: "Remove",
    perTon: "per ton",
    fragrantRice: "Fragrant Rice (Jasmine)",
    whiteRice: "White Rice (Premium)",
    stickyRice: "Sticky Rice",
    brownRice: "Brown Rice (Organic)",
    wetSeasonPaddy: "Wet Season Paddy",
    drySeasonPaddy: "Dry Season Paddy",
    cambodianJasmine: "Cambodian Jasmine Rice",
    senKraohom: "Sen Kraohom (Red Rice)",
    chanRice: "Chan Rice",
    malice: "Malice Rice",
    aromatic: "Aromatic Rice",
    viewDetails: "View Details",
    priceChange: "Price Change",
    marketShare: "Market Share",
    exportVolume: "Export Volume",
  },
  kh: {
    marketPrices: "តម្លៃទីផ្សារ",
    subtitle: "តម្លៃបាយ និងស្រូវបច្ចុប្បន្នសម្រាប់ទីផ្សារក្នុងស្រុក និងនាំចេញ",
    refreshPrices: "ធ្វើបច្ចុប្បន្នភាពតម្លៃ",
    localPrices: "តម្លៃក្នុងស្រុក",
    exportPrices: "តម្លៃនាំចេញ",
    riceVarieties: "ប្រភេទបាយ",
    paddyVarieties: "ប្រភេទស្រូវ",
    riceExportPrices: "តម្លៃនាំចេញបាយ",
    paddyExportPrices: "តម្លៃនាំចេញស្រូវ",
    localPrice: "តម្លៃក្នុងស្រុក",
    exportPrice: "តម្លៃនាំចេញ",
    lastUpdated: "ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ",
    priceTrends: "និន្នាការតម្លៃ - ផលិតផលបាយ ៥ ប្រភេទកំពូលក្នុងកម្ពុជា (៧ថ្ងៃចុងក្រោយ)",
    trendsDescription: "ការផ្លាស់ប្តូរតម្លៃប្រវត្តិសាស្ត្រសម្រាប់ប្រភេទបាយដែលជួញដូរច្រើនបំផុតរបស់កម្ពុជា",
    priceAlerts: "ការជូនដំណឹងតម្លៃ",
    alertsDescription: "កំណត់ការជូនដំណឹងដើម្បីទទួលបានការជូនដំណឹងនៅពេលតម្លៃដល់កម្រិតគោលដៅរបស់អ្នក",
    selectVariety: "ជ្រើសរើសប្រភេទ",
    chooseVariety: "ជ្រើសរើសប្រភេទ...",
    alertPrice: "តម្លៃជូនដំណឹង (USD)",
    enterPrice: "បញ្ចូលតម្លៃ",
    addAlert: "បន្ថែមការជូនដំណឹង",
    activeAlerts: "ការជូនដំណឹងសកម្ម",
    alertWhen: "ជូនដំណឹងនៅពេលតម្លៃលើសពី",
    remove: "លុបចេញ",
    perTon: "ក្នុងមួយតោន",
    fragrantRice: "បាយក្រអូប (ម្លិះ)",
    whiteRice: "បាយស (ពិសេស)",
    stickyRice: "បាយដំណើប",
    brownRice: "បាយត្នោត (អរីវ៉ែ)",
    wetSeasonPaddy: "ស្រូវរដូវវស្សា",
    drySeasonPaddy: "ស្រូវរដូវប្រាំង",
    cambodianJasmine: "បាយម្លិះកម្ពុជា",
    senKraohom: "សែនក្រហម",
    chanRice: "បាយចាន់",
    malice: "បាយម៉ាលីស",
    aromatic: "បាយក្រអូប",
    viewDetails: "មើលព័ត៌មានលម្អិត",
    priceChange: "ការផ្លាស់ប្តូរតម្លៃ",
    marketShare: "ចំណែកទីផ្សារ",
    exportVolume: "បរិមាណនាំចេញ",
  },
}

// Top 5 Cambodia rice products data
const getTop5Products = (t) => [
  { key: "jasmine", name: t.cambodianJasmine, marketShare: "45%", exportVolume: "2.1M tons" },
  { key: "senKraohom", name: t.senKraohom, marketShare: "18%", exportVolume: "850K tons" },
  { key: "chan", name: t.chanRice, marketShare: "15%", exportVolume: "720K tons" },
  { key: "malice", name: t.malice, marketShare: "12%", exportVolume: "580K tons" },
  { key: "aromatic", name: t.aromatic, marketShare: "10%", exportVolume: "480K tons" },
]

// Enhanced price history data for top 5 Cambodia rice products
const cambodiaPriceHistory = [
  { date: "Jan 8", jasmine: 3200, senKraohom: 3800, chan: 2900, malice: 3100, aromatic: 3400 },
  { date: "Jan 9", jasmine: 3220, senKraohom: 3820, chan: 2920, malice: 3120, aromatic: 3420 },
  { date: "Jan 10", jasmine: 3250, senKraohom: 3850, chan: 2950, malice: 3150, aromatic: 3450 },
  { date: "Jan 11", jasmine: 3230, senKraohom: 3830, chan: 2930, malice: 3130, aromatic: 3430 },
  { date: "Jan 12", jasmine: 3280, senKraohom: 3880, chan: 2980, malice: 3180, aromatic: 3480 },
  { date: "Jan 13", jasmine: 3300, senKraohom: 3900, chan: 3000, malice: 3200, aromatic: 3500 },
  { date: "Jan 14", jasmine: 3320, senKraohom: 3920, chan: 3020, malice: 3220, aromatic: 3520 },
  { date: "Jan 15", jasmine: 3350, senKraohom: 3950, chan: 3050, malice: 3250, aromatic: 3550 },
]

// Chart colors for the 5 products
const chartColors = ["#16a34a", "#059669", "#0d9488", "#0891b2", "#7c3aed"]

// Mock data for rice varieties and prices
const getRiceVarieties = (t) => [
  {
    id: 1,
    name: t.fragrantRice,
    localPrice: 2850,
    exportPrice: 3200,
    unit: t.perTon,
    change: 2.5,
    lastUpdated: "2024-01-15 14:30",
    trend: "up",
  },
  {
    id: 2,
    name: t.whiteRice,
    localPrice: 2400,
    exportPrice: 2800,
    unit: t.perTon,
    change: -1.2,
    lastUpdated: "2024-01-15 14:30",
    trend: "down",
  },
  {
    id: 3,
    name: t.stickyRice,
    localPrice: 3100,
    exportPrice: 3500,
    unit: t.perTon,
    change: 0.8,
    lastUpdated: "2024-01-15 14:30",
    trend: "up",
  },
  {
    id: 4,
    name: t.brownRice,
    localPrice: 3800,
    exportPrice: 4200,
    unit: t.perTon,
    change: 1.5,
    lastUpdated: "2024-01-15 14:30",
    trend: "up",
  },
]

const getPaddyVarieties = (t) => [
  {
    id: 5,
    name: t.wetSeasonPaddy,
    localPrice: 1200,
    exportPrice: 1400,
    unit: t.perTon,
    change: 3.2,
    lastUpdated: "2024-01-15 14:30",
    trend: "up",
  },
  {
    id: 6,
    name: t.drySeasonPaddy,
    localPrice: 1350,
    exportPrice: 1550,
    unit: t.perTon,
    change: -0.5,
    lastUpdated: "2024-01-15 14:30",
    trend: "down",
  },
]

const MarketPricesView = ({ language = "en" }) => {
  const [activeTab, setActiveTab] = useState("local")
  const [alerts, setAlerts] = useState([])
  const [alertPrice, setAlertPrice] = useState("")
  const [selectedVariety, setSelectedVariety] = useState("")
  const [searchTerm, setSearchTerm] = useState("");

  const t = translations[language] || translations.en
  const riceVarieties = getRiceVarieties(t)
  const paddyVarieties = getPaddyVarieties(t)
  const allVarieties = [...riceVarieties, ...paddyVarieties]
  const top5Products = getTop5Products(t)
  const [prices, setPrices] = useState([]);
  const navigate = useNavigate();

  const goToHistory = () => {
    navigate("/prices/history");
  };

  const goToImportingCountries = () => {
    navigate("/prices/importing-countries");
  };

 const fetchMarketPrice = async () => {
    let apiUrl = `https://data.opendevelopmentcambodia.net/api/3/action/datastore_search?resource_id=c9cb123c-a82b-4537-810a-11ed06847eeb&limit=5000`

    try {
      const response = await fetch(apiUrl)
      const data = await response.json()
      if (data.success) {
        let records = data.result.records

        if (searchTerm.trim() !== "") {
          records = records.filter(record =>
            record.commodity?.toLowerCase().includes(searchTerm.toLowerCase())
          )
        }

        setPrices(records.slice(0, 10))
      }
    } catch (error) {
      console.error("Error fetching market prices:", error)
    }
  }

  // ✅ Search debounce
  useEffect(() => {
    const delayDebounce = setTimeout(fetchMarketPrice, 500)
    return () => clearTimeout(delayDebounce)
  }, [searchTerm])

  // ✅ Auto refresh every 1–3 hours
  useEffect(() => {
    fetchMarketPrice() // Load on mount

    const randomInterval =
      Math.floor(Math.random() * (3 - 1 + 1) + 1) * 60 * 60 * 1000

    const intervalId = setInterval(fetchMarketPrice, randomInterval)

    return () => clearInterval(intervalId)
  }, [])

  const formatPrice = (price) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "KHR",
      minimumFractionDigits: 0,
    }).format(price)
  }

  const addPriceAlert = () => {
    if (selectedVariety && alertPrice) {
      const variety = allVarieties.find((v) => v.id.toString() === selectedVariety)
      setAlerts([
        ...alerts,
        {
          id: Date.now(),
          variety: variety.name,
          price: Number.parseFloat(alertPrice),
          type: "above",
        },
      ])
      setAlertPrice("")
      setSelectedVariety("")
    }
  }

  const removeAlert = (alertId) => {
    setAlerts(alerts.filter((a) => a.id !== alertId))
  }

  const PriceCard = ({ variety, showExport = false }) => (
    <div className="bg-white rounded-lg p-3 sm:p-4 lg:p-5 shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200">
      <div className="flex justify-between items-start mb-3 sm:mb-4">
        <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-green-800 flex-1 pr-2 leading-tight">
          {variety.name}
        </h3>
        <span
          className={`flex items-center gap-1 px-1.5 sm:px-2 py-0.5 sm:py-1 rounded text-xs font-medium whitespace-nowrap ${
            variety.trend === "up" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
          }`}
        >
          <span className="text-xs">{variety.trend === "up" ? "↗" : "↘"}</span>
          {variety.change > 0 ? "+" : ""}
          {variety.change}%
        </span>
      </div>
      <div className="space-y-2 sm:space-y-3">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-1.5 sm:gap-2 text-green-600 text-xs sm:text-sm">
            <span className="text-sm sm:text-base">{showExport ? "🌍" : "📍"}</span>
            <span className="truncate">{showExport ? t.exportPrice : t.localPrice}</span>
          </div>
          <div className="text-right">
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-800">
              {formatPrice(showExport ? variety.exportPrice : variety.localPrice)}
            </div>
            <div className="text-xs text-green-600">{variety.unit}</div>
          </div>
        </div>
        <div className="flex items-center gap-1.5 sm:gap-2 text-xs text-green-600">
          <span>📅</span>
          <span className="truncate">
            {t.lastUpdated}: {variety.lastUpdated}
          </span>
        </div>
      </div>
    </div>
  )

  return (
    <div className="p-3 sm:p-4 lg:p-6 bg-green-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 sm:mb-6 gap-3 sm:gap-4">
        <div className="flex-1 w-full lg:w-auto">
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-800 mb-1 sm:mb-2 flex items-center gap-2">
            <span className="text-xl sm:text-2xl lg:text-3xl">💰</span>
            <span className="break-words">{t.marketPrices}</span>
          </h1>
          <p className="text-sm sm:text-base text-green-600 leading-relaxed">{t.subtitle}</p>
        </div>
        <button
          onClick={fetchMarketPrice}
          className="bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          🔄 Refresh Now
        </button>
      </div>

      {/* Tabs */}
      <div className="mb-4 sm:mb-6">
        <div className="flex bg-green-50 rounded-lg p-1 mb-4 sm:mb-6 border border-green-200">
          <button
            className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-md font-medium transition-all duration-200 text-sm sm:text-base ${
              activeTab === "local" ? "bg-green-600 text-white shadow-sm" : "text-green-600 hover:bg-green-100"
            }`}
            onClick={() => setActiveTab("local")}
          >
            <span>📍</span>
            <span className="truncate">{t.localPrices}</span>
          </button>
          <button
            className={`flex-1 flex items-center justify-center gap-1.5 sm:gap-2 px-2 sm:px-4 py-2 sm:py-3 rounded-md font-medium transition-all duration-200 text-sm sm:text-base ${
              activeTab === "export" ? "bg-green-600 text-white shadow-sm" : "text-green-600 hover:bg-green-100"
            }`}
            onClick={() => setActiveTab("export")}
          >
            <span>🌍</span>
            <span className="truncate">{t.exportPrices}</span>
          </button>
        </div>

        <div className="w-full">
          <input
            type="text"
            placeholder="Search product..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full px-3 sm:px-4 py-2 border-2 border-gray-500 text-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-green-400 text-sm sm:text-base"
          />
        </div>

        {/* Tab Content */}
        <div className="min-h-64 sm:min-h-96">
          {activeTab === "local" && (
            <div className="space-y-4 sm:space-y-6">
              {/* Rice Varieties */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-green-800 mb-3 sm:mb-4">{t.riceVarieties}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {prices.map((item, index) => (
                    <PriceCard
                      key={index}
                      variety={{
                        name: item.commodity || "Unknown",
                        trend: item.trend || "up",
                        change: item.change || 0,
                        localPrice: item.price || 0,
                        exportPrice: item.usdprice || 0,
                        unit: item.unit || "KHR/kg",
                        lastUpdated: item.last_updated || "N/A",
                      }}
                    />
                  ))}
                  {prices.length === 0 ? (
                    <p className="col-span-full text-gray-500">No local prices found.</p>
                  ) : null}
                </div>
              </div>

              {/* Paddy Varieties */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-green-800 mb-3 sm:mb-4">{t.paddyVarieties}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {paddyVarieties.map((variety) => (
                    <PriceCard key={variety.id} variety={variety} showExport={false} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === "export" && (
            <div className="space-y-4 sm:space-y-6">
              {/* Export Rice Prices */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-green-800 mb-3 sm:mb-4">{t.riceExportPrices}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {riceVarieties.map((variety) => (
                    <PriceCard key={variety.id} variety={variety} showExport={true} />
                  ))}
                </div>
              </div>

              {/* Export Paddy Prices */}
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-green-800 mb-3 sm:mb-4">{t.paddyExportPrices}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
                  {paddyVarieties.map((variety) => (
                    <PriceCard key={variety.id} variety={variety} showExport={true} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 shadow-sm border border-green-200">
        <div className="mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-2 flex items-center gap-2">
            <span>📰</span>
            <span className="break-words leading-tight">View Products History</span>
          </h3>
          <p className="text-sm sm:text-base text-green-600 mb-3 sm:mb-4 leading-relaxed">
            Historical price movements for Cambodia's products. Updated: 07:16 PM +07, Friday, August 15, 2025.
          </p>

          {/* Flex container for View History and Top Importing Countries */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
            {/* View History Card */}
            <div className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-200 hover:shadow-md transition-all duration-200 flex-1">
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <div className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0 bg-green-500 animate-pulse"></div>
                <h4 className="font-semibold text-green-800 text-xs sm:text-sm leading-tight">View History</h4>
              </div>
              <div className="space-y-2 text-xs text-green-600">
                <h4 className="font-medium text-green-800 text-xs sm:text-sm leading-tight truncate">
                  Malice Rice
                </h4>
                <p className="text-xs text-green-700">Category: Rice</p>
                <p className="text-xs text-green-700">Current Price: reil3500.50 / kg</p>
                <button
                  onClick={goToHistory}
                  className="ml-auto px-2 py-1 text-xs font-medium text-white bg-green-600 rounded hover:bg-green-700 transition-colors"
                >
                  View
                </button>
              </div>
            </div>

            {/* Top Importing Countries Card */}
            <div className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-200 hover:shadow-md transition-all duration-200 flex-1">
              <div>
                <h4 className="font-semibold text-blue-800 text-xs sm:text-sm leading-tight mb-2">Top Importing Countries</h4>
                <ul className="text-xs text-blue-600 space-y-2">
                  <li className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-400 rounded-full"></span> Thailand</span>
                    <span className="font-medium text-blue-800 text-xs">500K tons</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-400 rounded-full"></span> Vietnam</span>
                    <span className="font-medium text-blue-800 text-xs">420K tons</span>
                  </li>
                  <li className="flex justify-between items-center">
                    <span className="flex items-center gap-1"><span className="w-2 h-2 bg-blue-400 rounded-full"></span> China</span>
                    <span className="font-medium text-blue-800 text-xs">350K tons</span>
                  </li>
                </ul>
              </div>
              <button
                onClick={goToImportingCountries}
                className="mt-3 px-2 py-1 text-xs font-medium text-white bg-blue-600 rounded hover:bg-blue-700 transition-colors transform hover:scale-105"
              >
                View Details
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Price Trends with Responsive Chart */}
      <div className="bg-white rounded-lg p-3 sm:p-4 lg:p-6 mb-4 sm:mb-6 shadow-sm border border-green-200">
        <div className="mb-4 sm:mb-6">
          <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-2 flex items-center gap-2">
            <span>📈</span>
            <span className="break-words leading-tight">{t.priceTrends}</span>
          </h3>
          <p className="text-sm sm:text-base text-green-600 mb-3 sm:mb-4 leading-relaxed">{t.trendsDescription}</p>

          {/* Top 5 Products Summary Cards - Responsive Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 sm:gap-4 mb-4 sm:mb-6">
            {top5Products.map((product, index) => (
              <div key={product.key} className="bg-green-50 rounded-lg p-3 sm:p-4 border border-green-200">
                <div className="flex items-center gap-2 mb-2 sm:mb-3">
                  <div
                    className="w-3 h-3 sm:w-4 sm:h-4 rounded-full flex-shrink-0"
                    style={{ backgroundColor: chartColors[index] }}
                  ></div>
                  <h4 className="font-medium text-green-800 text-xs sm:text-sm leading-tight truncate">
                    {product.name}
                  </h4>
                </div>
                <div className="space-y-1 text-xs text-green-600">
                  <div className="flex justify-between items-center">
                    <span className="truncate pr-1">{t.marketShare}:</span>
                    <span className="font-medium whitespace-nowrap">{product.marketShare}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="truncate pr-1">{t.exportVolume}:</span>
                    <span className="font-medium whitespace-nowrap text-xs">{product.exportVolume}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="truncate pr-1">Current:</span>
                    <span className="font-medium whitespace-nowrap">
                      ${cambodiaPriceHistory[cambodiaPriceHistory.length - 1][product.key]}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Responsive Interactive Chart */}
        <div className="bg-gray-50 rounded-lg p-2 sm:p-3 lg:p-4 border border-gray-200">
          <SimpleLineChart data={cambodiaPriceHistory} products={top5Products} colors={chartColors} />
        </div>

        {/* Price Change Summary - Responsive Grid */}
        <div className="mt-4 sm:mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-4">
          {top5Products.map((product, index) => {
            const firstPrice = cambodiaPriceHistory[0][product.key]
            const lastPrice = cambodiaPriceHistory[cambodiaPriceHistory.length - 1][product.key]
            const change = (((lastPrice - firstPrice) / firstPrice) * 100).toFixed(1)
            const isPositive = change >= 0

            return (
              <div
                key={`change-${product.key}`}
                className="text-center p-2 sm:p-3 bg-white rounded-lg border border-green-100"
              >
                <div className="text-xs sm:text-sm text-green-700 mb-1 truncate">{t.priceChange}</div>
                <div className={`text-sm sm:text-lg font-bold ${isPositive ? "text-green-600" : "text-red-600"}`}>
                  {isPositive ? "+" : ""}
                  {change}%
                </div>
                <div className="text-xs text-gray-500 truncate">
                  ${firstPrice} → ${lastPrice}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Price Alerts - Responsive Form */}
      <div className="bg-white rounded-lg p-3 sm:p-4 lg:p-6 shadow-sm border border-green-200">
        <div className="mb-4 sm:mb-5">
          <h3 className="text-lg sm:text-xl font-semibold text-green-800 mb-2 flex items-center gap-2">
            <span>🔔</span>
            <span className="break-words">{t.priceAlerts}</span>
          </h3>
          <p className="text-sm sm:text-base text-green-600 leading-relaxed">{t.alertsDescription}</p>
        </div>
        <div className="space-y-4 sm:space-y-5">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 sm:gap-4">
            <div className="flex flex-col">
              <label className="text-green-800 font-medium mb-1 text-sm">{t.selectVariety}</label>
              <select
                value={selectedVariety}
                onChange={(e) => setSelectedVariety(e.target.value)}
                className="px-3 py-2 border-2 border-green-200 rounded-md focus:outline-none focus:border-green-600 transition-colors duration-200 text-sm sm:text-base"
              >
                <option value="">{t.chooseVariety}</option>
                {allVarieties.map((variety) => (
                  <option key={variety.id} value={variety.id}>
                    {variety.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col">
              <label className="text-green-800 font-medium mb-1 text-sm">{t.alertPrice}</label>
              <input
                type="number"
                placeholder={t.enterPrice}
                value={alertPrice}
                onChange={(e) => setAlertPrice(e.target.value)}
                className="px-3 py-2 border-2 border-green-200 rounded-md focus:outline-none focus:border-green-600 transition-colors duration-200 text-sm sm:text-base"
              />
            </div>
            <div className="flex flex-col">
              <div className="h-6 lg:block hidden"></div>
              <button
                onClick={addPriceAlert}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors duration-200 font-medium text-sm sm:text-base"
              >
                {t.addAlert}
              </button>
            </div>
          </div>

          {/* Active Alerts - Responsive Layout */}
          {alerts.length > 0 && (
            <div className="mt-4">
              <h4 className="font-medium text-green-800 mb-3 text-sm sm:text-base">{t.activeAlerts}</h4>
              <div className="space-y-2 sm:space-y-3">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className="flex flex-col sm:flex-row sm:justify-between sm:items-center p-3 bg-green-50 border border-green-200 rounded-lg gap-2 sm:gap-3"
                  >
                    <div className="flex flex-col gap-1">
                      <span className="font-medium text-green-800 text-sm sm:text-base break-words">
                        {alert.variety}
                      </span>
                      <span className="text-green-600 text-xs sm:text-sm">
                        {t.alertWhen} {formatPrice(alert.price)}
                      </span>
                    </div>
                    <button
                      onClick={() => removeAlert(alert.id)}
                      className="bg-transparent text-green-600 border border-green-600 px-3 py-1 rounded text-xs sm:text-sm hover:bg-green-600 hover:text-white transition-colors duration-200 self-end sm:self-center whitespace-nowrap"
                    >
                      {t.remove}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default MarketPricesView
