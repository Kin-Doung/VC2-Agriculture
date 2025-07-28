"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { ContrastIcon as Compare, X } from "lucide-react"

const riceTypes = [
  {
    name: "Basmati Rice",
    image: "/placeholder.svg?height=120&width=160&text=Basmati+Rice+Long+grains",
    characteristics: ["Long grains (6-7mm)", "Aromatic", "Fluffy texture"],
    color: "Translucent white",
  },
  {
    name: "Jasmine Rice",
    image: "/placeholder.svg?height=120&width=160&text=Jasmine+Rice+Medium+grains",
    characteristics: ["Medium-long grains", "Floral aroma", "Slightly sticky"],
    color: "White to slightly translucent",
  },
  {
    name: "Brown Rice",
    image: "/placeholder.svg?height=120&width=160&text=Brown+Rice+Bran+layer",
    characteristics: ["Brown bran layer", "Nutty flavor", "Chewy texture"],
    color: "Brown to tan",
  },
  {
    name: "Arborio Rice",
    image: "/placeholder.svg?height=120&width=160&text=Arborio+Rice+Short+plump",
    characteristics: ["Short plump grains", "High starch", "Creamy when cooked"],
    color: "Pearly white",
  },
]

export default function RiceComparisonTool({ userImage, detectedType, title = "Rice Comparison Tool" }) {
  const [selectedRices, setSelectedRices] = useState([])
  const [showComparison, setShowComparison] = useState(false)

  const addRiceToComparison = (rice) => {
    if (selectedRices.length < 3 && !selectedRices.find((r) => r.name === rice.name)) {
      setSelectedRices([...selectedRices, rice])
    }
  }

  const removeRiceFromComparison = (riceName) => {
    setSelectedRices(selectedRices.filter((r) => r.name !== riceName))
  }

  const startComparison = () => {
    if (detectedType) {
      const detectedRice = riceTypes.find((r) => r.name === detectedType)
      if (detectedRice && !selectedRices.find((r) => r.name === detectedRice.name)) {
        setSelectedRices([detectedRice, ...selectedRices.slice(0, 2)])
      }
    }
    setShowComparison(true)
  }

  return (
    <>
      <Card className="mt-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Compare className="w-5 h-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <p className="text-sm text-gray-600 mb-3">Select seed types to compare with your scanned image (max 3):</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {riceTypes.map((rice) => (
                <button
                  key={rice.name}
                  onClick={() => addRiceToComparison(rice)}
                  disabled={selectedRices.length >= 3 || selectedRices.find((r) => r.name === rice.name)}
                  className="p-2 border rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <img
                    src={rice.image || "/placeholder.svg"}
                    alt={rice.name}
                    className="w-full h-16 object-cover rounded mb-1"
                  />
                  <p className="text-xs font-medium">{rice.name}</p>
                </button>
              ))}
            </div>
          </div>

          {selectedRices.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Selected for comparison:</p>
              <div className="flex flex-wrap gap-2">
                {selectedRices.map((rice) => (
                  <div
                    key={rice.name}
                    className="flex items-center gap-2 bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                  >
                    <span>{rice.name}</span>
                    <button
                      onClick={() => removeRiceFromComparison(rice.name)}
                      className="hover:bg-blue-200 rounded-full p-1"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={startComparison}
            disabled={selectedRices.length === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Start Visual Comparison
          </button>
        </CardContent>
      </Card>

      {/* Comparison Modal */}
      {showComparison && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">Seed Visual Comparison</h2>
                <button
                  onClick={() => setShowComparison(false)}
                  className="text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                  ×
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* User's Image */}
                {userImage && (
                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <h3 className="font-semibold text-green-800 mb-3 text-center">Your Scanned Seed</h3>
                    <img
                      src={userImage || "/placeholder.svg"}
                      alt="Your seed sample"
                      className="w-full h-32 object-cover rounded border mb-3"
                    />
                    <div className="text-center">
                      <p className="text-sm text-green-700">
                        {detectedType ? `Detected: ${detectedType}` : "Analyzing..."}
                      </p>
                    </div>
                  </div>
                )}

                {/* Selected Rice Types */}
                {selectedRices.map((rice) => (
                  <div key={rice.name} className="bg-gray-50 border rounded-lg p-4">
                    <h3 className="font-semibold text-gray-800 mb-3 text-center">{rice.name}</h3>
                    <img
                      src={rice.image || "/placeholder.svg"}
                      alt={rice.name}
                      className="w-full h-32 object-cover rounded border mb-3"
                    />
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-gray-600">Color:</p>
                        <p className="text-sm text-gray-800">{rice.color}</p>
                      </div>
                      <div>
                        <p className="text-xs font-medium text-gray-600">Key Features:</p>
                        <ul className="text-xs text-gray-700 space-y-1">
                          {rice.characteristics.map((char, index) => (
                            <li key={index}>• {char}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-6 bg-yellow-50 rounded-lg p-4">
                <h4 className="font-medium text-yellow-800 mb-2">Comparison Tips:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Compare grain length and width ratios</li>
                  <li>• Look at color differences - white, brown, or colored varieties</li>
                  <li>• Notice surface texture - smooth, rough, or with visible bran</li>
                  <li>• Consider grain shape - long, short, round, or plump</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
