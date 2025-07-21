import { MapPin, Ruler, TreePine } from "lucide-react"

const FarmView = ({ language }) => {
  const translations = {
    en: {
      title: "My Farm Overview",
      totalArea: "Total Farm Area",
      activeFields: "Active Fields",
      cropTypes: "Crop Types",
      hectares: "hectares",
      fields: "fields",
      types: "types",
      riceField: "Rice Field A",
      cornField: "Corn Field B",
      tomatoGarden: "Tomato Garden",
      onionPatch: "Onion Patch",
      viewDetails: "View Details",
      addField: "Add New Field",
    },
    km: {
      title: "ទិដ្ឋភាពកសិដ្ឋានរបស់ខ្ញុំ",
      totalArea: "ផ្ទៃដីសរុប",
      activeFields: "ស្រែដែលកំពុងដាំ",
      cropTypes: "ប្រភេទដំណាំ",
      hectares: "ហិកតា",
      fields: "ស្រែ",
      types: "ប្រភេទ",
      riceField: "ស្រែស្រូវ A",
      cornField: "ស្រែពោត B",
      tomatoGarden: "ចំការប៉េងប៉ោះ",
      onionPatch: "ចំការខ្ទឹមបារាំង",
      viewDetails: "មើលលម្អិត",
      addField: "បន្ថែមស្រែថ្មី",
    },
  }

  const t = translations[language]

  const farmStats = [
    { label: t.totalArea, value: "15.5", unit: t.hectares, icon: Ruler, color: "bg-blue-500" },
    { label: t.activeFields, value: "4", unit: t.fields, icon: MapPin, color: "bg-green-500" },
    { label: t.cropTypes, value: "4", unit: t.types, icon: TreePine, color: "bg-purple-500" },
  ]

  const fields = [
    { name: t.riceField, area: "6.2 ha", status: "Growing", progress: 65 },
    { name: t.cornField, area: "4.8 ha", status: "Ready to Harvest", progress: 100 },
    { name: t.tomatoGarden, area: "2.1 ha", status: "Flowering", progress: 45 },
    { name: t.onionPatch, area: "2.4 ha", status: "Planted", progress: 25 },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-green-800 mb-2">{t.title}</h1>
        <p className="text-green-600">Monitor and manage all your farming areas</p>
      </div>

      {/* Farm Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {farmStats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-lg">
            <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-full ${stat.color} text-white`}>
                <stat.icon className="h-6 w-6" />
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">{stat.value}</div>
                <div className="text-sm text-gray-500">{stat.unit}</div>
              </div>
            </div>
            <h3 className="font-semibold text-gray-700">{stat.label}</h3>
          </div>
        ))}
      </div>

      {/* Fields Overview */}
      <div className="bg-white rounded-lg p-6 shadow-lg">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Farm Fields</h2>
          <button className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
            {t.addField}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {fields.map((field, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-800">{field.name}</h3>
                <span className="text-sm text-gray-500">{field.area}</span>
              </div>

              <div className="mb-3">
                <div className="flex justify-between text-sm mb-1">
                  <span>{field.status}</span>
                  <span>{field.progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${field.progress}%` }}
                  ></div>
                </div>
              </div>

              <button className="w-full px-3 py-2 text-sm border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                {t.viewDetails}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default FarmView
