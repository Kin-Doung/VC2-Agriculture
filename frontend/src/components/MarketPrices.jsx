import { TrendingUp, TrendingDown, DollarSign } from "lucide-react"
import { Link } from "react-router-dom"

const MarketPrices = ({ language }) => {
  const translations = {
    en: {
      title: "Market Prices Today",
      rice: "Rice",
      tomatoes: "Tomatoes",
      corn: "Corn",
      onions: "Onions",
      perKg: "/kg",
      change: "vs yesterday",
      viewAll: "View All Prices",
    },
    km: {
      title: "តម្លៃទីផ្សារថ្ងៃនេះ",
      rice: "ស្រូវ",
      tomatoes: "ប៉េងប៉ោះ",
      corn: "ពោត",
      onions: "ខ្ទឹមបារាំង",
      perKg: "/គ.ក",
      change: "ធៀបនឹងម្សិលមិញ",
      viewAll: "មើលតម្លៃទាំងអស់",
    },
  }

  const t = translations[language]

  const prices = [
    { name: t.rice, price: "$0.85", change: "+5%", trend: "up" },
    { name: t.tomatoes, price: "$2.30", change: "-2%", trend: "down" },
    { name: t.corn, price: "$1.20", change: "+8%", trend: "up" },
    { name: t.onions, price: "$1.80", change: "+3%", trend: "up" },
  ]

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <DollarSign className="h-5 w-5" />
          <h3 className="text-xl font-semibold">{t.title}</h3>
        </div>
        <Link to="/prices" className="text-sm text-green-600 hover:text-green-700 font-medium">
          {t.viewAll}
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {prices.map((item, index) => (
          <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <h4 className="font-semibold">{item.name}</h4>
              <p className="text-2xl font-bold text-green-600">
                {item.price}
                <span className="text-sm text-gray-500">{t.perKg}</span>
              </p>
            </div>
            <div className="text-right">
              <div className={`flex items-center gap-1 ${item.trend === "up" ? "text-green-600" : "text-red-600"}`}>
                {item.trend === "up" ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                <span className="font-semibold">{item.change}</span>
              </div>
              <p className="text-xs text-gray-500">{t.change}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MarketPrices