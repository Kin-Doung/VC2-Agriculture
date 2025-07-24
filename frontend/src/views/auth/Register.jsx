"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Eye, EyeOff, Mail, Lock, User, MapPin, Leaf, Phone } from "lucide-react"
import axios from "axios"

const Register = ({ language, onRegister }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    farmName: "",
    location: "",
    phone: "",
  })
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const translations = {
    en: {
      title: "Create Your Account",
      subtitle: "Join thousands of farmers using Farm Manager",
      name: "Full Name",
      email: "Email Address",
      password: "Password",
      confirmPassword: "Confirm Password",
      farmName: "Farm Name",
      phone: "Phone Number",
      location: "Location",
      showPassword: "Show password",
      hidePassword: "Hide password",
      signUp: "Create Account",
      signingUp: "Creating Account...",
      haveAccount: "Already have an account?",
      signIn: "Sign in here",
      terms: "By creating an account, you agree to our",
      termsLink: "Terms of Service",
      and: "and",
      privacyLink: "Privacy Policy",
      errors: {
        required: "This field is required",
        invalidEmail: "Please enter a valid email address",
        passwordTooShort: "Password must be at least 6 characters",
        passwordMismatch: "Passwords do not match",
        emailExists: "An account with this email already exists",
      },
    },
    km: {
      title: "បង្កើតគណនីរបស់អ្នក",
      subtitle: "ចូលរួមជាមួយកសិកររាប់ពាន់នាក់ដែលកំពុងប្រើ Farm Manager",
      name: "ឈ្មោះពេញ",
      email: "អាសយដ្ឋានអ៊ីមែល",
      password: "ពាក្យសម្ងាត់",
      confirmPassword: "បញ្ជាក់ពាក្យសម្ងាត់",
      farmName: "ឈ្មោះកសិដ្ឋាន",
      phone: "លេខទូរស័ព្ទ",
      location: "ទីតាំង",
      showPassword: "បង្ហាញពាក្យសម្ងាត់",
      hidePassword: "លាក់ពាក្យសម្ងាត់",
      signUp: "បង្កើតគណនី",
      signingUp: "កំពុងបង្កើតគណនី...",
      haveAccount: "មានគណនីរួចហើយ?",
      signIn: "ចូលប្រើនៅទីនេះ",
      terms: "ដោយការបង្កើតគណនី អ្នកយល់ព្រមនឹង",
      termsLink: "លក្ខខណ្ឌសេវាកម្ម",
      and: "និង",
      privacyLink: "គោលការណ៍ភាពឯកជន",
      errors: {
        required: "វាលនេះត្រូវការ",
        invalidEmail: "សូមបញ្ចូលអាសយដ្ឋានអ៊ីមែលត្រឹមត្រូវ",
        passwordTooShort: "ពាក្យសម្ងាត់ត្រូវតែមានយ៉ាងហោចណាស់ ៦ តួអក្សរ",
        passwordMismatch: "ពាក្យសម្ងាត់មិនត្រូវគ្នា",
        emailExists: "គណនីដែលមានអ៊ីមែលនេះមានរួចហើយ",
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
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    // Required fields
    if (!formData.name.trim()) newErrors.name = t.errors.required
    if (!formData.email.trim()) newErrors.email = t.errors.required
    if (!formData.password) newErrors.password = t.errors.required
    if (!formData.confirmPassword) newErrors.confirmPassword = t.errors.required
    if (!formData.farmName.trim()) newErrors.farmName = t.errors.required
    if (!formData.location.trim()) newErrors.location = t.errors.required
    if (!formData.phone.trim()) newErrors.phone = t.errors.required

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (formData.email && !emailRegex.test(formData.email)) {
      newErrors.email = t.errors.invalidEmail
    }

    // Password validation
    if (formData.password && formData.password.length < 6) {
      newErrors.password = t.errors.passwordTooShort
    }

    // Password confirmation
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = t.errors.passwordMismatch
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

const handleSubmit = async (e) => {
  e.preventDefault()

  if (!validateForm()) return

  setIsLoading(true)

  try {
    const response = await axios.post("http://localhost:8000/api/register", {
      name: formData.name,
      email: formData.email,
      password: formData.password,
      password_confirmation: formData.confirmPassword,
      farm_name: formData.farmName,
      location: formData.location,
      phone: formData.phone,
    })

    onRegister(response.data)
  } catch (error) {
    if (error.response?.data?.errors?.email) {
      setErrors({ email: t.errors.emailExists })
    } else {
      alert("Register failed")
    }
  } finally {
    setIsLoading(false)
  }
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
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                {t.name}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  autoComplete="name"
                  required
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.name ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter Full Name"
                />
              </div>
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>

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
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.email ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="farmer@example.com"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="farmName" className="block text-sm font-medium text-gray-700 mb-1">
                {t.farmName}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Leaf className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="farmName"
                  name="farmName"
                  type="text"
                  required
                  value={formData.farmName}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.farmName ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter Farm Name"
                />
              </div>
              {errors.farmName && <p className="mt-1 text-sm text-red-600">{errors.farmName}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                {t.phone || "Phone Number"}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" /> 
                </div>
                <input
                  id="phone"
                  name="phone"
                  type="text"
                  required
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.phone ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Enter Phone Number"
                />
              </div>
              {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
            </div>


            <div>
              <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
                {t.location}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="location"
                  name="location"
                  type="text"
                  required
                  value={formData.location}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.location ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="Siem Reap, Cambodia"
                />
              </div>
              {errors.location && <p className="mt-1 text-sm text-red-600">{errors.location}</p>}
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
                  autoComplete="new-password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.password ? "border-red-300" : "border-gray-300"
                  }`}
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
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                {t.confirmPassword}
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  autoComplete="new-password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent ${
                    errors.confirmPassword ? "border-red-300" : "border-gray-300"
                  }`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>
          </div>

          <div className="text-xs text-gray-600">
            {t.terms}{" "}
            <a href="#" className="text-green-600 hover:text-green-700">
              {t.termsLink}
            </a>{" "}
            {t.and}{" "}
            <a href="#" className="text-green-600 hover:text-green-700">
              {t.privacyLink}
            </a>
            .
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? t.signingUp : t.signUp}
          </button>

          <div className="text-center">
            <span className="text-sm text-gray-600">
              {t.haveAccount}{" "}
              <Link to="/login" className="font-medium text-green-600 hover:text-green-700">
                {t.signIn}
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  )
}

export default Register
