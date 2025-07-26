"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Scan, CheckCircle, AlertCircle, Eye, ContrastIcon as Compare } from "lucide-react"

export default function ScanResults({ result, error, isScanning }) {
  const [showComparison, setShowComparison] = useState(false)

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return "text-green-600"
    if (confidence >= 0.6) return "text-yellow-600"
    return "text-red-600"
  }

  const getConfidenceIcon = (confidence) => {
    if (confidence >= 0.7) {
      return <CheckCircle className="w-5 h-5 text-green-600" />
    }
    return <AlertCircle className="w-5 h-5 text-yellow-600" />
  }

  const getReferenceImage = (riceType) => {
    const imageMap = {
      "Basmati Rice": "/placeholder.svg?height=150&width=200&text=Basmati+Rice+Long+slender+grains",
      "Jasmine Rice": "/placeholder.svg?height=150&width=200&text=Jasmine+Rice+Medium+long+grains",
      "Brown Rice": "/placeholder.svg?height=150&width=200&text=Brown+Rice+Tan+colored+bran+layer",
      "Arborio Rice": "/placeholder.svg?height=150&width=200&text=Arborio+Rice+Short+plump+grains",
      "Sushi Rice": "/placeholder.svg?height=150&width=200&text=Sushi+Rice+Short+round+grains",
      "Wild Rice": "/placeholder.svg?height=150&width=200&text=Wild+Rice+Dark+long+grains",
      "Black Rice": "/placeholder.svg?height=150&width=200&text=Black+Rice+Dark+purple+grains",
      "Red Rice": "/placeholder.svg?height=150&width=200&text=Red+Rice+Reddish+bran+layer",
    }
    return imageMap[riceType] || "/placeholder.svg?height=150&width=200&text=Rice+Reference"
  }

  return (
    <Card className="h-fit">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Scan className="w-5 h-5" />
          Scan Results
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isScanning && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Scan className="w-12 h-12 mx-auto mb-4 animate-spin text-green-600" />
              <p className="text-lg font-medium text-gray-700">Analyzing rice image...</p>
              <p className="text-sm text-gray-500 mt-2">This may take a few seconds</p>
            </div>
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center gap-2 text-red-700 mb-2">
              <AlertCircle className="w-5 h-5" />
              <p className="font-medium">Scan Failed</p>
            </div>
            <p className="text-red-600 text-sm mb-3">{error}</p>
            <div className="bg-red-100 rounded p-3">
              <p className="text-red-700 text-xs font-medium mb-1">Troubleshooting Tips:</p>
              <ul className="text-red-600 text-xs space-y-1">
                <li>• Make sure the image shows rice grains clearly</li>
                <li>• Use good lighting without shadows</li>
                <li>• Try a different image or retake the photo</li>
                <li>• Compare with reference images in the guide below</li>
              </ul>
            </div>
          </div>
        )}

        {result && (
          <div className="space-y-6">
            {/* Main Result */}
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-lg p-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-green-800 mb-2">{result.type}</h3>
                  <div className="flex items-center gap-2">
                    {getConfidenceIcon(result.confidence)}
                    <span className={`font-semibold ${getConfidenceColor(result.confidence)}`}>
                      {(result.confidence * 100).toFixed(1)}% confidence
                    </span>
                  </div>
                </div>

                {/* Reference Image */}
                {result.type !== "Not Rice Detected" && result.type !== "Analysis Failed" && (
                  <div className="text-center">
                    <img
                      src={getReferenceImage(result.type) || "/placeholder.svg"}
                      alt={`${result.type} reference`}
                      className="w-20 h-16 object-cover rounded border mb-1"
                    />
                    <p className="text-xs text-gray-600">Reference</p>
                  </div>
                )}
              </div>

              <p className="text-gray-700 leading-relaxed mb-4">{result.description}</p>

              {/* Action Buttons */}
              {result.type !== "Not Rice Detected" && result.type !== "Analysis Failed" && (
                <div className="flex gap-2">
                  <button
                    onClick={() => setShowComparison(!showComparison)}
                    className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                  >
                    <Compare className="w-4 h-4" />
                    {showComparison ? "Hide" : "Show"} Comparison
                  </button>
                  <button className="flex items-center gap-2 bg-gray-600 hover:bg-gray-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors">
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              )}
            </div>

            {/* Visual Comparison */}
            {showComparison && result.type !== "Not Rice Detected" && result.type !== "Analysis Failed" && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-blue-800 mb-3 flex items-center gap-2">
                  <Compare className="w-5 h-5" />
                  Visual Comparison
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="text-center">
                    <h5 className="font-medium text-gray-700 mb-2">Your Image</h5>
                    <div className="bg-white rounded border p-2">
                      <p className="text-sm text-gray-600 mb-2">Scanned rice sample</p>
                      <div className="w-full h-24 bg-gray-100 rounded flex items-center justify-center">
                        <span className="text-gray-500 text-sm">Your captured image</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-center">
                    <h5 className="font-medium text-gray-700 mb-2">Reference Image</h5>
                    <div className="bg-white rounded border p-2">
                      <p className="text-sm text-gray-600 mb-2">{result.type}</p>
                      <img
                        src={getReferenceImage(result.type) || "/placeholder.svg"}
                        alt={`${result.type} reference`}
                        className="w-full h-24 object-cover rounded"
                      />
                    </div>
                  </div>
                </div>
                <div className="mt-3 text-center">
                  <p className="text-sm text-blue-700">
                    Compare the grain shape, size, and color between your sample and the reference image
                  </p>
                </div>
              </div>
            )}

            {/* Characteristics */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Key Characteristics</h4>
              <div className="grid gap-2">
                {result.characteristics.map((characteristic, index) => (
                  <div key={index} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full flex-shrink-0" />
                    <span className="text-gray-700">{characteristic}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Confidence Meter */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3">Confidence Level</h4>
              <div className="bg-gray-200 rounded-full h-3 overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 ${
                    result.confidence >= 0.8
                      ? "bg-green-500"
                      : result.confidence >= 0.6
                        ? "bg-yellow-500"
                        : "bg-red-500"
                  }`}
                  style={{ width: `${result.confidence * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-sm text-gray-600 mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </div>

            {/* Analysis Details */}
            {result.analysis_details && (
              <div>
                <h4 className="text-lg font-semibold text-gray-800 mb-3">Analysis Details</h4>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Complexity Score:</span>
                      <span className="ml-2 font-medium">{result.analysis_details.complexity_score}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Color Variety:</span>
                      <span className="ml-2 font-medium">{result.analysis_details.color_variety}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Brightness:</span>
                      <span className="ml-2 font-medium">{result.analysis_details.brightness}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Texture Score:</span>
                      <span className="ml-2 font-medium">{result.analysis_details.texture_score}</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {!result && !error && !isScanning && (
          <div className="text-center py-12">
            <Scan className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">Upload or capture an image to identify rice type</p>
            <p className="text-gray-400 text-sm mt-2">Make sure the rice grains are clearly visible in good lighting</p>
            <p className="text-gray-400 text-sm">Check the reference guide below for examples</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
