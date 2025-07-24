import React, { useRef, useState, useEffect } from 'react'
import Webcam from 'react-webcam'
import * as mobilenet from '@tensorflow-models/mobilenet'
import '@tensorflow/tfjs'

const SeedScanner = ({ language }) => {
  const webcamRef = useRef(null)
  const [model, setModel] = useState(null)
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [modelLoading, setModelLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(null)
  const [imageElement, setImageElement] = useState(null)
  const [showCamera, setShowCamera] = useState(false)

  // Load ML model
  useEffect(() => {
    mobilenet.load().then(m => {
      setModel(m)
      setModelLoading(false)
    })
  }, [])

  const getFruitQuality = (conf) => {
    if (conf >= 80) return language === 'en' ? 'Good' : 'ល្អ'
    if (conf >= 50) return language === 'en' ? 'Average' : 'មធ្យម'
    return language === 'en' ? 'Bad' : 'អន់'
  }

  const runPrediction = async (imgEl) => {
    if (!model) return
    setLoading(true)
    const predictions = await model.classify(imgEl)
    setLoading(false)
    if (predictions.length > 0) {
      const conf = predictions[0].probability * 100
      setResult({
        label: predictions[0].className,
        confidence: conf.toFixed(2),
        quality: getFruitQuality(conf),
      })
      setShowCamera(false) 
    } else {
      setResult(null)
    }
  }

  const captureAndPredict = () => {
    if (!webcamRef.current) return
    const imageSrc = webcamRef.current.getScreenshot()
    if (!imageSrc) {
      alert(language === 'en' ? 'Camera not working' : 'កាមេរ៉ាមិនដំណើរការ')
      return
    }
    const img = new Image()
    img.src = imageSrc
    img.onload = () => {
      setImageElement(img)
      runPrediction(img)
    }
  }

  const handleImageChange = (event) => {
    const file = event.target.files[0]
    if (file) {
      const imgURL = URL.createObjectURL(file)
      setSelectedImage(imgURL)
      setResult(null)
      setImageElement(null)
      setShowCamera(false)
      const img = new Image()
      img.src = imgURL
      img.onload = () => setImageElement(img)
    }
  }

  const scanSelectedImage = () => {
    if (imageElement) runPrediction(imageElement)
  }

  const handleCancel = () => {
    setSelectedImage(null)
    setResult(null)
    setImageElement(null)
    setShowCamera(false)
  }

  const handleBack = () => {
    setResult(null)
    setSelectedImage(null)
    setImageElement(null)
    setShowCamera(false)
  }

  return (
    <div className="p-6 max-w-md mx-auto text-center">
      <h1 className="text-3xl font-bold text-green-800 mb-4">
        {language === 'en' ? 'Fruit Scanner' : 'ស្កេនផ្លែឈើ'}
      </h1>

      {/* If result is shown, only show result and back button */}
      {result && !loading ? (
        <>
          <div className="mt-6 text-left bg-gray-100 p-4 rounded">
            <p>
              {language === 'en' ? 'Fruit Name' : 'ឈ្មោះផ្លែឈើ'}: <strong>{result.label}</strong>
            </p>
            <p>
              {language === 'en' ? 'Quality' : 'គុណភាព'}: <strong>{result.quality}</strong>
            </p>
            <p>
              {language === 'en' ? 'Confidence' : 'ភាពជឿជាក់'}: <strong>{result.confidence}%</strong>
            </p>
          </div>
          <button
            onClick={handleBack}
            className="mt-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            {language === 'en' ? 'Back' : 'ត្រឡប់ក្រោយ'}
          </button>
        </>
      ) : (
        <>
          {/* Start camera button */}
          {!showCamera && !selectedImage && (
            <button
              onClick={() => setShowCamera(true)}
              className="mb-4 px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              {language === 'en' ? 'Start Camera Scan' : 'ចាប់ផ្តើមស្កេនដោយកាមេរ៉ា'}
            </button>
          )}

          {/* Webcam view */}
          {showCamera && (
            <>
              <Webcam
                ref={webcamRef}
                audio={false}
                screenshotFormat="image/jpeg"
                width={320}
                videoConstraints={{ facingMode: 'environment' }}
                className="rounded border mx-auto"
              />
              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={captureAndPredict}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  disabled={loading || modelLoading}
                >
                  {language === 'en' ? 'Scan fruit' : 'ស្កេន'}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  {language === 'en' ? 'Cancel' : 'បោះបង់'}
                </button>
              </div>
            </>
          )}

          {/* Upload section */}
          <div className="mt-6">
            <label className="block mb-2 font-semibold">
              {language === 'en' ? 'Or choose an image:' : 'ឬជ្រើសរូបភាព:'}
            </label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
          </div>

          {/* Image preview and scan */}
          {selectedImage && (
            <>
              <img
                src={selectedImage}
                alt="Selected"
                className="mt-4 mx-auto rounded border"
                style={{ maxWidth: '320px' }}
              />
              <div className="mt-4 flex justify-center gap-4">
                <button
                  onClick={scanSelectedImage}
                  className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                  disabled={loading || modelLoading}
                >
                  {language === 'en' ? 'Scan fruit' : 'ស្កេន'}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  {language === 'en' ? 'Cancel' : 'បោះបង់'}
                </button>
              </div>
            </>
          )}
        </>
      )}
    </div>
  )
}

export default SeedScanner
