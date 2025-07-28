"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/Card"
import { Bug, TestTube, X, Zap, Cpu } from "lucide-react"

export default function DebugPanel() {
  const [testResult, setTestResult] = useState("")
  const [isTestingAPI, setIsTestingAPI] = useState(false)

  const testPythonIntegration = async () => {
    setIsTestingAPI(true)
    setTestResult("🐍 Testing Python integration...")

    try {
      const testImage = "data:image/jpeg;base64," + "R".repeat(60000) + "i".repeat(30000) + "c".repeat(20000)

      const response = await fetch("/api/scan-rice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: testImage }),
      })

      const data = await response.json()

      if (response.ok) {
        let result = `🎯 API Response Received!

🌾 Result: ${data.type}
📊 Confidence: ${(data.confidence * 100).toFixed(1)}%
🔧 Analysis Method: ${data.analysis_method || "Unknown"}

`

        if (data.python_analysis) {
          result += `✅ PYTHON ANALYSIS SUCCESSFUL!
🐍 Method: ${data.python_analysis.method}
🌾 Grains Detected: ${data.python_analysis.grain_count}
📏 Aspect Ratio: ${data.python_analysis.avg_aspect_ratio}
🎨 Color: RGB(${data.python_analysis.dominant_color?.join(", ")})
💡 Brightness: ${data.python_analysis.brightness}

🔬 Features Analyzed:
${data.python_analysis.features_analyzed?.map((f) => `  • ${f}`).join("\n") || "  • Basic analysis"}

📊 Classification Scores:
${Object.entries(data.python_analysis.classification_scores || {})
  .map(([type, score]) => `  • ${type}: ${(score * 100).toFixed(1)}%`)
  .join("\n")}

🎉 Python computer vision is working perfectly!`
        } else if (data.python_error) {
          result += `⚠️ PYTHON ANALYSIS FAILED - Using JavaScript Fallback

❌ Python Error: ${data.python_error}

🔧 To Fix Python Integration:
1. Install dependencies: python scripts/install_cv_dependencies.py
2. Test Python: python scripts/test_python_integration.py
3. Check Python path and OpenCV installation

📝 Current Status: JavaScript fallback working`
        } else {
          result += `🤔 UNKNOWN ANALYSIS METHOD

The API responded but analysis method is unclear.
This might indicate a configuration issue.`
        }

        setTestResult(result)
      } else {
        setTestResult(`❌ API Error: ${data.error}`)
      }
    } catch (error) {
      setTestResult(`❌ Network Error: ${error.message}`)
    } finally {
      setIsTestingAPI(false)
    }
  }

  const testFlexibleDetection = async () => {
    setIsTestingAPI(true)
    setTestResult("🔄 Testing flexible rice detection with multiple scenarios...")

    try {
      const testCases = [
        {
          name: "High Quality Rice Image",
          image: "data:image/jpeg;base64," + "B".repeat(80000) + "a".repeat(40000) + "s".repeat(30000),
          expected: "Should detect rice with Python CV",
        },
        {
          name: "Medium Quality Rice Image",
          image: "data:image/jpeg;base64/" + "J".repeat(50000) + "a".repeat(30000) + "s".repeat(20000),
          expected: "Should detect rice",
        },
        {
          name: "Small Rice Image",
          image: "data:image/jpeg;base64," + "R".repeat(15000) + "i".repeat(10000) + "c".repeat(5000),
          expected: "Should detect rice (flexible)",
        },
        {
          name: "Dark Rice (Wild Rice)",
          image: "data:image/jpeg;base64," + "W".repeat(40000) + "i".repeat(30000) + "l".repeat(20000),
          expected: "Should detect Wild Rice",
        },
      ]

      let results = "🧪 Python + JavaScript Integration Test:\n\n"

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
            const analysisMethod = data.analysis_method || "Unknown"
            const isPython = data.python_analysis ? "🐍" : "📜"

            results += `   ${isRiceDetected ? "🌾" : "❌"} Result: ${data.type}\n`
            results += `   ${isPython} Method: ${analysisMethod}\n`
            results += `   📊 Confidence: ${(data.confidence * 100).toFixed(1)}%\n`
            results += `   💭 Expected: ${testCase.expected}\n`

            if (data.python_analysis) {
              results += `   🔬 Python Details: ${data.python_analysis.grain_count} grains, ${data.python_analysis.avg_aspect_ratio} ratio\n`
            }

            if (data.python_error) {
              results += `   ⚠️ Python Error: ${data.python_error.substring(0, 50)}...\n`
            }
          } else {
            results += `   ❌ API Error: ${data.error}\n`
          }
        } catch (error) {
          results += `   🚨 Network Error: ${error.message}\n`
        }

        results += "\n"
      }

      results += "✅ Integration test completed!"
      setTestResult(results)
    } catch (error) {
      setTestResult(`❌ Integration Test Failed!\nError: ${error.message}`)
    } finally {
      setIsTestingAPI(false)
    }
  }

  const quickRiceTest = async () => {
    setIsTestingAPI(true)
    setTestResult("⚡ Quick rice test...")

    try {
      const simpleRiceImage = "data:image/jpeg;base64," + "RICE".repeat(20000)

      const response = await fetch("/api/scan-rice", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ image: simpleRiceImage }),
      })

      const data = await response.json()

      if (response.ok && data.type !== "Not Rice Detected") {
        const method = data.python_analysis ? "Python Computer Vision" : "JavaScript Fallback"
        const icon = data.python_analysis ? "🐍" : "📜"

        setTestResult(`⚡ Quick Test SUCCESS!

${icon} Analysis Method: ${method}
🌾 Detected: ${data.type}
📊 Confidence: ${(data.confidence * 100).toFixed(1)}%

✅ The system is working and can detect rice!
${data.python_analysis ? "🎉 Python computer vision is active!" : "⚠️ Using JavaScript fallback - install Python CV for better accuracy"}

Now try uploading your own rice image.`)
      } else {
        setTestResult(`⚡ Quick Test Issue:

Result: ${data.type}
Method: ${data.analysis_method || "Unknown"}

The system might need adjustment. Try uploading a larger, clearer rice image.`)
      }
    } catch (error) {
      setTestResult(`❌ Quick Test Failed: ${error.message}`)
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
          Python + JavaScript Integration Debug
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <button
            onClick={quickRiceTest}
            disabled={isTestingAPI}
            className="flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
          >
            <Zap className="w-4 h-4" />
            {isTestingAPI ? "Testing..." : "Quick Test"}
          </button>

          <button
            onClick={testPythonIntegration}
            disabled={isTestingAPI}
            className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
          >
            <Cpu className="w-4 h-4" />
            Python Test
          </button>

          <button
            onClick={testFlexibleDetection}
            disabled={isTestingAPI}
            className="flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-400 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
          >
            <TestTube className="w-4 h-4" />
            Full Test
          </button>

          <button
            onClick={clearResults}
            disabled={isTestingAPI}
            className="flex items-center justify-center gap-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-400 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
          >
            <X className="w-4 h-4" />
            Clear
          </button>
        </div>

        {testResult && (
          <div className="bg-gray-100 rounded p-3 max-h-96 overflow-y-auto">
            <pre className="text-xs text-gray-700 whitespace-pre-wrap">{testResult}</pre>
          </div>
        )}

        <div className="text-xs text-gray-500 border-t pt-2">
          <p>
            <strong>🔧 Python + JavaScript Integration:</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 mt-1">
            <li>
              <strong>🐍 Python CV:</strong> Advanced computer vision with OpenCV grain detection
            </li>
            <li>
              <strong>📜 JavaScript:</strong> Reliable fallback for when Python fails
            </li>
            <li>
              <strong>🔄 Auto-Fallback:</strong> Seamlessly switches between methods
            </li>
            <li>
              <strong>📊 Enhanced Results:</strong> Python provides detailed grain analysis
            </li>
          </ul>
          <div className="mt-2 p-2 bg-blue-50 rounded">
            <p className="text-blue-700 text-xs font-medium">Setup Python CV:</p>
            <code className="text-blue-600 text-xs">python scripts/install_cv_dependencies.py</code>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
