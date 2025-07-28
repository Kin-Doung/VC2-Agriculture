"use client"

import { useRef } from "react"
import { Upload } from "lucide-react"

export default function ImageUpload({ onImageUpload }) {
  const fileInputRef = useRef(null)

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0]
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file")
        return
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB")
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result
        onImageUpload(result)
      }
      reader.onerror = () => {
        alert("Error reading file")
      }
      reader.readAsDataURL(file)
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <div>
      <button
        onClick={triggerFileInput}
        className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-300 hover:border-gray-400 px-4 py-8 rounded-lg transition-colors"
      >
        <Upload className="w-6 h-6 text-gray-500" />
        <div className="text-center">
          <p className="text-gray-700 font-medium">Upload Rice Image</p>
          <p className="text-gray-500 text-sm">JPG, PNG up to 5MB</p>
        </div>
      </button>

      <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
    </div>
  )
}
