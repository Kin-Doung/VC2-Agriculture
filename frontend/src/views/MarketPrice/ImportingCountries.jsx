"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ArrowLeftIcon  } from "lucide-react"
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { TrendingUp, TrendingDown, Globe, Package, DollarSign } from "lucide-react"

// Sample data for importing countries and market trends
const importingCountriesData = {
  rice: [
    { country: "China", volume: 2850, value: 1420, growth: 12.5, marketShare: 28.5 },
    { country: "Philippines", volume: 1950, value: 975, growth: 8.3, marketShare: 19.5 },
    { country: "Nigeria", volume: 1650, value: 825, growth: 15.2, marketShare: 16.5 },
    { country: "Iran", volume: 1200, value: 600, growth: -3.1, marketShare: 12.0 },
    { country: "Iraq", volume: 980, value: 490, growth: 6.7, marketShare: 9.8 },
    { country: "Saudi Arabia", volume: 750, value: 375, growth: 4.2, marketShare: 7.5 },
    { country: "Others", volume: 620, value: 310, growth: 2.1, marketShare: 6.2 },
  ],
  fruits: [
    { country: "Germany", volume: 3200, value: 2240, growth: 7.8, marketShare: 22.3 },
    { country: "United States", volume: 2850, value: 1995, growth: 5.4, marketShare: 19.9 },
    { country: "United Kingdom", volume: 2100, value: 1470, growth: 9.2, marketShare: 14.6 },
    { country: "Russia", volume: 1800, value: 1260, growth: -2.5, marketShare: 12.5 },
    { country: "Netherlands", volume: 1450, value: 1015, growth: 11.3, marketShare: 10.1 },
    { country: "France", volume: 1200, value: 840, growth: 6.1, marketShare: 8.4 },
    { country: "Others", volume: 1750, value: 1225, growth: 4.7, marketShare: 12.2 },
  ],
  vegetables: [
    { country: "Germany", volume: 2950, value: 1770, growth: 8.9, marketShare: 24.6 },
    { country: "United Kingdom", volume: 2200, value: 1320, growth: 6.3, marketShare: 18.3 },
    { country: "Netherlands", volume: 1850, value: 1110, growth: 12.1, marketShare: 15.4 },
    { country: "France", volume: 1600, value: 960, growth: 4.8, marketShare: 13.3 },
    { country: "Belgium", volume: 1200, value: 720, growth: 7.5, marketShare: 10.0 },
    { country: "Italy", volume: 950, value: 570, growth: 3.2, marketShare: 7.9 },
    { country: "Others", volume: 1250, value: 750, growth: 5.1, marketShare: 10.5 },
  ],
}

const demandTrendsData = [
  { month: "Jan", rice: 2400, fruits: 3100, vegetables: 2800 },
  { month: "Feb", rice: 2600, fruits: 3300, vegetables: 2950 },
  { month: "Mar", rice: 2800, fruits: 3500, vegetables: 3100 },
  { month: "Apr", rice: 3200, fruits: 3800, vegetables: 3400 },
  { month: "May", rice: 3500, fruits: 4100, vegetables: 3650 },
  { month: "Jun", rice: 3800, fruits: 4400, vegetables: 3900 },
  { month: "Jul", rice: 4100, fruits: 4200, vegetables: 3800 },
  { month: "Aug", rice: 3900, fruits: 3900, vegetables: 3600 },
  { month: "Sep", rice: 3600, fruits: 3700, vegetables: 3450 },
  { month: "Oct", rice: 3300, fruits: 3500, vegetables: 3200 },
  { month: "Nov", rice: 3000, fruits: 3200, vegetables: 2950 },
  { month: "Dec", rice: 2700, fruits: 2900, vegetables: 2700 },
]

const marketShareColors = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8", "#82CA9D", "#FFC658"]

