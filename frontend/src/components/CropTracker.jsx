import { Sprout } from "lucide-react"
import { Link } from "react-router-dom"

const CropTracker = ({ language }) => {
  const translations = {
    en: {
      title: "Crop Growth Tracker",
      rice: "Rice Field A",
      tomatoes: "Tomato Garden",
      corn: "Corn Field B",
      flowering: "Flowering Stage",
      growing: "Growing Stage",
      ready: "Ready to Harvest",
      planted: "Planted",
      days: "days ago",
      viewDetails: "View Details",
      addPhoto: "Add Photo",
      viewAll: "View All Crops",
    },
    km: {
      title: "តាមដានការលូតលាស់ដំណាំ",
      rice: "ស្រែស្រូវ A",
      tomatoes: "ចំការប៉េងប៉ោះ",
      corn: "ស្រែពោត B",
      flowering: "ដំណាក់កាលផ្កាបាន",
      growing: "ដំណាក់កាលលូតលាស់",
      ready: "ត្រៀមច្រូត",
      planted: "បានដាំ",
      days: "ថ្ងៃមុន",
      viewDetails: "មើលលម្អិត",
      addPhoto: "បន្ថែមរូបភាព",
      viewAll: "មើលដំណាំទាំងអស់",
    },
  }

  const t = translations[language]

  const crops = [
    {
      id: 1,
      name: t.rice,
      stage: t.flowering,
      planted: 45,
      progress: 75,
      color: "bg-green-500",
    },
    {
      id: 2,
      name: t.tomatoes,
      stage: t.growing,
      planted: 30,
      progress: 60,
      color: "bg-red-500",
    },
  ]

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Sprout className="h-5 w-5" />
          <h3 className="text-xl font-semibold">{t.title}</h3>
        </div>
        <Link to="/crops" className="text-sm text-green-600 hover:text-green-700 font-medium">
          {t.viewAll}
        </Link>
      </div>

      <div className="space-y-4">
        {crops.map((crop) => (
          <div key={crop.id} className="border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h4 className="font-semibold">{crop.name}</h4>
                <p className="text-sm text-gray-600">{crop.stage}</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-500">
                  {t.planted} {crop.planted} {t.days}
                </p>
              </div>
            </div>

            <div className="mb-3">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{crop.progress}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div className={`h-2 rounded-full ${crop.color}`} style={{ width: `${crop.progress}%` }}></div>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                {t.viewDetails}
              </button>
              <button className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                {t.addPhoto}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default CropTracker
