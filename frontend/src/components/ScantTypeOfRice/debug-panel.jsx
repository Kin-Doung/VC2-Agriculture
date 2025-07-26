"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Bug, TestTube, CheckCircle, X } from "lucide-react"

export default function DebugPanel() {
  const [testResult, setTestResult] = useState("")
  const [isTestingAPI, setIsTestingAPI] = useState(false)

  const testRiceDetection = async () => {
    setIsTestingAPI(true)
    setTestResult("🔄 Testing rice-specific detection...")

    try {
      const testCases = [
        {
          name: "Good Rice Image",
          image:
            "data:image/jpeg;base64," + "R".repeat(80000) + "i".repeat(40000) + "c".repeat(30000) + "e".repeat(20000),
          expected: "Should detect rice",
        },
        {
          name: "Too Small Image",
          image: "data:image/png;base64," + "A".repeat(500),
          expected: "Should reject - too small",
        },
        {
          name: "Too Simple (Solid Color)",
          image: "data:image/png;base64," + "A".repeat(50000),
          expected: "Should reject - too uniform",
        },
        {
          name: "Too Complex (Busy Scene)",
          image:
            "data:image/jpeg;base64," +
            Array.from({ length: 100000 }, (_, i) => String.fromCharCode(65 + (i % 26))).join(""),
          expected: "Should reject - too complex",
        },
        {
          name: "Too Dark (Black Objects)",
          image: "data:image/jpeg;base64/" + "z".repeat(80000) + "y".repeat(20000),
          expected: "Should reject - too dark",
        },
        {
          name: "Medium Rice Image",
          image:
            "data:image/jpeg;base64," + "B".repeat(60000) + "a".repeat(30000) + "s".repeat(20000) + "m".repeat(10000),
          expected: "Should detect rice",
        },
      ]

      let results = "🧪 Rice-Specific Detection Test:\n\n"

      for (let i = 0; i < testCases.length; i++) {
        const testCase = testCases[i]
        results += `${i + 1}. ${testCase.name}:\n`

        try {
          const response = await fetch("/api/scan-rice", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ image: testCase.image }),
          })

          const data = await response.json()

          if (response.ok) {
            const isRiceDetected = data.type !== "Not Rice Detected" && data.type !== "Invalid Image"
            results += `   ${isRiceDetected ? "🌾" : "❌"} Result: ${data.type}\n`
            results += `   📊 Confidence: ${(data.confidence * 100).toFixed(1)}%\n`
            results += `   💭 Expected: ${testCase.expected}\n`

            if (data.analysis_details && data.analysis_details.detection_reason) {
              results += `   🔍 Reason: ${data.analysis_details.detection_reason}\n`
            }
          } else {
            results += `   ❌ API Error: ${data.error}\n`
          }
        } catch (error) {
          results += `   🚨 Network Error: ${error.message}\n`
        }

        results += "\n"
      }

      results += "✅ Test completed! Check if rice detection is working correctly."
      setTestResult(results)
    } catch (error) {
      setTestResult(`❌ Rice Detection Test Failed!\nError: ${error.message}`)
    } finally {
      setIsTestingAPI(false)
    }
  }

  const testAPI = async () => {
    setIsTestingAPI(true)
    setTestResult("🔄 Testing basic API...")

    try {
      const testImage = "data:image/jpeg;base64," + "R".repeat(50000) + "i".repeat(30000) + "c".repeat(20000)

      const response = await fetch("/api/scan-rice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: testImage }),
      })

      const data = await response.json()

      if (response.ok) {
        setTestResult(
          `✅ API Working!
          
🎯 Result: ${data.type}
📊 Confidence: ${(data.confidence * 100).toFixed(1)}%
📝 Description: ${data.description}

${
  data.analysis_details
    ? `🔍 Analysis Details:
- Match Score: ${data.analysis_details.match_score || "N/A"}
- Brightness: ${data.analysis_details.brightness || "N/A"}
- Entropy: ${data.analysis_details.entropy || "N/A"}
- Unique Chars: ${data.analysis_details.unique_chars || "N/A"}
- Texture: ${data.analysis_details.texture_complexity || "N/A"}
`
    : ""
}

✨ The rice-specific detection is active!`,
        )
      } else {
        setTestResult(`❌ API Error: ${data.error}`)
      }
    } catch (error) {
      setTestResult(`❌ Network Error: ${error.message}`)
    } finally {
      setIsTestingAPI(false)
    }
  }

  const clearResults = () => {
    setTestResult("")
  }

  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-sm">
          <Bug className="w-4 h-4" />
          Rice-Specific Debug Panel
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          <button
            onClick={testAPI}
            disabled={isTestingAPI}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
          >
            <TestTube className="w-4 h-4" />
            {isTestingAPI ? "Testing..." : "Test API"}
          </button>

          <button
            onClick={testRiceDetection}
            disabled={isTestingAPI}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
          >
            <CheckCircle className="w-4 h-4" />
            Test Rice Detection
          </button>

          <button
            onClick={clearResults}
            disabled={isTestingAPI}
            className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
          >
            <X className="w-4 h-4" />
            Clear Results
          </button>
        </div>

        {testResult && (
          <div className="bg-gray-100 rounded p-3 max-h-96 overflow-y-auto">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}

        <div className="text-xs text-gray-500 border-t pt-2">
          <p>
            <strong>Rice-Specific Detection:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>
              <strong>✅ Will Accept:</strong> Images with rice-like characteristics (proper size, color, texture)
            </li>
            <li>
              <strong>❌ Will Reject:</strong> Too small, too dark, too uniform, too complex, or non-rice objects
            </li>
            <li>
              <strong>🔍 Analysis:</strong> Checks 6 criteria: size, color variety, complexity, patterns, brightness,
              texture
            </li>
          </ul>
        </div>
      </CardContent>
    </Card>
  )
}
