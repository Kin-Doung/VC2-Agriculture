"use client"

import { useState, useRef, useEffect } from "react"
import { Camera, Square } from "lucide-react"

export default function CameraCapture({ onImageCapture }) {
  const [isCameraActive, setIsCameraActive] = useState(false)
  const [error, setError] = useState(null)
  const [isCapturing, setIsCapturing] = useState(false)
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const streamRef = useRef(null)

  // Cleanup camera stream when component unmounts
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => {
          track.stop()
        })
      }
    }
  }, [])

  const startCamera = async () => {
    try {
      setError(null)

      // Check if getUserMedia is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Camera access is not supported in this browser")
      }

      // Request camera permission with specific constraints
      const constraints = {
        video: {
          facingMode: { ideal: "environment" }, // Prefer back camera
          width: { ideal: 1280, max: 1920 },
          height: { ideal: 720, max: 1080 },
        },
      }

      console.log("Requesting camera access...")
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      streamRef.current = stream

      if (videoRef.current) {
        videoRef.current.srcObject = stream

        // Wait for video to load
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play()
            setIsCameraActive(true)
            console.log("Camera started successfully")
          }
        }
      }
    } catch (err) {
      console.error("Camera error:", err)
      let errorMessage = "Camera access denied or not available."

      if (err instanceof Error) {
        if (err.name === "NotAllowedError") {
          errorMessage = "Camera permission denied. Please allow camera access and try again."
        } else if (err.name === "NotFoundError") {
          errorMessage = "No camera found on this device."
        } else if (err.name === "NotSupportedError") {
          errorMessage = "Camera is not supported in this browser."
        } else {
          errorMessage = `Camera error: ${err.message}`
        }
      }

      setError(errorMessage)
    }
  }

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => {
        track.stop()
      })
      streamRef.current = null
    }
    setIsCameraActive(false)
    setError(null)
    console.log("Camera stopped")
  }

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current) {
      setError("Camera not ready for capture")
      return
    }

    try {
      setIsCapturing(true)
      const canvas = canvasRef.current
      const video = videoRef.current

      // Set canvas dimensions to match video
      canvas.width = video.videoWidth || 640
      canvas.height = video.videoHeight || 480

      const ctx = canvas.getContext("2d")
      if (!ctx) {
        throw new Error("Could not get canvas context")
      }

      // Draw the current video frame to canvas
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convert to base64 image data with good quality
      const imageData = canvas.toDataURL("image/jpeg", 0.9)

      console.log("Image captured successfully, size:", imageData.length)

      // Pass the captured image to parent component
      onImageCapture(imageData)

      // Stop the camera
      stopCamera()
    } catch (err) {
      console.error("Capture error:", err)
      setError("Failed to capture image. Please try again.")
    } finally {
      setIsCapturing(false)
    }
  }

  return (
    <div className="space-y-3">
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-red-700 text-sm">
          <p className="font-medium mb-1">Camera Error</p>
          <p>{error}</p>
        </div>
      )}

      {!isCameraActive ? (
        <button
          onClick={startCamera}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg font-medium transition-colors"
        >
          <Camera className="w-5 h-5" />
          Use Camera
        </button>
      ) : (
        <div className="space-y-3">
          <div className="relative bg-black rounded-lg overflow-hidden">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-64 object-cover" />

            {/* Camera overlay */}
            <div className="absolute inset-0 border-2 border-white/30 rounded-lg">
              <div className="absolute top-4 left-4 right-4 text-center">
                <p className="text-white text-sm bg-black/50 px-2 py-1 rounded">Position rice grains in the frame</p>
              </div>

              {/* Focus guide */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-32 h-32 border-2 border-white/50 rounded-lg"></div>
              </div>
            </div>
          </div>

          <div className="flex gap-2">
            <button
              onClick={captureImage}
              disabled={isCapturing}
              className="flex-1 flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              <Square className="w-4 h-4" />
              {isCapturing ? "Capturing..." : "Capture"}
            </button>
            <button
              onClick={stopCamera}
              className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />
    </div>
  )
}
