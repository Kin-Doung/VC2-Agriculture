"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Scan, CheckCircle, AlertCircle, Eye, ContrastIcon as Compare, Cpu, Code, Zap } from "lucide-react"

export default function ScanResults({ result, error, isScanning }) {
  const [showComparison, setShowComparison] = useState(false)
  const [showPythonDetails, setShowPythonDetails] = useState(false)

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

  const getAnalysisMethodIcon = (method) => {
    if (method?.includes("Python") || method?.includes("Computer Vision")) {
      return <Cpu className="w-4 h-4 text-blue-600" />
    }
    if (method?.includes("JavaScript")) {
      return <Code className="w-4 h-4 text-orange-600" />
    }
    return <Zap className="w-4 h-4 text-gray-600" />
  }

  const getAnalysisMethodColor = (method) => {
    if (method?.includes("Python") || method?.includes("Computer Vision")) {
      return "bg-blue-50 border-blue-200 text-blue-800"
    }
    if (method?.includes("JavaScript")) {
      return "bg-orange-50 border-orange-200 text-orange-800"
    }
    return "bg-gray-50 border-gray-200 text-gray-800"
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
          {result?.analysis_method && (
            <div
              className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${getAnalysisMethodColor(result.analysis_method)}`}
            >
              {getAnalysisMethodIcon(result.analysis_method)}
              <span>{result.analysis_method}</span>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isScanning && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Scan className="w-12 h-12 mx-auto mb-4 animate-spin text-green-600" />
              <p className="text-lg font-medium text-gray-700">Analyzing rice image...</p>
              <p className="text-sm text-gray-500 mt-2">Using Python computer vision + JavaScript fallback</p>
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
                <div className="flex gap-2 flex-wrap">
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
                  {result.python_analysis && (
                    <button
                      onClick={() => setShowPythonDetails(!showPythonDetails)}
                      className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
                    >
                      <Cpu className="w-4 h-4" />
                      Python Analysis
                    </button>
                  )}
                </div>
              )}
            </div>

            {/* Python Analysis Details */}
            {showPythonDetails && result.python_analysis && (
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-purple-800 mb-3 flex items-center gap-2">
                  <Cpu className="w-5 h-5" />
                  Python Computer Vision Analysis
                </h4>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h5 className="font-medium text-purple-700 mb-2">Detection Method:</h5>
                    <p className="text-sm text-purple-600 mb-3">{result.python_analysis.method}</p>

                    <h5 className="font-medium text-purple-700 mb-2">Grain Analysis:</h5>
                    <ul className="text-sm text-purple-600 space-y-1">
                      <li>• Grains detected: {result.python_analysis.grain_count}</li>
                      <li>• Avg aspect ratio: {result.python_analysis.avg_aspect_ratio}</li>
                      <li>• Dominant color: RGB({result.python_analysis.dominant_color?.join(", ")})</li>
                      <li>• Brightness: {result.python_analysis.brightness}</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-purple-700 mb-2">Features Analyzed:</h5>
                    <ul className="text-sm text-purple-600 space-y-1">
                      {result.python_analysis.features_analyzed?.map((feature, index) => (
                        <li key={index}>• {feature}</li>
                      ))}
                    </ul>

                    {result.python_analysis.classification_scores && (
                      <div className="mt-3">
                        <h5 className="font-medium text-purple-700 mb-2">Classification Scores:</h5>
                        <div className="text-xs text-purple-600">
                          {Object.entries(result.python_analysis.classification_scores).map(([type, score]) => (
                            <div key={type} className="flex justify-between">
                              <span>{type}:</span>
                              <span>{(score * 100).toFixed(1)}%</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Cooking Information */}
            {result.cooking_info && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-amber-800 mb-3">Cooking Information</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div>
                    <h5 className="font-medium text-amber-700 mb-1">Cooking Time:</h5>
                    <p className="text-amber-600">{result.cooking_info.time}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-amber-700 mb-1">Water Ratio:</h5>
                    <p className="text-amber-600">{result.cooking_info.water_ratio}</p>
                  </div>
                  <div>
                    <h5 className="font-medium text-amber-700 mb-1">Best For:</h5>
                    <p className="text-amber-600">{result.cooking_info.best_for}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Alternative Matches */}
            {result.alternative_matches && result.alternative_matches.length > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-blue-800 mb-3">Alternative Matches</h4>
                <div className="space-y-2">
                  {result.alternative_matches.map((match, index) => (
                    <div key={index} className="flex justify-between items-center bg-white rounded p-2">
                      <span className="text-blue-700 font-medium">{match.type}</span>
                      <span className="text-blue-600">{(match.confidence * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                      <span className="text-gray-600">Brightness:</span>
                      <span className="ml-2 font-medium">{result.analysis_details.brightness}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Entropy:</span>
                      <span className="ml-2 font-medium">{result.analysis_details.entropy}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Unique Chars:</span>
                      <span className="ml-2 font-medium">{result.analysis_details.unique_chars}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Image Size:</span>
                      <span className="ml-2 font-medium">{result.analysis_details.image_size} bytes</span>
                    </div>
                  </div>
                  {result.analysis_details.selection_reason && (
                    <div className="mt-3 pt-3 border-t">
                      <span className="text-gray-600 text-sm">Selection Reason: </span>
                      <span className="text-gray-700 text-sm font-medium">
                        {result.analysis_details.selection_reason}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Python Error Info */}
            {result.python_error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="text-lg font-semibold text-yellow-800 mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  Python Analysis Status
                </h4>
                <p className="text-yellow-700 text-sm mb-2">
                  Python computer vision analysis was attempted but failed. Using JavaScript fallback.
                </p>
                <details className="text-yellow-600 text-xs">
                  <summary className="cursor-pointer font-medium">Show Python Error Details</summary>
                  <div className="mt-2 p-2 bg-yellow-100 rounded">
                    <code>{result.python_error}</code>
                  </div>
                </details>
                <div className="mt-3 text-yellow-700 text-sm">
                  <p className="font-medium">To enable Python analysis:</p>
                  <ul className="list-disc list-inside mt-1 space-y-1">
                    <li>
                      Run: <code className="bg-yellow-100 px-1 rounded">python scripts/install_cv_dependencies.py</code>
                    </li>
                    <li>
                      Test:{" "}
                      <code className="bg-yellow-100 px-1 rounded">python scripts/test_python_integration.py</code>
                    </li>
                    <li>Ensure Python and OpenCV are properly installed</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {!result && !error && !isScanning && (
          <div className="text-center py-12">
            <Scan className="w-16 h-16 mx-auto mb-4 text-gray-300" />
            <p className="text-gray-500 text-lg">Upload or capture an image to identify rice type</p>
            <p className="text-gray-400 text-sm mt-2">Advanced Python computer vision + JavaScript fallback</p>
            <p className="text-gray-400 text-sm">Make sure the rice grains are clearly visible in good lighting</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
