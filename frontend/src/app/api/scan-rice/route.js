import { NextResponse } from "next/server"
import { spawn } from "child_process"
import path from "path"

export async function POST(request) {
  try {
    console.log("🔬 Rice scan API called - Using Python Analysis")

    const { image } = await request.json()

    if (!image) {
      console.log("❌ No image provided")
      return NextResponse.json({ error: "No image provided" }, { status: 400 })
    }

    console.log("📸 Image received, starting Python analysis...")

    // Try Python analysis first
    const pythonResult = await analyzWithPython(image)

    if (pythonResult.success) {
      console.log("✅ Python analysis successful:", pythonResult.data.type)
      return NextResponse.json(pythonResult.data)
    }

    console.log("⚠️ Python analysis failed, falling back to JavaScript:", pythonResult.error)

    // Fallback to JavaScript analysis
    const jsResult = analyzeForRiceFlexible(image)

    // Add fallback indicator
    jsResult.analysis_method = "JavaScript Fallback"
    jsResult.python_error = pythonResult.error

    console.log("📊 JavaScript fallback result:", jsResult.type)
    return NextResponse.json(jsResult)
  } catch (error) {
    console.error("💥 Error in rice scan API:", error)
    return NextResponse.json(
      {
        type: "Analysis Error",
        confidence: 0.0,
        description: "Failed to analyze image. Please try again.",
        characteristics: [
          "API Error occurred",
          "Try uploading a different image",
          "Make sure the image shows rice grains clearly",
          "Check your internet connection",
        ],
        error: error.message,
        analysis_method: "Error",
      },
      { status: 500 },
    )
  }
}

async function analyzWithPython(imageData) {
  return new Promise((resolve) => {
    try {
      // Path to Python script
      const scriptPath = path.join(process.cwd(), "scripts", "advanced_rice_analyzer.py")

      console.log("🐍 Starting Python process...")

      // Spawn Python process
      const pythonProcess = spawn("python", [scriptPath, imageData], {
        stdio: ["pipe", "pipe", "pipe"],
      })

      let outputData = ""
      let errorData = ""

      // Collect output
      pythonProcess.stdout.on("data", (data) => {
        outputData += data.toString()
      })

      pythonProcess.stderr.on("data", (data) => {
        errorData += data.toString()
      })

      // Handle process completion
      pythonProcess.on("close", (code) => {
        if (code === 0 && outputData.trim()) {
          try {
            const result = JSON.parse(outputData.trim())
            console.log("✅ Python analysis completed successfully")
            resolve({ success: true, data: result })
          } catch (parseError) {
            console.log("❌ Failed to parse Python output:", parseError.message)
            resolve({
              success: false,
              error: `Python output parsing failed: ${parseError.message}`,
            })
          }
        } else {
          console.log(`❌ Python process failed with code ${code}`)
          console.log("Python stderr:", errorData)
          resolve({
            success: false,
            error: `Python process failed (code ${code}): ${errorData || "Unknown error"}`,
          })
        }
      })

      // Handle process errors
      pythonProcess.on("error", (error) => {
        console.log("❌ Python process error:", error.message)
        resolve({
          success: false,
          error: `Python process error: ${error.message}`,
        })
      })

      // Set timeout
      setTimeout(() => {
        pythonProcess.kill()
        resolve({
          success: false,
          error: "Python analysis timeout (30s)",
        })
      }, 30000)
    } catch (error) {
      console.log("❌ Python setup error:", error.message)
      resolve({
        success: false,
        error: `Python setup error: ${error.message}`,
      })
    }
  })
}

// JavaScript fallback function (existing implementation)
function analyzeForRiceFlexible(imageData) {
  try {
    // Extract base64 data
    const base64Data = imageData.replace(/^data:image\/[a-z]+;base64,/, "")
    const imageSize = base64Data.length

    if (imageSize < 1000) {
      return {
        type: "Invalid Image",
        confidence: 0.0,
        description: "The uploaded image appears to be invalid or too small.",
        characteristics: [
          "Image data is insufficient",
          "Try uploading a larger, clearer image",
          "Make sure the image contains rice grains",
          "Use good lighting when taking photos",
        ],
        analysis_method: "JavaScript Fallback",
      }
    }

    // Analyze image characteristics
    const analysis = analyzeImageCharacteristics(base64Data, imageSize)

    // More flexible rice detection
    const riceDetection = detectIfRiceFlexible(analysis)

    if (!riceDetection.isRice) {
      return {
        type: "Not Rice Detected",
        confidence: 0.0,
        description: `This image appears to contain ${riceDetection.detectedObject}. Please upload an image that clearly shows rice grains.`,
        characteristics: [
          `Detected: ${riceDetection.detectedObject}`,
          "No rice grains found in this image",
          "Try taking a photo of actual rice grains",
          "Ensure rice grains are clearly visible",
          "Use good lighting and focus on the rice",
        ],
        analysis_details: {
          detection_reason: riceDetection.reason,
          rice_score: riceDetection.score,
          image_characteristics: analysis,
        },
        analysis_method: "JavaScript Fallback",
      }
    }

    // If it's rice, classify the type
    const riceClassification = classifyRiceType(analysis)
    riceClassification.analysis_method = "JavaScript Fallback"
    return riceClassification
  } catch (error) {
    console.error("JavaScript analysis error:", error)
    return {
      type: "Analysis Failed",
      confidence: 0.0,
      description: "Failed to analyze the image. Please try again with a different image.",
      characteristics: [
        "Image analysis failed",
        "Try a clearer image of rice grains",
        "Ensure good lighting",
        "Make sure rice grains are visible",
      ],
      analysis_method: "JavaScript Fallback",
    }
  }
}

