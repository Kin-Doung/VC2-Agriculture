"use client"

import { useState, useEffect } from "react"
import { User } from "lucide-react"
import axios from "axios"
import { format, parseISO } from "date-fns"
import { enUS, km } from "date-fns/locale"

const Profile = ({ language = "en" }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [photo, setPhoto] = useState(null)
  const [isPhotoLoading, setIsPhotoLoading] = useState(false)
  const [photoError, setPhotoError] = useState(null)
  const [profileData, setProfileData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    farmName: "",
    phone: "",
    location: "",
    role: "",
    latitude: "",
    longitude: "",
    area: "",
    created_at: "",
    updated_at: "",
  })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  const translations = {
    en: {
      profile: "Profile",
      subtitle: "Manage your profile and account settings",
      personalInfo: "Personal Information",
      farmInfo: "Farm Information",
      accountSecurity: "Account Security",
      fullName: "Full Name",
      email: "Email Address",
      password: "Password",
      confirmPassword: "Confirm Password",
      farmName: "Farm Name",
      phone: "Phone Number",
      location: "Location",
      latitude: "Latitude",
      longitude: "Longitude",
      area: "Area (hectares)",
      role: "Role",
      selectRole: "Select Role",
      showPassword: "Show password",
      hidePassword: "Hide password",
      edit: "Edit Profile",
      save: "Save Changes",
      cancel: "Cancel",
      changePassword: "Change Password",
      newPassword: "New Password",
      confirmNewPassword: "Confirm New Password",
      profilePicture: "Profile Picture",
      uploadPhoto: "Upload Photo",
      removePhoto: "Remove Photo",
      accountSettings: "Account Settings",
      notifications: "Email Notifications",
      language: "Language",
      timezone: "Timezone",
      deleteAccount: "Delete Account",
      lastUpdated: "Last updated",
      memberSince: "Member since",
      profileUpdated: "Profile updated successfully!",
      passwordChanged: "Password changed successfully!",
      enterFullName: "Enter your full name",
      enterEmail: "Enter your email address",
      enterFarmName: "Enter your farm name",
      enterPhone: "Enter your phone number",
      enterLocation: "Enter your location",
      enterLatitude: "Enter latitude",
      enterLongitude: "Enter longitude",
      enterArea: "Enter area",
      enterNewPassword: "Enter new password",
      confirmNewPasswordPlaceholder: "Confirm your new password",
      errorFetching: "Error fetching profile data",
      errorUpdating: "Error updating profile",
      errorUploadingPhoto: "Error uploading photo",
      errorPhotoSize: "Photo size exceeds 2MB limit",
      errorPhotoType: "Only JPEG, PNG, or JPG files are allowed",
      errorPhotoLoad: "Failed to load profile image",
      errorUnauthorized: "Please log in again",
      errorServer: "Server error, please try again later",
    },
    kh: {
      profile: "ប្រវត្តិរូប",
      subtitle: "គ្រប់គ្រងប្រវត្តិរូប និងការកំណត់គណនីរបស់អ្នក",
      personalInfo: "ព័ត៌មានផ្ទាល់ខ្លួន",
      farmInfo: "ព័ត៌មានកសិដ្ឋាន",
      accountSecurity: "សុវត្ថិភាពគណនី",
      fullName: "ឈ្មោះពេញ",
      email: "អាសយដ្ឋានអ៊ីមែល",
      password: "ពាក្យសម្ងាត់",
      confirmPassword: "បញ្ជាក់ពាក្យសម្ងាត់",
      farmName: "ឈ្មោះកសិដ្ឋាន",
      phone: "លេខទូរស័ព្ទ",
      location: "ទីតាំង",
      latitude: "រយៈទទឹង",
      longitude: "រយៈបណ្តោយ",
      area: "ផ្ទៃដី (ហិកតា)",
      role: "តួនាទី",
      selectRole: "ជ្រើសរើសតួនាទី",
      showPassword: "បង្ហាញពាក្យសម្ងាត់",
      hidePassword: "លាក់ពាក្យសម្ងាត់",
      edit: "កែសម្រួលប្រវត្តិរូប",
      save: "រក្សាទុកការផ្លាស់ប្តូរ",
      cancel: "បោះបង់",
      changePassword: "ផ្លាស់ប្តូរពាក្យសម្ងាត់",
      newPassword: "ពាក្យសម្ងាត់ថ្មី",
      confirmNewPassword: "បញ្ជាក់ពាក្យសម្ងាត់ថ្មី",
      profilePicture: "រូបភាពប្រវត្តិរូប",
      uploadPhoto: "ផ្ទុកឡើងរូបភាព",
      removePhoto: "លុបរូបភាព",
      accountSettings: "ការកំណត់គណនី",
      notifications: "ការជូនដំណឹងតាមអ៊ីមែល",
      language: "ភាសា",
      timezone: "តំបន់ពេលវេលា",
      deleteAccount: "លុបគណនី",
      lastUpdated: "ធ្វើបច្ចុប្បន្នភាពចុងក្រោយ",
      memberSince: "សមាជិកតាំងពី",
      profileUpdated: "ប្រវត្តិរូបត្រូវបានធ្វើបច្ចុប្បន្នភាពដោយជោគជ័យ!",
      passwordChanged: "ពាក្យសម្ងាត់ត្រូវបានផ្លាស់ប្តូរដោយជោគជ័យ!",
      enterFullName: "បញ្ចូលឈ្មោះពេញរបស់អ្នក",
      enterEmail: "បញ្ចូលអាសយដ្ឋានអ៊ីមែលរបស់អ្នក",
      enterFarmName: "បញ្ចូលឈ្មោះកសិដ្ឋានរបស់អ្នក",
      enterPhone: "បញ្ចូលលេខទូរស័ព្ទរបស់អ្នក",
      enterLocation: "បញ្ចូលទីតាំងរបស់អ្នក",
      enterLatitude: "បញ្ចូលរយៈទទឹង",
      enterLongitude: "បញ្ចូលរយៈបណ្តោយ",
      enterArea: "បញ្ចូលផ្ទៃដី",
      enterNewPassword: "បញ្ចូលពាក្យសម្ងាត់ថ្មី",
      confirmNewPasswordPlaceholder: "បញ្ជាក់ពាក្យសម្ងាត់ថ្មីរបស់អ្នក",
      errorFetching: "Error fetching profile data",
      errorUpdating: "Error updating profile",
      errorUploadingPhoto: "Error uploading photo",
      errorPhotoSize: "Photo size exceeds 2MB limit",
      errorPhotoType: "Only JPEG, PNG, or JPG files are allowed",
      errorPhotoLoad: "Failed to load profile image",
      errorUnauthorized: "Please log in again",
      errorServer: "Server error, please try again later",
    },
  }

  const t = translations[language] || translations.en

  // 📅 Format date based on language
  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    try {
      const date = parseISO(dateString)
      return format(date, "MMMM d, yyyy, h:mm a", {
        locale: language === "kh" ? km : enUS,
      })
    } catch (error) {
      console.error("Error formatting date:", error)
      return "N/A"
    }
  }

    

  // 📤 Upload photo
  const handleUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    // Validate file size (2MB = 2 * 1024 * 1024 bytes)
    if (file.size > 2 * 1024 * 1024) {
      setError(t.errorPhotoSize)
      return
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/jpg"]
    if (!allowedTypes.includes(file.type)) {
      setError(t.errorPhotoType)
      return
    }

    setIsPhotoLoading(true)
    setError(null)
    setSuccess(null)

    const formData = new FormData()
    formData.append("profile_image", file)
    try {
      const response = await axios.post(
        "http://127.0.0.1:8000/api/profile/image",
        formData,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      setPhoto(response.data.user.profile_image)
      setSuccess(t.profileUpdated)
      setPhotoError(null)
    } catch (error) {
      console.error("Error uploading photo:", error)
      if (error.response?.status === 422) {
        setError(error.response.data.message || t.errorUploadingPhoto)
      } else if (error.response?.status === 401) {
        setError(t.errorUnauthorized)
      } else {
        setError(t.errorServer)
      }
    } finally {
      setIsPhotoLoading(false)
    }
  }

  // ❌ Remove photo
  const handleRemove = async () => {
    setIsPhotoLoading(true)
    setError(null)
    setSuccess(null)
    try {
      await axios.post(
        "http://127.0.0.1:8000/api/profile/image",
        { profile_image: null },
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      setPhoto(null)
      setSuccess(t.profileUpdated)
      setPhotoError(null)
    } catch (error) {
      console.error("Error removing photo:", error)
      if (error.response?.status === 401) {
        setError(t.errorUnauthorized)
      } else {
        setError(t.errorUploadingPhoto)
      }
    } finally {
      setIsPhotoLoading(false)
    }
  }

  // Handle image load error
  const handleImageError = (e) => {
    console.error("Image load error:", {
      src: e.target.src,
      status: e.target.status,
      message: e.message || "Unknown error",
    })
    setPhotoError(t.errorPhotoLoad)
    setPhoto(null)
  }

  const handleInputChange = (field, value) => {
    setProfileData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSave = async () => {
    try {
      const payload = {
        name: profileData.fullName,
        email: profileData.email,
        phone: profileData.phone,
        farm_name: profileData.farmName,
        location: profileData.location,
        role: profileData.role,
        latitude: profileData.latitude || null,
        longitude: profileData.longitude || null,
        area: profileData.area || null,
      }
      if (profileData.password && profileData.password === profileData.confirmPassword) {
        payload.password = profileData.password
        payload.password_confirmation = profileData.confirmPassword
      } else if (profileData.password !== profileData.confirmPassword) {
        setError(t.errorUpdating)
        return
      }
      const response = await axios.put(
        "http://127.0.0.1:8000/api/user",
        payload,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        }
      )
      setProfileData((prev) => ({
        ...prev,
        password: "",
        confirmPassword: "",
        created_at: response.data.user.created_at,
        updated_at: response.data.user.updated_at,
      }))
      setSuccess(t.profileUpdated)
      setError(null)
      setIsEditing(false)
    } catch (error) {
      console.error("Error updating user:", error)
      if (error.response?.status === 401) {
        setError(t.errorUnauthorized)
      } else if (error.response?.status === 422) {
        setError(error.response.data.message || t.errorUpdating)
      } else {
        setError(t.errorServer)
      }
    }
  }

  const handleCancel = () => {
    setIsEditing(false)
    setError(null)
    setSuccess(null)
    // Refetch user data only if edited
    if (isEditing) {
      const fetchUser = async () => {
        const token = localStorage.getItem("token")
        if (!token) {
          console.error("No token found in localStorage")
          setError(t.errorUnauthorized)
          return
        }
        try {
          console.log("Fetching user with token:", token.substring(0, 10) + "...")
          const response = await axios.get("http://127.0.0.1:8000/api/user", {
            headers: { Authorization: `Bearer ${token}` },
          })
          console.log("User data received:", response.data)
          const user = response.data.user
          setProfileData({
            fullName: user.name || "",
            email: user.email || "",
            password: "",
            confirmPassword: "",
            farmName: user.farm_name || "",
            phone: user.phone || "",
            location: user.location || "",
            role: user.role || "",
            latitude: user.farm?.[0]?.location_at_latitude || "",
            longitude: user.farm?.[0]?.location_longitude || "",
            area: user.farm?.[0]?.area || "",
            created_at: user.created_at || "",
            updated_at: user.updated_at || "",
          })
          setPhoto(user.profile_image || null)
          setPhotoError(null)
        } catch (error) {
          console.error("Error fetching user:", {
            message: error.message,
            status: error.response?.status,
            data: error.response?.data,
            url: error.config?.url,
          })
          if (error.response?.status === 401) {
            setError(t.errorUnauthorized)
          } else if (error.response?.status >= 500) {
            setError(t.errorServer)
          } else {
            setError(error.response?.data?.message || t.errorFetching)
          }
        }
      }
      fetchUser()
    }
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
  }

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  return (
    <div className="p-3 sm:p-4 lg:p-6 bg-green-50 min-h-screen">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-green-800 mb-2 flex items-center gap-2">
          <span>
            <User className="h-12 w-12 text-black" />
          </span>
          {t.profile}
        </h1>
        <p className="text-sm sm:text-base text-green-600">{t.subtitle}</p>
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Feedback Messages */}
        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">{success}</p>}
        {photoError && <p className="text-red-600 text-sm">{photoError}</p>}

        {/* Profile Picture Section */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-green-200">
          <h2 className="text-lg sm:text-xl font-semibold text-green-800 mb-4">{t.profilePicture}</h2>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <div className="w-24 h-24 sm:w-32 sm:h-32 bg-green-100 rounded-full flex items-center justify-center overflow-hidden relative">
              {isPhotoLoading ? (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 border-4 border-green-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : photo && !photoError ? (
                <img
                  src={photo}
                  alt="Profile"
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              ) : (
                <User className="h-12 w-12 text-black" />
              )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <label
                className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm sm:text-base cursor-pointer ${
                  isPhotoLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                {t.uploadPhoto}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/jpg"
                  onChange={handleUpload}
                  className="hidden"
                  disabled={isPhotoLoading}
                />
              </label>
              <button
                onClick={handleRemove}
                className={`px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors text-sm sm:text-base ${
                  isPhotoLoading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                disabled={isPhotoLoading}
              >
                {t.removePhoto}
              </button>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-green-200">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
            <h2 className="text-lg sm:text-xl font-semibold text-green-800">{t.personalInfo}</h2>
            {!isEditing ? (
              <button
                onClick={() => setIsEditing(true)}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm sm:text-base"
              >
                {t.edit}
              </button>
            ) : (
              <div className="flex gap-2">
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors text-sm sm:text-base"
                >
                  {t.save}
                </button>
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 border border-green-600 text-green-600 rounded-md hover:bg-green-50 transition-colors text-sm sm:text-base"
                >
                  {t.cancel}
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-medium text-green-800 mb-2">{t.fullName}</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => handleInputChange("fullName", e.target.value)}
                  placeholder={t.enterFullName}
                  className="w-full px-3 py-2 border-2 border-green-200 rounded-md focus:outline-none focus:border-green-600 transition-colors text-sm sm:text-base"
                />
              ) : (
                <p className="text-green-700 py-2 text-sm sm:text-base">{profileData.fullName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-green-800 mb-2">{t.email}</label>
              {isEditing ? (
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder={t.enterEmail}
                  className="w-full px-3 py-2 border-2 border-green-200 rounded-md focus:outline-none focus:border-green-600 transition-colors text-sm sm:text-base"
                />
              ) : (
                <p className="text-green-700 py-2 text-sm sm:text-base">{profileData.email}</p>
              )}
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-green-800 mb-2">{t.phone}</label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder={t.enterPhone}
                  className="w-full px-3 py-2 border-2 border-green-200 rounded-md focus:outline-none focus:border-green-600 transition-colors text-sm sm:text-base"
                />
              ) : (
                <p className="text-green-700 py-2 text-sm sm:text-base">{profileData.phone}</p>
              )}
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-green-800 mb-2">{t.location}</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.location}
                  onChange={(e) => handleInputChange("location", e.target.value)}
                  placeholder={t.enterLocation}
                  className="w-full px-3 py-2 border-2 border-green-200 rounded-md focus:outline-none focus:border-green-600 transition-colors text-sm sm:text-base"
                />
              ) : (
                <p className="text-green-700 py-2 text-sm sm:text-base">{profileData.location}</p>
              )}
            </div>

            {/* Role */}
            <div>
              <label className="block text-sm font-medium text-green-800 mb-2">{t.role}</label>
              {isEditing ? (
                <select
                  value={profileData.role}
                  onChange={(e) => handleInputChange("role", e.target.value)}
                  className="w-full px-3 py-2 border-2 border-green-200 rounded-md focus:outline-none focus:border-green-600 transition-colors text-sm sm:text-base"
                >
                  <option value="">{t.selectRole}</option>
                  <option value="admin">Admin</option>
                  <option value="farmer">Farmer</option>
                  <option value="user">User</option>
                </select>
              ) : (
                <p className="text-green-700 py-2 text-sm sm:text-base">{profileData.role}</p>
              )}
            </div>
          </div>
        </div>

        {/* Farm Information */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-green-200">
          <h2 className="text-lg sm:text-xl font-semibold text-green-800 mb-4">{t.farmInfo}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            {/* Farm Name */}
            <div>
              <label className="block text-sm font-medium text-green-800 mb-2">{t.farmName}</label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.farmName}
                  onChange={(e) => handleInputChange("farmName", e.target.value)}
                  placeholder={t.enterFarmName}
                  className="w-full px-3 py-2 border-2 border-green-200 rounded-md focus:outline-none focus:border-green-600 transition-colors text-sm sm:text-base"
                />
              ) : (
                <p className="text-green-700 py-2 text-sm sm:text-base">{profileData.farmName}</p>
              )}
            </div>

            {/* Latitude */}
            <div>
              <label className="block text-sm font-medium text-green-800 mb-2">{t.latitude}</label>
              {isEditing ? (
                <input
                  type="number"
                  value={profileData.latitude}
                  onChange={(e) => handleInputChange("latitude", e.target.value)}
                  placeholder={t.enterLatitude}
                  className="w-full px-3 py-2 border-2 border-green-200 rounded-md focus:outline-none focus:border-green-600 transition-colors text-sm sm:text-base"
                />
              ) : (
                <p className="text-green-700 py-2 text-sm sm:text-base">{profileData.latitude || "N/A"}</p>
              )}
            </div>

            {/* Longitude */}
            <div>
              <label className="block text-sm font-medium text-green-800 mb-2">{t.longitude}</label>
              {isEditing ? (
                <input
                  type="number"
                  value={profileData.longitude}
                  onChange={(e) => handleInputChange("longitude", e.target.value)}
                  placeholder={t.enterLongitude}
                  className="w-full px-3 py-2 border-2 border-green-200 rounded-md focus:outline-none focus:border-green-600 transition-colors text-sm sm:text-base"
                />
              ) : (
                <p className="text-green-700 py-2 text-sm sm:text-base">{profileData.longitude || "N/A"}</p>
              )}
            </div>

            {/* Area */}
            <div>
              <label className="block text-sm font-medium text-green-800 mb-2">{t.area}</label>
              {isEditing ? (
                <input
                  type="number"
                  value={profileData.area}
                  onChange={(e) => handleInputChange("area", e.target.value)}
                  placeholder={t.enterArea}
                  className="w-full px-3 py-2 border-2 border-green-200 rounded-md focus:outline-none focus:border-green-600 transition-colors text-sm sm:text-base"
                />
              ) : (
                <p className="text-green-700 py-2 text-sm sm:text-base">{profileData.area || "N/A"}</p>
              )}
            </div>

            {/* Member Since */}
            <div>
              <label className="block text-sm font-medium text-green-800 mb-2">{t.memberSince}</label>
              <p className="text-green-700 py-2 text-sm sm:text-base">{formatDate(profileData.created_at)}</p>
            </div>

            {/* Last Updated */}
            <div>
              <label className="block text-sm font-medium text-green-800 mb-2">{t.lastUpdated}</label>
              <p className="text-green-700 py-2 text-sm sm:text-base">{formatDate(profileData.updated_at)}</p>
            </div>
          </div>
        </div>

        {/* Account Security */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-green-200">
          <h2 className="text-lg sm:text-xl font-semibold text-green-800 mb-4">{t.accountSecurity}</h2>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {/* New Password */}
              <div>
                <label className="block text-sm font-medium text-green-800 mb-2">{t.newPassword}</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={profileData.password}
                    onChange={(e) => handleInputChange("password", e.target.value)}
                    placeholder={t.enterNewPassword}
                    className="w-full px-3 py-2 pr-10 border-2 border-green-200 rounded-md focus:outline-none focus:border-green-600 transition-colors text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-800 text-sm"
                  >
                    {showPassword ? t.hidePassword : t.showPassword}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div>
                <label className="block text-sm font-medium text-green-800 mb-2">{t.confirmNewPassword}</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    value={profileData.confirmPassword}
                    onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                    placeholder={t.confirmNewPasswordPlaceholder}
                    className="w-full px-3 py-2 pr-10 border-2 border-green-200 rounded-md focus:outline-none focus:border-green-600 transition-colors text-sm sm:text-base"
                  />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-600 hover:text-green-800 text-sm"
                  >
                    {showConfirmPassword ? t.hidePassword : t.showPassword}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Account Settings */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-green-200">
          <h2 className="text-lg sm:text-xl font-semibold text-green-800 mb-4">{t.accountSettings}</h2>
          <div className="space-y-4">
            {/* Email Notifications */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <div>
                <label className="block text-sm font-medium text-green-800">{t.notifications}</label>
                <p className="text-xs text-green-600">{t.notificationsDescription || "Receive price alerts and market updates"}</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" className="sr-only peer" defaultChecked />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
              </label>
            </div>

            {/* Language */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <label className="block text-sm font-medium text-green-800">{t.language}</label>
              <select
                value={language}
                onChange={(e) => {/* Update language via parent component */}}
                className="px-3 py-2 border-2 border-green-200 rounded-md focus:outline-none focus:border-green-600 transition-colors text-sm sm:text-base max-w-xs"
              >
                <option value="en">English</option>
                <option value="kh">ខ្មែរ (Khmer)</option>
              </select>
            </div>

            {/* Timezone */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
              <label className="block text-sm font-medium text-green-800">{t.timezone}</label>
              <select
                className="px-3 py-2 border-2 border-green-200 rounded-md focus:outline-none focus:border-green-600 transition-colors text-sm sm:text-base max-w-xs"
              >
                <option value="Asia/Phnom_Penh">Asia/Phnom Penh (GMT+7)</option>
                <option value="Asia/Bangkok">Asia/Bangkok (GMT+7)</option>
                <option value="UTC">UTC (GMT+0)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Account Info */}
        <div className="bg-white rounded-lg p-4 sm:p-6 shadow-sm border border-green-200">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <p className="text-sm text-green-600">{t.lastUpdated}: {formatDate(profileData.updated_at)}</p>
              <p className="text-sm text-green-600">{t.memberSince}: {formatDate(profileData.created_at)}</p>
            </div>
            <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors text-sm sm:text-base">
              {t.deleteAccount}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile