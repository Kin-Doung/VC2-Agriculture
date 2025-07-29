import { useState } from "react";
import CameraCapture from "../components/ScantTypeOfRice/CameraCapture";
import ImageUpload from "../components/ScantTypeOfRice/ImageUpload";
import ScanResults from "../components/ScantTypeOfRice/ScanResults";
import RiceTypesReference from "../components/ScantTypeOfRice/RiceTypesReference";
import RiceComparisonTool from "../components/ScantTypeOfRice/RiceComparisonTool";
import DebugPanel from "../components/ScantTypeOfRice/DebugPanel";

// Placeholder UI components
const Card = ({ children, className }) => (
  <div className={`border rounded-lg shadow-sm bg-white ${className}`}>{children}</div>
);
const CardHeader = ({ children }) => <div className="p-4 border-b">{children}</div>;
const CardTitle = ({ children, className }) => (
  <h2 className={`text-lg font-semibold ${className}`}>{children}</h2>
);
const CardContent = ({ children, className }) => (
  <div className={`p-4 ${className}`}>{children}</div>
);
const Button = ({ children, className, ...props }) => (
  <button className={`px-4 py-2 rounded-lg ${className}`} {...props}>
    {children}
  </button>
);

export default function SeedScanner() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);

  const scanSeed = async () => {
    if (!selectedImage) {
      setError("Please select or capture an image.");
      return;
    }

    setIsScanning(true);
    setError(null);
    setResult(null);

    try {
      console.log("Starting seed scan...");

      const compressedImage = await compressImage(selectedImage);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

      const response = await fetch("http://localhost:5000/api/scan-rice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: compressedImage }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log("API response status:", response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error("API error:", errorData);
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log("Classification result:", data);

      if (data.error) {
        throw new Error(data.error);
      }

      setResult(data);
      const scanRecord = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        image: selectedImage,
        result: data,
        confidence: data.confidence,
      };
      setScanHistory((prev) => [scanRecord, ...prev.slice(0, 9)]);
    } catch (err) {
      console.error("Scan error:", err);
      const errorMessage = err instanceof Error ? err.message : "Unknown error occurred";
      setError(`Failed to identify seed type: ${errorMessage}. Please try again with a clearer image.`);
    } finally {
      setIsScanning(false);
    }
  };

  const compressImage = async (imageDataUrl) => {
    const img = new Image();
    img.src = imageDataUrl;
    return new Promise((resolve) => {
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 800;
        canvas.height = (img.height / img.width) * 800;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL("image/jpeg", 0.7));
      };
      img.onerror = () => resolve(imageDataUrl);
    });
  };

  const resetScanner = () => {
    setSelectedImage(null);
    setResult(null);
    setError(null);
  };

  const loadFromHistory = (historyItem) => {
    setSelectedImage(historyItem.image);
    setResult(historyItem.result);
    setError(null);
  };

  const clearHistory = () => {
    setScanHistory([]);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-amber-50 p-4">
      <div className="max-w-7xl mx-auto">
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
                      <Button
                        onClick={scanSeed}
                        disabled={isScanning}
                        className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white"
                      >
                        {isScanning ? (
                          <span className="flex items-center">
                            <svg
                              className="animate-spin h-5 w-5 mr-2"
                              viewBox="0 0 24 24"
                            >
                              <circle
                                cx="12"
                                cy="12"
                                r="10"
                                stroke="currentContent"
                                strokeWidth="4"
                                fill="none"
                              />
                            </svg>
                            Scanning...
                          </span>
                        ) : (
                          "Scan Seed"
                        )}
                      </Button>
                      <Button
                        onClick={resetScanner}
                        className="px-4 py-2 border border-gray-300 hover:bg-gray-50"
                      >
                        Reset
                      </Button>
                    </div>
                  </div>
                )}

                <div className="border-t pt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Quick Actions</h4>
                  <div className="space-y-2">
                    <Button
                      onClick={() => document.querySelector('input[type="file"]')?.click()}
                      className="w-full text-left text-sm text-blue-600 hover:text-blue-800"
                    >
                      📁 Upload from Gallery
                    </Button>
                    <Button
                      onClick={clearHistory}
                      disabled={scanHistory.length === 0}
                      className="w-full text-left text-sm text-red-600 hover:text-red-800 disabled:text-gray-400"
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
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{item.result.type}</p>
                          <p className="text-xs text-gray-500">
                            {(item.confidence * 100).toFixed(0)}% confidence
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
          </div>
        </div>

        {selectedImage && (
          <RiceComparisonTool
            userImage={selectedImage}
            detectedType={result?.type}
            title="Seed Comparison Tool"
          />
        )}
      </div>
    </div>
  );
}