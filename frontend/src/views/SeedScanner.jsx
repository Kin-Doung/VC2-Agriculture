import { useState, useEffect } from "react";
import CameraCapture from "../components/ScantTypeOfRice/CameraCapture";
import ImageUpload from "../components/ScantTypeOfRice/ImageUpload";
import RiceComparisonTool from "../components/ScantTypeOfRice/RiceComparisonTool";

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

// Enhanced ScanResults component
const ScanResults = ({ result, error, isScanning }) => {
  if (isScanning) {
    return (
      <Card>
        <CardContent>
          <p className="text-gray-600">Scanning in progress...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardContent>
          <p className="text-red-600">{error}</p>
        </CardContent>
      </Card>
    );
  }

  if (!result || typeof result !== "object") {
    return (
      <Card>
        <CardContent>
          <p className="text-gray-600">No scan results yet. Please scan an image.</p>
        </CardContent>
      </Card>
    );
  }

  const { paddy_name = "Unknown", type = "Unknown", bad_paddy_percent = null } = result;
  const lastScanTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" });

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
          <p className="text-sm text-gray-600">Paddy Type</p>
          <p className="text-lg font-semibold">{type}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Bad Paddy (%)</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-red-600 h-2.5 rounded-full"
              style={{ width: `${bad_paddy_percent !== null ? bad_paddy_percent : 0}%` }}
            ></div>
          </div>
          <p className="text-lg font-semibold mt-1">{bad_paddy_percent !== null ? `${bad_paddy_percent}%` : "N/A"}</p>
        </div>
        <div>
          <p className="text-sm text-gray-600">Last Scan Time</p>
          <p className="text-sm text-gray-500">{lastScanTime}</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default function SeedScanner() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [scanHistory, setScanHistory] = useState([]);
  const [isServerReachable, setIsServerReachable] = useState(false);

  // Check server connectivity with GET instead of HEAD
  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await fetch("http://127.0.0.1:5000/api/scan-rice", {
          method: "GET",
          mode: "no-cors",
        });
        setIsServerReachable(response.status < 400); // Accept any 2xx or 3xx status
      } catch (e) {
        console.error("Server check failed:", e);
        setIsServerReachable(false);
      }
    };
    checkServer();
    const interval = setInterval(checkServer, 5000); // Check every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const scanSeed = async () => {
    if (!selectedImage) {
      setError("Please select or capture an image.");
      return;
    }

    if (!isServerReachable) {
      setError("Server is unreachable. Please ensure the backend is running at http://127.0.0.1:5000.");
      return;
    }

    setIsScanning(true);
    setError(null);
    setResult(null);

    try {
      console.log("Scan initiated at", new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));

      const compressedImage = await compressImage(selectedImage);
      if (!compressedImage.startsWith("data:image/")) {
        throw new Error("Invalid image data after compression.");
      }
      console.log("Compressed image length:", compressedImage.length, "Sample:", compressedImage.substring(0, 50));

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

      const response = await fetch("http://127.0.0.1:5000/api/scan-rice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: compressedImage }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      console.log("API response status:", response.status, "URL:", response.url);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Server error" }));
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
      };
      setScanHistory((prev) => [scanRecord, ...prev.slice(0, 9)]);
    } catch (err) {
      console.error("Scan error details:", err);
      const errorMessage = err.message.includes("abort")
        ? "Request timed out. Please check server connection."
        : err.message.includes("NetworkError")
        ? "Network error. Please check your internet connection."
        : err.message;
      setError(`Failed to identify paddy type: ${errorMessage}`);
    } finally {
      setIsScanning(false);
    }
  };

  const compressImage = async (imageDataUrl) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.src = imageDataUrl;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        canvas.width = 800;
        canvas.height = (img.height / img.width) * 800;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const compressedData = canvas.toDataURL("image/jpeg", 0.7);
        resolve(compressedData);
      };
      img.onerror = () => {
        console.error("Image load failed:", imageDataUrl);
        resolve(imageDataUrl); // Fallback to original
      };
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
          <h1 className="text-4xl font-bold text-green-800 mb-2">Paddy Scanner</h1>
          <p className="text-gray-600">Identify paddy types, including pure and mixed varieties, with AI-powered analysis</p>
          {error && !isServerReachable && (
            <p className="text-red-600 mt-2">Server check failed. Ensure backend is running at http://127.0.0.1:5000.</p>
          )}
          <div className="flex justify-center gap-4 mt-4">
            <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
              <span className="text-sm text-gray-600">Total Scans: </span>
              <span className="font-semibold text-green-600">{scanHistory.length}</span>
            </div>
            {result && (
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                <span className="text-sm text-gray-600">Last Result: </span>
                <span className="font-semibold text-blue-600">{result.paddy_name} ({result.type})</span>
              </div>
            )}
            {result && result.bad_paddy_percent !== null && (
              <div className="bg-white rounded-lg px-4 py-2 shadow-sm">
                <span className="text-sm text-gray-600">Bad Paddy: </span>
                <span className="font-semibold text-red-600">{result.bad_paddy_percent}%</span>
              </div>
            )}
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Capture Paddy Image</CardTitle>
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
                      alt="Selected paddy"
                      className="w-full rounded-lg border max-h-64 object-cover"
                      onError={(e) => {
                        e.target.src = "/placeholder.svg";
                        console.error("Image load error:", selectedImage);
                      }}
                    />
                    <div className="flex gap-2">
                      <Button
                        onClick={scanSeed}
                        disabled={isScanning || !isServerReachable}
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
                                stroke="currentColor"
                                strokeWidth="4"
                                fill="none"
                              />
                            </svg>
                            Scanning...
                          </span>
                        ) : (
                          "Scan Paddy"
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
                  <h4 className="text-sm font-medium text-gray-600 mb-2">Quick Actions</h4>
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
                          onError={(e) => {
                            e.target.src = "/placeholder.svg";
                            console.error("History image load error:", item.image);
                          }}
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-medium truncate">{item.result.paddy_name} ({item.result.type})</p>
                          <p className="text-xs text-gray-500">
                            Bad: {item.result.bad_paddy_percent ? `${item.result.bad_paddy_percent}%` : "N/A"}
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
            detectedType={result?.paddy_name}
            title="Paddy Comparison Tool"
          />
        )}
      </div>
    </div>
  );
}