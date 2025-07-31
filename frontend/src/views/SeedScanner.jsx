"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

import CameraCapture from '../components/ScantTypeOfRice/camera-capture';
import ImageUpload from '../components/ScantTypeOfRice/image-upload';
import ScanResults from '../components/ScantTypeOfRice/scan-results';
import RiceTypesReference from '../components/ScantTypeOfRice/rice-types-reference';
import RiceComparisonTool from '../components/ScantTypeOfRice/rice-comparison-tool';
import DebugPanel from '../components/ScantTypeOfRice/debug-panel';


export default function SeedScanner() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [scanHistory, setScanHistory] = useState([])

  const scanSeed = async () => {
    if (!selectedImage) return

    setIsScanning(true)
    setError(null)
    setResult(null)

    try {
      console.log("Starting seed scan...")

      const response = await fetch("/api/scan-rice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: selectedImage }),
      })

      console.log("API response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("API error:", errorData)
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      console.log("Classification result:", data)

      if (data.error) {
        throw new Error(data.error)
      }

      setResult(data)

      // Add to scan history
      const scanRecord = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        image: selectedImage,
        result: data,
        confidence: data.confidence,
      }
      setScanHistory((prev) => [scanRecord, ...prev.slice(0, 9)]) // Keep last 10 scans
    } catch (err) {
      console.error("Scan error:", err)
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred"
      setError(`Failed to identify seed type: ${errorMessage}. Please try again with a clearer image.`)
    } finally {
      setIsScanning(false)
    }
  }

  const resetScanner = () => {
    setSelectedImage(null)
    setResult(null)
    setError(null)
  }

  const loadFromHistory = (historyItem) => {
    setSelectedImage(historyItem.image)
    setResult(historyItem.result)
    setError(null)
  }

  const clearHistory = () => {
    setScanHistory([])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">Seed Scanner</h1>
          <p className="text-gray-600">Identify rice and seed types using AI-powered image recognition</p>
          <div className="flex justify-center gap-4 mt-4">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <span className="text-sm text-gray-600">Total Scans: </span>
              <span className="font-semibold text-green-600">{scanHistory.length}</span>
            </div>
            {result && (
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                <span className="text-sm text-gray-600">Last Result: </span>
                <span className="font-semibold text-blue-600">{result.type}</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Image Capture Section */}
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Capture Seed Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!selectedImage && (
                  <>
                    <CameraCapture onImageCapture={setSelectedImage} />
                    <div className="text-center text-gray-500">or</div>
                    <ImageUpload onImageUpload={setSelectedImage} />
                  </>
                )}

                {selectedImage && (
                  <div className="space-y-3">
                    <img
                      src={selectedImage || "/placeholder.svg"}
                      alt="Selected seed"
                      className="w-full rounded-lg border max-h-64 object-cover"
                    />
                    <div className="flex gap-2">
                      <button
                        onClick={scanSeed}
                        disabled={isScanning}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                      >
                        {isScanning ? "Scanning..." : "Scan Seed"}
                      </button>
                      <button
                        onClick={resetScanner}
                        className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Actions</h4>
                  <div className="space-y-2">
                    <button
                      onClick={() => document.querySelector('input[type="file"]')?.click()}
                      className="w-full text-left text-sm text-blue-600 hover:text-blue-800 py-1"
                    >
                      📁 Upload from Gallery
                    </button>
                    <button
                      onClick={clearHistory}
                      disabled={scanHistory.length === 0}
                      className="w-full text-left text-sm text-red-600 hover:text-red-800 disabled:text-gray-400 py-1"
                    >
                      🗑️ Clear History
                    </button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Scan History */}
            {scanHistory.length > 0 && (
              <Card className="mt-4">
                <CardHeader>
                  <CardTitle className="text-sm">Recent Scans</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-64 overflow-y-auto">
                    {scanHistory.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => loadFromHistory(item)}
                        className="flex items-center gap-2 p-2 rounded border hover:bg-gray-50 cursor-pointer"
                      >
                        <img
                          src={item.image || "/placeholder.svg"}
                          alt="History item"
                          className="w-8 h-8 object-cover rounded"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{item.result.type}</p>
                          <p className="text-xs text-gray-500">{(item.confidence * 100).toFixed(0)}% confidence</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Results Section */}
          <div className="lg:col-span-3">
            <ScanResults result={result} error={error} isScanning={isScanning} />
          </div>
        </div>

        {/* Seed Comparison Tool */}
        {selectedImage && (
          <RiceComparisonTool userImage={selectedImage} detectedType={result?.type} title="Seed Comparison Tool" />
        )}

        {/* Seed Types Reference */}
        <div className="mt-8">
          <RiceTypesReference title="Seed Types Reference Guide" />
        </div>

        {/* Debug Panel - Remove in production */}
        <div className="mt-8">
          <DebugPanel />
        </div>
      </div>
    </div>
  )
}

// Export for use in other components
export { SeedScanner }
