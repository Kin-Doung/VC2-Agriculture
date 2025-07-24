"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, Leaf } from "lucide-react"
import axios from "axios"

const Login = ({ language, onLogin }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const translations = {
    en: {
      title: "Welcome Back",
      subtitle: "Sign in to your Farm Manager account",
      email: "Email Address",
      password: "Password",
      showPassword: "Show password",
      hidePassword: "Hide password",
      signIn: "Sign In",
      signingIn: "Signing In...",
      forgotPassword: "Forgot your password?",
      noAccount: "Don't have an account?",
      signUp: "Sign up here",
      or: "Or continue with",
      demo: "Try Demo Account",
      demoEmail: "demo@farmmanager.com",
      demoPassword: "demo123",
      errors: {
        required: "This field is required",
        invalidEmail: "Please enter a valid email address",
        invalidCredentials: "Invalid email or password",
      },
    },
    km: {
      title: "សូមស្វាគមន៍ការវិលត្រលប់មក",
      subtitle: "ចូលទៅក្នុងគណនី Farm Manager របស់អ្នក",
      email: "អាសយដ្ឋានអ៊ីមែល",
      password: "ពាក្យសម្ងាត់",
      showPassword: "បង្ហាញពាក្យសម្ងាត់",
      hidePassword: "លាក់ពាក្យសម្ងាត់",
      signIn: "ចូលប្រើ",
      signingIn: "កំពុងចូលប្រើ...",
      forgotPassword: "ភ្លេចពាក្យសម្ងាត់របស់អ្នក?",
      noAccount: "មិនមានគណនី?",
      signUp: "ចុះឈ្មោះនៅទីនេះ",
      or: "ឬបន្តជាមួយ",
      demo: "សាកល្បងគណនីបង្ហាញ",
      demoEmail: "demo@farmmanager.com",
      demoPassword: "demo123",
      errors: {
        required: "វាលនេះត្រូវការ",
        invalidEmail: "សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែលត្រឹមត្រូវ",
        invalidCredentials: "អ៊ីមែល ឬពាក្យសម្ងាត់មិនត្រឹមត្រូវ",
      },
    },
  }

  const t = translations[language]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
    setError("")
  }

  // const handleSubmit = async (e) => {
  //   e.preventDefault()
  //   setIsLoading(true)
  //   setError("")

  //   // Basic validation
  //   if (!formData.email || !formData.password) {
  //     setError(t.errors.required)
  //     setIsLoading(false)
  //     return
  //   }

  //   // Email validation
  //   const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  //   if (!emailRegex.test(formData.email)) {
  //     setError(t.errors.invalidEmail)
  //     setIsLoading(false)
  //     return
  //   }

  //   try {
  //     // Simulate API call
  //     await new Promise((resolve) => setTimeout(resolve, 1500))

  //     // For demo purposes, accept any valid email/password combination
  //     // In a real app, this would be an actual API call
  //     if (formData.email && formData.password.length >= 6) {
  //       const userData = {
  //         id: 1,
  //         name: formData.email === "demo@farmmanager.com" ? "Demo User" : "Farmer User",
  //         email: formData.email,
  //         farmName: "Green Valley Farm",
  //       }
  //       onLogin(userData)
  //     } else {
  //       setError(t.errors.invalidCredentials)
  //     }
  //   } catch (err) {
  //     setError(t.errors.invalidCredentials)
  //   } finally {
  //     setIsLoading(false)
  //   }
  // }

  const handleSubmit = async (e) => {
  e.preventDefault()
  setIsLoading(true)
  setError("")

  // Basic validation
  if (!formData.email || !formData.password) {
    setError(t.errors.required)
    setIsLoading(false)
    return
  }

  // Email format validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.email)) {
    setError(t.errors.invalidEmail)
    setIsLoading(false)
    return
  }

  try {
    const response = await axios.post("http://localhost:8000/api/login", {
      email: formData.email,
      password: formData.password,
    })

    const data = response.data

    // Save token or user data
    const userData = {
      id: data.user.id,
      name: data.user.name,
      email: data.user.email,
      token: data.token,
    }

    // Optional: Save to localStorage
    localStorage.setItem("token", data.token)

    // Trigger app login
    onLogin(userData)

  } catch (err) {
    console.error("Login error:", err)
    if (err.response && err.response.status === 401) {
      setError(t.errors.invalidCredentials)
    } else {
      setError("Server error. Please try again.")
    }
  } finally {
    setIsLoading(false)
  }
}


  const handleDemoLogin = () => {
    setFormData({
      email: t.demoEmail,
      password: t.demoPassword,
    })
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-blue-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center">
              <Leaf className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-bold text-gray-900">{t.title}</h2>
          <p className="mt-2 text-sm text-gray-600">{t.subtitle}</p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {error && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">{error}</div>}

          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                {t.email}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="farmer@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                {t.password}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="block w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Link to="/forgot-password" className="text-sm text-green-600 hover:text-green-700">
              {t.forgotPassword}
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t.signingIn : t.signIn}
          </button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-50 text-gray-500">{t.or}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleDemoLogin}
            className="w-full flex justify-center py-3 px-4 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            {t.demo}
          </button>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              {t.noAccount}{" "}
              <Link to="/register" className="font-medium text-green-600 hover:text-green-700">
                {t.signUp}
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Login