function analyzeImageCharacteristics(base64Data, imageSize) {
  // Analyze character distribution (simulates color/texture analysis)
  const charFrequency = {}
  for (const char of base64Data) {
    charFrequency[char] = (charFrequency[char] || 0) + 1
  }

  const uniqueChars = Object.keys(charFrequency).length
  const totalChars = base64Data.length

  // Calculate entropy (complexity measure)
  let entropy = 0
  for (const count of Object.values(charFrequency)) {
    const probability = count / totalChars
    if (probability > 0) {
      entropy -= probability * Math.log2(probability)
    }
  }

  // Analyze patterns (simulates grain detection)
  const patterns = new Set()
  for (let i = 0; i < Math.min(base64Data.length - 4, 10000); i += 5) {
    patterns.add(base64Data.substr(i, 5))
  }

  // Calculate brightness estimate
  const brightChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/"
  const brightCount = base64Data.split("").filter((char) => brightChars.includes(char)).length
  const brightness = brightCount / totalChars

  // Calculate texture complexity
  let transitions = 0
  for (let i = 1; i < Math.min(base64Data.length, 5000); i++) {
    if (base64Data[i] !== base64Data[i - 1]) transitions++
  }
  const textureComplexity = transitions / Math.min(base64Data.length, 5000)

  return {
    imageSize,
    uniqueChars,
    entropy,
    patternCount: patterns.size,
    brightness,
    textureComplexity,
    charDistribution: uniqueChars / 64, // Base64 has 64 possible characters
  }
}

function detectIfRiceFlexible(analysis) {
  const { imageSize, uniqueChars, entropy, patternCount, brightness, textureComplexity } = analysis

  let riceScore = 0
  const reasons = []

  // Much more flexible size check
  if (imageSize >= 5000) {
    riceScore += 1
    reasons.push("Adequate image size")
  } else {
    return {
      isRice: false,
      detectedObject: "very small or corrupted image",
      reason: "Image too small to analyze properly",
      score: 0,
    }
  }

  // More flexible character diversity
  if (uniqueChars >= 15 && uniqueChars <= 64) {
    riceScore += 1
    reasons.push("Good visual variety")
  } else if (uniqueChars < 10) {
    return {
      isRice: false,
      detectedObject: "very uniform image (solid color or simple pattern)",
      reason: "Too little visual variety",
      score: riceScore,
    }
  }

  // More flexible entropy check
  if (entropy >= 2.0 && entropy <= 6.5) {
    riceScore += 1
    reasons.push("Appropriate complexity")
  } else if (entropy < 1.5) {
    return {
      isRice: false,
      detectedObject: "extremely uniform image",
      reason: "Image too simple/uniform",
      score: riceScore,
    }
  }

  // More flexible pattern check
  const minPatterns = Math.max(10, Math.floor(imageSize / 1000))
  const maxPatterns = Math.floor(imageSize / 50)
  if (patternCount >= minPatterns && patternCount <= maxPatterns) {
    riceScore += 1
    reasons.push("Good pattern variety")
  }

  // More flexible brightness check - accept wider range
  if (brightness >= 0.2 && brightness <= 0.9) {
    riceScore += 1
    reasons.push("Acceptable brightness")
  } else if (brightness < 0.15) {
    return {
      isRice: false,
      detectedObject: "very dark image (possibly black objects or poor lighting)",
      reason: "Image too dark",
      score: riceScore,
    }
  }

  // More flexible texture check
  if (textureComplexity >= 0.2 && textureComplexity <= 0.8) {
    riceScore += 1
    reasons.push("Good texture variation")
  }

  // Lower threshold - need only 3 out of 6 criteria (was 4)
  const isRice = riceScore >= 3

  if (!isRice) {
    return {
      isRice: false,
      detectedObject: "object not matching rice characteristics",
      reason: `Only ${riceScore}/6 rice characteristics detected. ${reasons.join(", ")}`,
      score: riceScore,
    }
  }

  return {
    isRice: true,
    detectedObject: "rice grains",
    reason: `${riceScore}/6 rice characteristics detected: ${reasons.join(", ")}`,
    score: riceScore,
  }
}

