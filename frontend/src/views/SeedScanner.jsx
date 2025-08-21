
"use client"

import { useState, useEffect } from "react"
import CameraCapture from "../components/ScantTypeOfRice/CameraCapture"
import ImageUpload from "../components/ScantTypeOfRice/ImageUpload"
import { Camera, Upload, ScanSearch } from "lucide-react"

// Placeholder UI components
const Card = ({ children, className }) => (
  <div className={`border rounded-lg shadow-sm bg-white ${className}`}>{children}</div>
)
const CardHeader = ({ children }) => <div className="p-4 border-b">{children}</div>
const CardTitle = ({ children, className }) => <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>
const CardContent = ({ children, className }) => <div className={`p-4 ${className}`}>{children}</div>
const Button = ({ children, className, variant, ...props }) => {
  let baseClasses = "px-4 py-2 rounded-lg"
  if (variant === "outline") {
    baseClasses += " border border-gray-300 hover:bg-gray-50"
  } else if (variant === "ghost") {
    baseClasses += " hover:bg-gray-100"
  } else {
    baseClasses += " bg-green-600 text-white hover:bg-green-700"
  }
  return (
    <button className={`${baseClasses} ${className}`} {...props}>
      {children}
    </button>
  )
}

// RiceComparisonTool component
const RiceComparisonTool = ({ userImage, detectedType, scannedFeatures, referenceData }) => {
  const varietyName = detectedType ? detectedType.replace(" (Mixed)", "") : "Unknown";
  return (
    <Card className="mt-6">
      <CardHeader>
        <CardTitle>Paddy Comparison Tool</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Scanned Paddy */}
          <div>
            <h3 className="text-lg font-semibold text-green-700 mb-2">Scanned Paddy</h3>
            {userImage ? (
              <img
                src={userImage}
                alt="Scanned Paddy"
                className="w-full max-w-md rounded-lg shadow mb-4 object-cover"
                onError={(e) => {
                  e.target.src = "/placeholder.svg";
                  console.error("Scanned image load error:", userImage);
                }}
              />
            ) : (
              <p className="text-gray-500">No scanned image available</p>
            )}
            <p className="text-sm font-medium">Detected Variety: <span className="text-green-800">{detectedType || "N/A"}</span></p>
            {scannedFeatures && (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-600">Scanned Features</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>Average Length: {scannedFeatures.avg_length ? `${scannedFeatures.avg_length.toFixed(2)} pixels` : "N/A"}</li>
                  <li>Average Width: {scannedFeatures.avg_width ? `${scannedFeatures.avg_width.toFixed(2)} pixels` : "N/A"}</li>
                  <li>Length/Width Ratio: {scannedFeatures.avg_ratio ? scannedFeatures.avg_ratio.toFixed(2) : "N/A"}</li>
                  <li>Shape Factor: {scannedFeatures.avg_shape_factor ? scannedFeatures.avg_shape_factor.toFixed(2) : "N/A"}</li>
                </ul>
              </div>
            )}
          </div>
          {/* Reference Paddy */}
          <div>
            <h3 className="text-lg font-semibold text-green-700 mb-2">Reference Paddy ({varietyName})</h3>
            {referenceData && referenceData.reference_image_base64 ? (
              <img
                src={`data:image/jpeg;base64,${referenceData.reference_image_base64}`}
                alt={`Reference ${varietyName}`}
                className="w-full max-w-md rounded-lg shadow mb-4 object-cover"
                onError={(e) => {
                  e.target.src = "/placeholder.svg";
                  console.error("Reference image load error:", varietyName);
                }}
              />
            ) : (
              <p className="text-gray-500">No reference image available</p>
            )}
            {referenceData ? (
              <div className="mt-4">
                <h4 className="text-sm font-medium text-gray-600">Reference Features</h4>
                <ul className="text-sm text-gray-700 space-y-1">
                  <li>Length: {referenceData.length_mm ? `${referenceData.length_mm.toFixed(2)} mm` : "N/A"}</li>
                  <li>Width: {referenceData.width_mm ? `${referenceData.width_mm.toFixed(2)} mm` : "N/A"}</li>
                  <li>Length/Width Ratio: {referenceData.length_width_ratio ? referenceData.length_width_ratio.toFixed(2) : "N/A"}</li>
                  <li>Shape Factor: {referenceData.shape_factor ? referenceData.shape_factor.toFixed(2) : "N/A"}</li>
                </ul>
              </div>
            ) : (
              <p className="text-gray-500 mt-4">No reference data available</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

// Helper function for percentages
const getAdjustedPercentages = (mixed, pure, hasResult) => {
  let displayMixed = mixed || 0
  let displayPure = pure || 0

  if (!hasResult) {
    displayMixed = 0
    displayPure = 0
  } else {
    if (displayMixed >= displayPure) {
      if (displayPure === 0) {
        displayMixed = 0
      } else {
        displayMixed = Math.max(0, displayPure - 20.00)
      }
    }
  }
  return { displayMixed, displayPure }
}

// ScanResults component
const ScanResults = ({ result, error, isScanning }) => {
  if (isScanning) {
    return (
      <Card>
        <CardContent>
          <p className="text-gray-600 flex items-center justify-center py-8 text-lg font-medium">
            <svg className="animate-spin h-6 w-6 mr-3 text-green-600" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Analyzing Paddy... Please wait.
          </p>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    )
  }

  const hasResult = result && typeof result === "object"
  const paddy_name = hasResult ? result.paddy_name || "N/A" : "N/A"
  const good_paddy_score = hasResult ? result.good_paddy_score || 0 : 0
  const last_scan_time = hasResult ? result.last_scan_time || "N/A" : "N/A"

  const { displayMixed, displayPure } = getAdjustedPercentages(
    result?.mixed_paddy_percent,
    result?.pure_paddy_percent,
    hasResult,
  )

  const normalized_pure = Math.min(Math.max(displayPure, 0), 100)
  const normalized_mixed = Math.min(Math.max(displayMixed, 0), 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Scan Results</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <p className="text-sm text-gray-600">Paddy Name</p>
          <p className="text-xl font-bold text-green-800">{paddy_name}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Percentage of Mixed Paddy</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-red-600 h-2.5 rounded-full" style={{ width: `${normalized_mixed}%` }}></div>
          </div>
          <p className="text-lg font-semibold mt-1">{normalized_mixed.toFixed(2)}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">
            {paddy_name !== "N/A" ? paddy_name : "Pure Paddy"} Percentage of Pure Paddy Type
          </p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${normalized_pure}%` }}></div>
          </div>
          <p className="text-lg font-semibold mt-1">{normalized_pure.toFixed(2)}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Good Paddy Score</p>
          <p className="text-lg font-semibold">{good_paddy_score.toFixed(2)}%</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Last Scan Time</p>
          <p className="text-sm text-gray-500">{last_scan_time}</p>
        </div>
      </CardContent>
    </Card>
  )
}

export default function SeedScanner() {
  const [selectedImage, setSelectedImage] = useState(null)
  const [isScanning, setIsScanning] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [scanHistory, setScanHistory] = useState([])
  const [isServerReachable, setIsServerReachable] = useState(false)

  // Check server connectivity
  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/health", {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        })
        setIsServerReachable(response.ok)
      } catch (e) {
        console.error("Server check failed:", e.message)
        setIsServerReachable(false)
      }
    }
    checkServer()
    const interval = setInterval(checkServer, 5000)
    return () => clearInterval(interval)
  }, [])

  const scanSeed = async () => {
    if (!selectedImage) {
      setError("Please select or capture an image.")
      return
    }

    if (!isServerReachable) {
      setError("Server is unreachable. Please ensure the backend is running at http://127.0.0.1:5000.")
      return
    }

    if (!selectedImage.startsWith("data:image/")) {
      setError("Invalid image format. Please use a JPG or PNG image.")
      return
    }

    setIsScanning(true)
    setError(null)
    setResult(null)

    try {
      console.log("Scan initiated at", new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }))

      const compressedImage = await compressImage(selectedImage)
      if (!compressedImage.startsWith("data:image/")) {
        throw new Error("Invalid image data after compression.")
      }
      console.log("Compressed image length:", compressedImage.length, "Sample:", compressedImage.substring(0, 50))

      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000)

      const response = await fetch("http://127.0.0.1:5000/api/scan-rice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: compressedImage }),
        signal: controller.signal,
      })

      clearTimeout(timeoutId)

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Server error" }))
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const data = await response.json()
      console.log("Classification result:", data)

      if (!data.success) {
        throw new Error(data.error || "Server returned an error")
      }

      setResult(data)
      const scanRecord = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        image: selectedImage,
        result: data,
      }
      setScanHistory((prev) => [scanRecord, ...prev.slice(0, 9)])
    } catch (err) {
      console.error("Scan error details:", err)
      const errorMessage =
        err.name === "AbortError"
          ? "Request timed out. Please check server connection."
          : err.message.includes("NetworkError")
            ? "Network error. Please check your internet connection."
            : err.message
      setError(`Failed to identify paddy type: ${errorMessage}`)
    } finally {
      setIsScanning(false)
    }
  }

  const compressImage = async (imageDataUrl) => {
  try {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageDataUrl;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);
        const compressedData = canvas.toDataURL("image/jpeg", 0.9);
        resolve(compressedData);
      };
      img.onerror = () => resolve(imageDataUrl); // Fallback to original
    });
  } catch (error) {
    console.error("Compression error:", error);
    return imageDataUrl;
  }
};

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

  const { displayMixed: summaryMixed, displayPure: summaryPure } = getAdjustedPercentages(
    result?.mixed_paddy_percent,
    result?.pure_paddy_percent,
    !!result,
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-green-800 mb-2">Paddy Scanner</h1>
          <p className="text-gray-600">
            Identify paddy types, including pure and mixed varieties, with AI-powered analysis
          </p>
          {error && !isServerReachable && (
            <p className="text-red-600 mt-2">
              Server check failed. Ensure backend is running at http://127.0.0.1:5000.
            </p>
          )}
          <div className="flex justify-center gap-4 mt-4 flex-wrap">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <span className="text-sm text-gray-600">Total Scans: </span>
              <span className="font-semibold text-green-600">{scanHistory.length}</span>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <span className="text-sm text-gray-600">Last Result: </span>
              <span className="font-semibold text-blue-600">{result?.paddy_name || "N/A"}</span>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <span className="text-sm text-gray-600">Mixed Paddy: </span>
              <span className="font-semibold text-red-600">{summaryMixed.toFixed(2)}%</span>
            </div>
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <span className="text-sm text-gray-600">Pure Paddy: </span>
              <span className="font-semibold text-green-600">{summaryPure.toFixed(2)}%</span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Initiate Paddy Scan</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {!selectedImage && (
                  <div className="space-y-6 text-center">
                    <ScanSearch className="w-16 h-16 mx-auto text-green-600 mb-4" />
                    <h3 className="text-xl font-semibold text-green-700 mb-2">Ready to Analyze Your Paddy?</h3>
                    <p className="text-gray-600">
                      Place your paddy sample, then capture an image or upload from your gallery to begin the analysis.
                    </p>
                    <div className="grid gap-4">
                      <CameraCapture onImageCapture={setSelectedImage}>
                        <Button className="w-full py-6 text-lg bg-green-600 hover:bg-green-700 text-white">
                          <Camera className="w-6 h-6 mr-2" />
                          Capture Image
                        </Button>
                      </CameraCapture>
                      <div className="relative flex items-center justify-center">
                        <div className="flex-grow border-t border-gray-300"></div>
                        <span className="flex-shrink mx-4 text-gray-500 text-sm">OR</span>
                        <div className="flex-grow border-t border-gray-300"></div>
                      </div>
                      <ImageUpload onImageUpload={setSelectedImage}>
                        <Button className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700 text-white">
                          <Upload className="w-6 h-6 mr-2" />
                          Upload from Gallery
                        </Button>
                      </ImageUpload>
                    </div>
                    <div className="text-sm text-gray-500 text-center pt-4 border-t">
                      <p>Ensure good lighting and clear focus for accurate results.</p>
                    </div>
                  </div>
                )}

                {selectedImage && (
                  <div className="space-y-3">
                    <img
                      src={selectedImage || "/placeholder.svg"}
                      alt="Selected paddy"
                      className="w-full rounded-lg border max-h-64 object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg"
                        console.error("Image load error:", selectedImage)
                      }}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={scanSeed}
                        disabled={isScanning || !isServerReachable}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white"
                      >
                        {isScanning ? (
                          <span className="flex items-center justify-center">
                            <svg
                              className="animate-spin h-5 w-5 mr-2"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <circle
                                className="opacity-25"
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentColor"
                                strokeWidth="4"
                              ></circle>
                              <path
                                className="opacity-75"
                                fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                              ></path>
                            </svg>
                            Scanning...
                          </span>
                        ) : (
                          "Scan Paddy"
                        )}
                      </Button>
                      <Button onClick={resetScanner} variant="outline" className="px-4 py-2 bg-transparent">
                        Reset
                      </Button>
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button
                      onClick={() => document.querySelector('input[type="file"]')?.click()}
                      variant="ghost"
                      className="w-full justify-start text-sm text-blue-600 hover:text-blue-800"
                    >
                      📁 Upload from Gallery
                    </Button>
                    <Button
                      onClick={clearHistory}
                      disabled={scanHistory.length === 0}
                      variant="ghost"
                      className="w-full justify-start text-sm text-red-600 hover:text-red-800 disabled:text-gray-400"
                    >
                      🗑️ Clear History
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

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
                          onError={(e) => {
                            e.target.src = "/placeholder.svg"
                            console.error("History image load error:", item.image)
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{item.result.paddy_name}</p>
                          <p className="text-xs text-gray-500">
                            Pure: {item.result.pure_paddy_percent}% / Mixed: {item.result.mixed_paddy_percent}%
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <div className="lg:col-span-3">
            <ScanResults result={result} error={error} isScanning={isScanning} />
            {selectedImage && (
              <RiceComparisonTool
                userImage={selectedImage}
                detectedType={result?.paddy_name}
                scannedFeatures={result?.scanned_features}
                referenceData={result?.reference_data}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
