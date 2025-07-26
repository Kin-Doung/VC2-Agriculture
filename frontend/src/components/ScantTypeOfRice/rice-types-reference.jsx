"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Eye, Info } from "lucide-react"

const riceTypes = [
  {
    name: "Basmati",
    color: "bg-amber-100",
    description: "Long-grain aromatic rice",
    origin: "India/Pakistan",
    image: "/placeholder.svg?height=150&width=200&text=Basmati+Rice+Long+slender+grains",
    characteristics: ["Length: 6-7mm", "Aspect ratio: 3:1 or higher", "Translucent white color", "Aromatic fragrance"],
    cookingTime: "18-20 minutes",
    bestFor: "Biryani, Pilaf, Side dishes",
  },
  {
    name: "Jasmine",
    color: "bg-green-100",
    description: "Fragrant Thai rice",
    origin: "Thailand",
    image: "/placeholder.svg?height=150&width=200&text=Jasmine+Rice+Medium+long+grains",
    characteristics: ["Length: 5-6mm", "Aspect ratio: 2.5-3:1", "Slightly translucent", "Sweet floral aroma"],
    cookingTime: "15-18 minutes",
    bestFor: "Thai dishes, Stir-fries, Curry",
  },
  {
    name: "Arborio",
    color: "bg-blue-100",
    description: "Italian risotto rice",
    origin: "Italy",
    image: "/placeholder.svg?height=150&width=200&text=Arborio+Rice+Short+plump+grains",
    characteristics: ["Length: 4-5mm", "Aspect ratio: 1.5-2:1", "High starch content", "Creamy when cooked"],
    cookingTime: "20-25 minutes",
    bestFor: "Risotto, Rice pudding, Paella",
  },
  {
    name: "Brown Rice",
    color: "bg-orange-100",
    description: "Whole grain rice",
    origin: "Various",
    image: "/placeholder.svg?height=150&width=200&text=Brown+Rice+Tan+colored+bran+layer",
    characteristics: ["Brown/tan bran layer", "Nutty flavor", "Chewy texture", "High in fiber"],
    cookingTime: "45-50 minutes",
    bestFor: "Health bowls, Salads, Side dishes",
  },
  {
    name: "Wild Rice",
    color: "bg-purple-100",
    description: "Dark nutty grain",
    origin: "North America",
    image: "/placeholder.svg?height=150&width=200&text=Wild+Rice+Dark+long+grains",
    characteristics: ["Dark brown/black color", "Long slender grains", "Nutty earthy flavor", "Actually a grass seed"],
    cookingTime: "45-60 minutes",
    bestFor: "Salads, Stuffing, Soups",
  },
  {
    name: "Sushi Rice",
    color: "bg-pink-100",
    description: "Short-grain sticky rice",
    origin: "Japan",
    image: "/placeholder.svg?height=150&width=200&text=Sushi+Rice+Short+round+grains",
    characteristics: ["Short round grains", "Aspect ratio: 1.2-1.8:1", "Sticky when cooked", "Slightly sweet flavor"],
    cookingTime: "18-20 minutes",
    bestFor: "Sushi, Onigiri, Rice balls",
  },
  {
    name: "Black Rice",
    color: "bg-gray-100",
    description: "Antioxidant-rich rice",
    origin: "China",
    image: "/placeholder.svg?height=150&width=200&text=Black+Rice+Dark+purple+grains",
    characteristics: ["Deep purple-black color", "High in antioxidants", "Nutty flavor", "Chewy texture"],
    cookingTime: "30-35 minutes",
    bestFor: "Desserts, Salads, Health bowls",
  },
  {
    name: "Red Rice",
    color: "bg-red-100",
    description: "Whole grain red rice",
    origin: "Various",
    image: "/placeholder.svg?height=150&width=200&text=Red+Rice+Reddish+bran+layer",
    characteristics: ["Reddish bran layer", "Earthy flavor", "Whole grain", "Chewy texture"],
    cookingTime: "35-40 minutes",
    bestFor: "Salads, Pilafs, Side dishes",
  },
]

export default function RiceTypesReference({ title = "Rice Types Reference Guide" }) {
  const [selectedRice, setSelectedRice] = useState(null)
  const [showDetails, setShowDetails] = useState(false)

  const openRiceDetails = (rice) => {
    setSelectedRice(rice)
    setShowDetails(true)
  }

  const closeDetails = () => {
    setShowDetails(false)
    setSelectedRice(null)
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {riceTypes.map((rice) => (
              <div
                key={rice.name}
                className={`${rice.color} p-4 rounded-lg hover:shadow-lg transition-all cursor-pointer border-2 border-transparent hover:border-gray-300`}
                onClick={() => openRiceDetails(rice)}
              >
                {/* Rice Image */}
                <div className="mb-3">
                  <img
                    src={rice.image || "/placeholder.svg"}
                    alt={`${rice.name} rice grains`}
                    className="w-full h-24 object-cover rounded-md border"
                  />
                </div>

                {/* Rice Info */}
                <div className="text-center">
                  <h3 className="font-semibold text-gray-800 mb-1">{rice.name}</h3>
                  <p className="text-sm text-gray-600 mb-1">{rice.description}</p>
                  <p className="text-xs text-gray-500">{rice.origin}</p>

                  <button className="mt-2 text-xs bg-white/50 hover:bg-white/80 px-2 py-1 rounded transition-colors">
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
              <Info className="w-4 h-4" />
              Tips for Better Seed Identification:
            </h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Compare your seed image with the reference images above</li>
              <li>• Look for grain length, width, and color characteristics</li>
              <li>• Ensure good lighting when capturing images</li>
              <li>• Keep seeds clearly visible and in focus</li>
              <li>• Use a plain background for better contrast</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Detailed Rice Information Modal */}
      {showDetails && selectedRice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              {/* Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{selectedRice.name} Rice</h2>
                  <p className="text-gray-600">{selectedRice.description}</p>
                  <p className="text-sm text-gray-500">Origin: {selectedRice.origin}</p>
                </div>
                <button onClick={closeDetails} className="text-gray-500 hover:text-gray-700 text-2xl font-bold">
                  ×
                </button>
              </div>

              {/* Rice Image */}
              <div className="mb-6">
                <img
                  src={selectedRice.image || "/placeholder.svg"}
                  alt={`${selectedRice.name} rice detailed view`}
                  className="w-full h-48 object-cover rounded-lg border"
                />
              </div>

              {/* Characteristics */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Key Characteristics</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {selectedRice.characteristics.map((characteristic, index) => (
                    <div key={index} className="flex items-center gap-2 bg-gray-50 rounded p-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                      <span className="text-sm text-gray-700">{characteristic}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cooking Information */}
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-blue-800 mb-2">Cooking Time</h4>
                  <p className="text-blue-700">{selectedRice.cookingTime}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4">
                  <h4 className="font-medium text-green-800 mb-2">Best Used For</h4>
                  <p className="text-green-700">{selectedRice.bestFor}</p>
                </div>
              </div>

              {/* Identification Tips */}
              <div className="bg-yellow-50 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">How to Identify This Rice</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Look for the specific grain length and width ratio</li>
                  <li>• Check the color - from translucent white to dark brown/black</li>
                  <li>• Notice the grain shape - long, short, round, or plump</li>
                  <li>• Consider the surface texture - smooth, rough, or with bran layer</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