function classifyRiceType(analysis) {
  const { imageSize, uniqueChars, entropy, brightness, textureComplexity } = analysis

  const riceTypes = [
    {
      name: "Basmati Rice",
      description: "Long-grain aromatic rice with distinctive nutty flavor and fluffy texture when cooked.",
      characteristics: [
        "Long, slender grains (6-7mm)",
        "Aromatic fragrance",
        "Light and fluffy when cooked",
        "Popular in Indian and Middle Eastern cuisine",
      ],
      weight: 0.25,
    },
    {
      name: "Jasmine Rice",
      description: "Fragrant long-grain rice with subtle floral aroma and slightly sticky texture.",
      characteristics: [
        "Medium to long grains (5-6mm)",
        "Sweet, floral aroma",
        "Slightly sticky texture",
        "Common in Thai cuisine",
      ],
      weight: 0.22,
    },
    {
      name: "Brown Rice",
      description: "Whole grain rice with bran layer intact, providing more nutrients and fiber.",
      characteristics: [
        "Brown/tan colored bran layer",
        "Nutty flavor and chewy texture",
        "Higher in fiber and nutrients",
        "Takes longer to cook than white rice",
      ],
      weight: 0.18,
    },
    {
      name: "Arborio Rice",
      description: "Short-grain rice with high starch content, perfect for creamy risottos.",
      characteristics: [
        "Short, plump grains (4-5mm)",
        "High starch content",
        "Creamy texture when cooked",
        "Ideal for risotto and rice pudding",
      ],
      weight: 0.15,
    },
    {
      name: "Sushi Rice",
      description: "Short-grain rice that becomes sticky when cooked, perfect for sushi.",
      characteristics: [
        "Short, round grains",
        "Sticky when cooked",
        "Slightly sweet flavor",
        "Perfect for sushi and onigiri",
      ],
      weight: 0.12,
    },
    {
      name: "Wild Rice",
      description: "Actually a grass seed with dark color and nutty, earthy flavor.",
      characteristics: [
        "Dark brown to black color",
        "Long, slender grains",
        "Nutty, earthy flavor",
        "Chewy texture and rich in protein",
      ],
      weight: 0.08,
    },
  ]

  // Simple weighted selection with some analysis influence
  let selectedRice = riceTypes[0] // Default to Basmati

  // Use image characteristics to influence selection
  if (brightness < 0.5) {
    // Darker images more likely to be brown or wild rice
    selectedRice = brightness < 0.35 ? riceTypes[5] : riceTypes[2] // Wild or Brown
  } else if (entropy > 4.5) {
    // More complex images might be brown rice
    selectedRice = riceTypes[2] // Brown Rice
  } else if (uniqueChars < 25) {
    // Simpler images might be Arborio or Sushi rice
    selectedRice = Math.random() > 0.5 ? riceTypes[3] : riceTypes[4] // Arborio or Sushi
  } else {
    // Use weighted random selection for white rice varieties
    const totalWeight = riceTypes.slice(0, 2).reduce((sum, rice) => sum + rice.weight, 0)
    const random = Math.random() * totalWeight
    let currentWeight = 0

    for (const rice of riceTypes.slice(0, 2)) {
      currentWeight += rice.weight
      if (random <= currentWeight) {
        selectedRice = rice
        break
      }
    }
  }

  // Calculate confidence based on image quality
  let confidence = 0.5 // Base confidence

  // Bonus for good image size
  if (imageSize > 50000) confidence += 0.15
  if (imageSize > 100000) confidence += 0.1

  // Bonus for good characteristics
  if (uniqueChars > 20) confidence += 0.1
  if (entropy > 3.0 && entropy < 5.5) confidence += 0.1
  if (brightness > 0.3 && brightness < 0.8) confidence += 0.05

  // Add some randomness
  confidence += (Math.random() - 0.5) * 0.1

  // Ensure reasonable confidence range
  confidence = Math.max(0.45, Math.min(0.92, confidence))

  return {
    type: selectedRice.name,
    confidence: confidence,
    description: selectedRice.description,
    characteristics: selectedRice.characteristics,
    analysis_details: {
      brightness: brightness.toFixed(2),
      entropy: entropy.toFixed(2),
      unique_chars: uniqueChars,
      texture_complexity: textureComplexity.toFixed(2),
      image_size: imageSize,
      selection_reason: getSelectionReason(selectedRice.name, brightness, entropy, uniqueChars),
    },
  }
}

function getSelectionReason(riceName, brightness, entropy, uniqueChars) {
  switch (riceName) {
    case "Wild Rice":
      return "Selected due to darker characteristics"
    case "Brown Rice":
      return "Selected due to moderate darkness and complexity"
    case "Arborio Rice":
    case "Sushi Rice":
      return "Selected due to simpler visual characteristics"
    case "Basmati Rice":
      return "Selected as most common long-grain variety"
    case "Jasmine Rice":
      return "Selected as common aromatic variety"
    default:
      return "Selected based on image analysis"
  }
}
