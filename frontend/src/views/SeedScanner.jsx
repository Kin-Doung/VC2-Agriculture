"use client"

import { useEffect, useRef, useState } from "react"
import Chart from "chart.js/auto"

const SeedScanner = ({ language = "en" }) => {
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const chartRef = useRef(null)
  const [chartInstance, setChartInstance] = useState(null)
  const [error, setError] = useState("")
  const [results, setResults] = useState(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode: "environment",
            width: { ideal: 1280 },
            height: { ideal: 720 },
          },
        })
        if (videoRef.current) {
          videoRef.current.srcObject = stream
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play().catch((err) => {
              setError(
                language === "en" ? `Failed to play video: ${err.message}` : `បរាជ័យក្នុងការចាក់វីដេអូ: ${err.message}`,
              )
            })
          }
        }
      } catch (err) {
        let errorMessage = language === "en" ? "Failed to access camera" : "បរាជ័យក្នុងការចូលប្រើកាមេរ៉ា"
        if (err.name === "NotAllowedError") {
          errorMessage =
            language === "en"
              ? "Camera access denied. Please allow camera permissions."
              : "ការចូលប្រើកាមេរ៉ាត្រូវបានបដិសេធ។ សូមអនុញ្ញាតសិទ្ធិកាមេរ៉ា។"
        } else if (err.name === "NotFoundError") {
          errorMessage =
            language === "en"
              ? "No camera found. Please ensure a camera is connected."
              : "រកមិនឃើញកាមេរ៉ា។ សូមប្រាកដថាមានកាមេរ៉ាតភ្ជាប់។"
        }
        setError(errorMessage)
        console.error("Camera error:", err)
      }
    }
    startCamera()
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop())
      }
    }
  }, [language])

  useEffect(() => {
    if (results && chartRef.current) {
      if (chartInstance) chartInstance.destroy()

      const ctx = chartRef.current.getContext("2d")
      if (!ctx) {
        setError(
          language === "en"
            ? "Failed to initialize chart: Canvas context unavailable"
            : "បរាជ័យក្នុងការចាប់ផ្តើមគំនូសតាង: បរិបទផ្ទាំងក្រណាត់មិនអាចប្រើបាន",
        )
        return
      }
      try {
        const newChart = new Chart(ctx, {
          type: "pie",
          data: {
            labels: Object.keys(results),
            datasets: [
              {
                data: Object.values(results).map((val) => (isNaN(val) || val < 0 ? 0 : val)),
                backgroundColor: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"],
              },
            ],
          },
          options: {
            responsive: true,
            plugins: {
              legend: { position: "top" },
              title: {
                display: true,
                text: language === "en" ? "Rice Type Distribution" : "ការចែកចាយប្រភេទអង្ករ",
              },
            },
          },
        })
        setChartInstance(newChart)
      } catch (err) {
        setError(
          language === "en" ? `Failed to create chart: ${err.message}` : `បរាជ័យក្នុងការបង្កើតគំនូសតាង: ${err.message}`,
        )
        console.error("Chart error:", err)
      }
    }
    return () => {
      if (chartInstance) chartInstance.destroy()
    }
  }, [results, language, chartInstance])

  const captureImage = async () => {
    setIsLoading(true)
    setError("")
    const canvas = canvasRef.current
    const video = videoRef.current

    if (!canvas || !video || !video.videoWidth || !video.videoHeight) {
      setError(language === "en" ? "Canvas or video not available" : "កាមេរ៉ា ឬ ផ្ទាំងក្រណាត់មិនអាចប្រើបាន")
      setIsLoading(false)
      return
    }

    try {
      const context = canvas.getContext("2d")
      if (!context) {
        setError(language === "en" ? "Failed to get canvas context" : "បរាជ័យក្នុងការទទួលបានបរិបទផ្ទាំងក្រណាត់")
        setIsLoading(false)
        return
      }

      canvas.width = video.videoWidth
      canvas.height = video.videoHeight
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      canvas.toBlob(
        async (blob) => {
          if (!blob) {
            setError(language === "en" ? "Failed to create image Blob" : "បរាជ័យក្នុងការបង្កើត Blob រូបភាព")
            setIsLoading(false)
            return
          }

          const formData = new FormData()
          formData.append("file", blob, "capture.jpg")

          try {
            const response = await fetch("http://localhost:8000/classify-rice", {
              method: "POST",
              body: formData,
            })

            if (!response.ok) {
              throw new Error(`Server error: ${response.status}`)
            }

            const data = await response.json()
            if (!data.rice_types) {
              throw new Error("Invalid response format: 'rice_types' missing.")
            }
            setResults(data.rice_types)
            setIsLoading(false)
          } catch (err) {
            setError(
              language === "en" ? `Failed to process image: ${err.message}` : `បរាជ័យក្នុងការដំណើរការរូបភាព: ${err.message}`,
            )
            setIsLoading(false)
          }
        },
        "image/jpeg",
        0.95,
      )
    } catch (err) {
      setError(language === "en" ? `Error capturing image: ${err.message}` : `កំហុសក្នុងការថតរូបភាព: ${err.message}`)
      setIsLoading(false)
    }
  }

  const handleFileUpload = async (e) => {
    setIsLoading(true)
    setError("")
    const file = e.target.files[0]

    if (!file) {
      setError(language === "en" ? "No file selected" : "គ្មានឯកសារត្រូវបានជ្រើសរើស")
      setIsLoading(false)
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("http://localhost:8000/classify-rice", {
        method: "POST",
        body: formData,
      })

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`)
      }

      const data = await response.json()
      if (!data.rice_types) {
        throw new Error("Invalid response format: 'rice_types' missing.")
      }
      setResults(data.rice_types)
      setIsLoading(false)
    } catch (err) {
      setError(
        language === "en" ? `Failed to process image: ${err.message}` : `បរាជ័យក្នុងការដំណើរការរូបភាព: ${err.message}`,
      )
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-2xl overflow-hidden">
        <div className="p-6 sm:p-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-green-800 mb-3">
            {language === "en" ? "Seed Scanner" : "ស្កេនគ្រាប់ពូជ"}
          </h1>
          <p className="text-lg sm:text-xl text-green-600 mb-8 max-w-2xl mx-auto">
            {language === "en"
              ? "Identify seeds using your camera or upload an image for instant classification."
              : "កំណត់អត្តសញ្ញាណគ្រាប់ពូជដោយប្រើកាមេរ៉ា ឬផ្ទុកឡើងរូបភាពសម្រាប់ការចាត់ថ្នាក់ភ្លាមៗ។"}
          </p>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-6" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
          )}
          <div className="bg-gray-50 rounded-lg p-6 sm:p-8 shadow-inner">
            <div className="relative bg-gray-200 rounded-lg overflow-hidden mb-6 aspect-video max-h-[400px] flex items-center justify-center">
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover rounded-lg"
              ></video>
              <div className="absolute inset-0 border-4 border-dashed border-green-500 pointer-events-none flex items-center justify-center bg-black bg-opacity-30">
                <p className="text-white text-xl font-semibold p-3 rounded-md bg-black bg-opacity-60">
                  {language === "en" ? "Place rice grains here" : "ដាក់គ្រាប់អង្ករនៅទីនេះ"}
                </p>
              </div>
            </div>
            <canvas ref={canvasRef} className="hidden"></canvas>
            <div className="flex flex-col sm:flex-row justify-center gap-4 mb-6">
              <button
                onClick={captureImage}
                disabled={isLoading}
                className={`flex items-center justify-center px-6 py-3 rounded-lg text-white font-semibold transition-all duration-300 ${
                  isLoading
                    ? "bg-green-400 cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                }`}
              >
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
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
                    {language === "en" ? "Processing..." : "កំពុងដំណើរការ..."}
                  </>
                ) : (
                  <>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 5a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V7a2 2 0 00-2-2h-1.586a1 1 0 01-.707-.293l-1.121-1.121A2 2 0 0011.172 3H8.828a2 2 0 00-1.414.586L6.293 4.707A1 1 0 015.586 5H4zm6 9a3 3 0 100-6 3 3 0 000 6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {language === "en" ? "Capture & Scan" : "ថតនិងស្កេន"}
                  </>
                )}
              </button>
              <label
                htmlFor="file-upload"
                className={`flex items-center justify-center px-6 py-3 rounded-lg text-white font-semibold transition-all duration-300 cursor-pointer ${
                  isLoading
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L6.707 6.707a1 1 0 01-1.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {language === "en" ? "Upload Image" : "ផ្ទុកឡើងរូបភាព"}
                <input
                  id="file-upload"
                  type="file"
                  accept="image/jpeg,image/png"
                  onChange={handleFileUpload}
                  disabled={isLoading}
                  className="hidden"
                />
              </label>
            </div>
            {results && (
              <div className="mt-8 pt-8 border-t border-gray-200">
                <h2 className="text-2xl font-bold text-green-800 mb-4">
                  {language === "en" ? "Classification Results" : "លទ្ធផលចាត់ថ្នាក់"}
                </h2>
                <p className="text-xl font-bold text-green-700 mb-6">
                  {language === "en" ? "Predicted Type" : "ប្រភេទដែលបានទស្សន៍ទាយ"}:{" "}
                  <span className="text-green-900">
                    {Object.keys(results).reduce((a, b) => (results[a] > results[b] ? a : b))}
                  </span>
                </p>
                <div className="flex flex-col lg:flex-row items-center justify-center gap-8">
                  <div className="w-full max-w-sm lg:w-1/2">
                    <canvas id="riceChart" ref={chartRef} className="w-full h-auto"></canvas>
                  </div>
                  <div className="w-full lg:w-1/2 text-left space-y-2">
                    {Object.entries(results).map(([type, percentage]) => (
                      <p key={type} className="text-gray-700 text-lg">
                        <span className="font-semibold">{type}:</span> {percentage.toFixed(2)}%
                      </p>
                    ))}
                  </div>
                </div>
                <div className="mt-8 pt-6 border-t border-gray-200">
                  <p className="text-lg font-semibold text-gray-800 mb-3">
                    {language === "en" ? "Is the result correct?" : "តើលទ្ធផលត្រឹមត្រូវទេ?"}
                  </p>
                  <div className="flex justify-center gap-4">
                    <button
                      className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 transition-colors duration-200 flex items-center"
                      onClick={() => alert("Feedback: Correct")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {language === "en" ? "Yes" : "បាទ/ចាស"}
                    </button>
                    <button
                      className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors duration-200 flex items-center"
                      onClick={() => alert("Feedback: Incorrect")}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      {language === "en" ? "No" : "ទេ"}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SeedScanner