export default function ImportingCountries() {
  const [selectedProduct, setSelectedProduct] = useState("rice")
  const [timeframe, setTimeframe] = useState("yearly")
  const [activeTab, setActiveTab] = useState("countries")

  const currentData = importingCountriesData[selectedProduct]
  const totalVolume = currentData.reduce((sum, item) => sum + item.volume, 0)
  const totalValue = currentData.reduce((sum, item) => sum + item.value, 0)
  const avgGrowth = currentData.reduce((sum, item) => sum + item.growth, 0) / currentData.length
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="max-w-7xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                {/* Back Button */}
                <button
                    onClick={() => navigate("/prices")} 
                    className="flex items-center gap-2 px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    <ArrowLeftIcon className="h-4 w-4" />
                    Back to Market Prices
                </button>
                </div>
            </div>
        </div>
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-gray-900">Export Market Trends</h1>
          <p className="text-gray-600">Top importing countries and global demand analysis</p>
        </div>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
          <div className="flex gap-4">
            <select
              value={selectedProduct}
              onChange={(e) => setSelectedProduct(e.target.value)}
              className="w-40 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="rice">Rice</option>
              <option value="fruits">Fruits</option>
              <option value="vegetables">Vegetables</option>
            </select>

            <select
              value={timeframe}
              onChange={(e) => setTimeframe(e.target.value)}
              className="w-32 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h4 className="text-sm font-medium">Total Volume</h4>
              <Package className="h-4 w-4 text-gray-500" />
            </div>
            <div className="text-2xl font-bold">{totalVolume.toLocaleString()}</div>
            <p className="text-xs text-gray-500">thousand tons</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h4 className="text-sm font-medium">Total Value</h4>
              <DollarSign className="h-4 w-4 text-gray-500" />
            </div>
            <div className="text-2xl font-bold">${totalValue.toLocaleString()}M</div>
            <p className="text-xs text-gray-500">million USD</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h4 className="text-sm font-medium">Avg Growth</h4>
              {avgGrowth >= 0 ? (
                <TrendingUp className="h-4 w-4 text-green-600" />
              ) : (
                <TrendingDown className="h-4 w-4 text-red-600" />
              )}
            </div>
            <div className={`text-2xl font-bold ${avgGrowth >= 0 ? "text-green-600" : "text-red-600"}`}>
              {avgGrowth.toFixed(1)}%
            </div>
            <p className="text-xs text-gray-500">year over year</p>
          </div>

          <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
            <div className="flex flex-row items-center justify-between space-y-0 pb-2">
              <h4 className="text-sm font-medium">Countries</h4>
              <Globe className="h-4 w-4 text-gray-500" />
            </div>
            <div className="text-2xl font-bold">{currentData.length}</div>
            <p className="text-xs text-gray-500">importing countries</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="space-y-4">
          <div className="flex justify-center space-x-4">
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                true ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => {}}
            >
              Top Countries
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                false ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => {}}
            >
              Demand Trends
            </button>
            <button
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                false ? "bg-green-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
              onClick={() => {}}
            >
              Market Analysis
            </button>
          </div>

          {/* Top Countries Content */}
          <div className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Countries Table */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h4 className="text-lg font-semibold mb-2">Top Importing Countries</h4>
                <p className="text-sm text-gray-500 mb-4">Volume and value by country for {selectedProduct}</p>
                <div className="space-y-4">
                  {currentData.map((country, index) => (
                    <div
                      key={country.country}
                      className="flex items-center justify-between p-3 border rounded-lg bg-gray-50"
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
                          {index + 1}
                        </div>
                        <div>
                          <p className="font-medium">{country.country}</p>
                          <p className="text-sm text-gray-500">{country.volume.toLocaleString()} tons</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">${country.value}M</p>
                        <span
                          className={`px-2 py-1 text-xs rounded ${
                            country.growth >= 0 ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                          }`}
                        >
                          {country.growth >= 0 ? "+" : ""}
                          {country.growth}%
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Market Share Chart */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h4 className="text-lg font-semibold mb-2">Market Share Distribution</h4>
                <p className="text-sm text-gray-500 mb-4">Share by importing countries</p>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={currentData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ country, marketShare }) => `${country}: ${marketShare}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="marketShare"
                    >
                      {currentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={marketShareColors[index % marketShareColors.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Demand Trends Content */}
          <div className={`${activeTab === "trends" ? "" : "hidden"} space-y-4`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Demand Trends Line Chart */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h4 className="text-lg font-semibold mb-2">Monthly Demand Trends</h4>
                <p className="text-sm text-gray-500 mb-4">Import volume trends across product categories</p>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={demandTrendsData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="rice" stroke="#8884d8" strokeWidth={2} />
                    <Line type="monotone" dataKey="fruits" stroke="#82ca9d" strokeWidth={2} />
                    <Line type="monotone" dataKey="vegetables" stroke="#ffc658" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Volume Comparison */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h4 className="text-lg font-semibold mb-2">Volume Comparison</h4>
                <p className="text-sm text-gray-500 mb-4">Import volumes by country (thousand tons)</p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={currentData.slice(0, 6)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="volume" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

            {/* Market Analysis Content */}
            <div className={`${activeTab === "countries" ? "" : "hidden"} space-y-4`}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Growth Analysis */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h4 className="text-lg font-semibold mb-2">Growth Analysis</h4>
                <p className="text-sm text-gray-500 mb-4">Year-over-year growth rates by country</p>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={currentData.slice(0, 6)}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="country" angle={-45} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="growth" fill={(entry) => (entry.growth >= 0 ? "#10b981" : "#ef4444")} />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Market Insights */}
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <h4 className="text-lg font-semibold mb-2">Market Insights</h4>
                <p className="text-sm text-gray-500 mb-4">Key trends and opportunities</p>
                <div className="space-y-4">
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <h5 className="font-semibold text-green-800 mb-2">Growing Markets</h5>
                    <p className="text-sm text-green-700">
                      {currentData
                        .filter((c) => c.growth > 10)
                        .map((c) => c.country)
                        .join(", ")}{" "}
                      showing strong growth above 10%
                    </p>
                  </div>

                  <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h5 className="font-semibold text-blue-800 mb-2">Market Leaders</h5>
                    <p className="text-sm text-blue-700">
                      {currentData[0].country} dominates with {currentData[0].marketShare}% market share
                    </p>
                  </div>

                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h5 className="font-semibold text-yellow-800 mb-2">Opportunities</h5>
                    <p className="text-sm text-yellow-700">
                      Emerging markets show potential for expansion with increasing demand
                    </p>
                  </div>

                  {currentData.some((c) => c.growth < 0) && (
                    <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h5 className="font-semibold text-red-800 mb-2">Declining Markets</h5>
                      <p className="text-sm text-red-700">
                        {currentData
                          .filter((c) => c.growth < 0)
                          .map((c) => c.country)
                          .join(", ")}{" "}
                        showing negative growth
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}