"use client"

import { useState } from "react"

const cambodianLocations = [
  // Phnom Penh
  { name: "Phnom Penh", nameKm: "ភ្នំពេញ", lat: 11.5564, lon: 104.9282, province: "Phnom Penh", provinceKm: "ភ្នំពេញ" },

  // Siem Reap Province
  { name: "Siem Reap", nameKm: "សៀមរាប", lat: 13.3671, lon: 103.8448, province: "Siem Reap", provinceKm: "សៀមរាប" },
  { name: "Angkor", nameKm: "អង្គរ", lat: 13.4125, lon: 103.867, province: "Siem Reap", provinceKm: "សៀមរាប" },

  // Battambang Province
  { name: "Battambang", nameKm: "បាត់ដំបង", lat: 13.0957, lon: 103.2027, province: "Battambang", provinceKm: "បាត់ដំបង" },
  { name: "Pailin", nameKm: "ប៉ៃលិន", lat: 12.8489, lon: 102.6097, province: "Pailin", provinceKm: "ប៉ៃលិន" },

  // Kampong Cham Province
  {
    name: "Kampong Cham",
    nameKm: "កំពង់ចាម",
    lat: 11.9934,
    lon: 105.4635,
    province: "Kampong Cham",
    provinceKm: "កំពង់ចាម",
  },
  { name: "Kratie", nameKm: "ក្រចេះ", lat: 12.4886, lon: 106.0186, province: "Kratie", provinceKm: "ក្រចេះ" },

  // Kampong Speu Province
  { name: "Kampong Speu", nameKm: "កំពង់ស្ពឺ", lat: 11.4564, lon: 104.5225, province: "Kampong Speu", provinceKm: "កំពង់ស្ពឺ" },

  // Kampong Thom Province
  { name: "Kampong Thom", nameKm: "កំពង់ធំ", lat: 12.7112, lon: 104.8889, province: "Kampong Thom", provinceKm: "កំពង់ធំ" },

  // Kampot Province
  { name: "Kampot", nameKm: "កំពត", lat: 10.6104, lon: 104.1817, province: "Kampot", provinceKm: "កំពត" },
  { name: "Kep", nameKm: "កែប", lat: 10.4833, lon: 104.3167, province: "Kep", provinceKm: "កែប" },

  // Kandal Province
  { name: "Ta Khmau", nameKm: "តាខ្មៅ", lat: 11.4785, lon: 104.9501, province: "Kandal", provinceKm: "កណ្តាល" },

  // Koh Kong Province
  { name: "Koh Kong", nameKm: "កោះកុង", lat: 11.6151, lon: 102.9835, province: "Koh Kong", provinceKm: "កោះកុង" },

  // Mondulkiri Province
  {
    name: "Sen Monorom",
    nameKm: "សែនមនោរម្យ",
    lat: 12.4545,
    lon: 107.2067,
    province: "Mondulkiri",
    provinceKm: "មណ្ឌលគិរី",
  },

  // Preah Vihear Province
  {
    name: "Preah Vihear",
    nameKm: "ព្រះវិហារ",
    lat: 13.8059,
    lon: 104.9717,
    province: "Preah Vihear",
    provinceKm: "ព្រះវិហារ",
  },

  // Prey Veng Province
  { name: "Prey Veng", nameKm: "ព្រៃវែង", lat: 11.4865, lon: 105.3279, province: "Prey Veng", provinceKm: "ព្រៃវែង" },

  // Pursat Province
  { name: "Pursat", nameKm: "ពោធិ៍សាត់", lat: 12.5388, lon: 103.9192, province: "Pursat", provinceKm: "ពោធិ៍សាត់" },

  // Ratanakiri Province
  { name: "Banlung", nameKm: "បានលុង", lat: 13.7396, lon: 106.9877, province: "Ratanakiri", provinceKm: "រតនគិរី" },

  // Sihanoukville
  {
    name: "Sihanoukville",
    nameKm: "ព្រះសីហនុ",
    lat: 10.6104,
    lon: 103.529,
    province: "Preah Sihanouk",
    provinceKm: "ព្រះសីហនុ",
  },

  // Stung Treng Province
  {
    name: "Stung Treng",
    nameKm: "ស្ទឹងត្រែង",
    lat: 13.5259,
    lon: 105.9683,
    province: "Stung Treng",
    provinceKm: "ស្ទឹងត្រែង",
  },

  // Svay Rieng Province
  { name: "Svay Rieng", nameKm: "ស្វាយរៀង", lat: 11.0879, lon: 105.7993, province: "Svay Rieng", provinceKm: "ស្វាយរៀង" },

  // Takeo Province
  { name: "Takeo", nameKm: "តាកែវ", lat: 10.9909, lon: 104.7851, province: "Takeo", provinceKm: "តាកែវ" },

  // Oddar Meanchey Province
  {
    name: "Samraong",
    nameKm: "សំរោង",
    lat: 14.1836,
    lon: 103.5117,
    province: "Oddar Meanchey",
    provinceKm: "ឧត្តរមានជ័យ",
  },

  // Banteay Meanchey Province
  {
    name: "Sisophon",
    nameKm: "ស៊ីសុផន",
    lat: 13.5859,
    lon: 102.9735,
    province: "Banteay Meanchey",
    provinceKm: "បន្ទាយមានជ័យ",
  },
  {
    name: "Poipet",
    nameKm: "ប៉ោយប៉ែត",
    lat: 13.6518,
    lon: 102.5633,
    province: "Banteay Meanchey",
    provinceKm: "បន្ទាយមានជ័យ",
  },
]

export default function CambodiaLocationSelector({ onLocationSelect, onClose, language, currentLocation }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedProvince, setSelectedProvince] = useState("")

  const translations = {
    en: {
      selectLocation: "Select Location in Cambodia",
      searchPlaceholder: "Search city or province...",
      allProvinces: "All Provinces",
      currentLocation: "Current Location",
      close: "Close",
    },
    km: {
      selectLocation: "ជ្រើសរើសទីតាំងនៅកម្ពុជា",
      searchPlaceholder: "ស្វែងរកទីក្រុង ឬខេត្ត...",
      allProvinces: "ខេត្តទាំងអស់",
      currentLocation: "ទីតាំងបច្ចុប្បន្ន",
      close: "បិទ",
    },
  }

  const t = translations[language] || translations.en

  // Get unique provinces
  const provinces = [
    ...new Set(cambodianLocations.map((loc) => (language === "km" ? loc.provinceKm : loc.province))),
  ].sort()

  // Filter locations based on search and province
  const filteredLocations = cambodianLocations.filter((location) => {
    const locationName = language === "km" ? location.nameKm : location.name
    const provinceName = language === "km" ? location.provinceKm : location.province

    const matchesSearch =
      locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      provinceName.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesProvince = !selectedProvince || provinceName === selectedProvince

    return matchesSearch && matchesProvince
  })

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          borderRadius: "16px",
          width: "100%",
          maxWidth: "500px",
          maxHeight: "80vh",
          overflow: "hidden",
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: "20px",
            borderBottom: "1px solid #e5e7eb",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: "18px",
              fontWeight: "bold",
              color: "#1f2937",
            }}
          >
            {t.selectLocation}
          </h3>
          <button
            onClick={onClose}
            style={{
              backgroundColor: "transparent",
              border: "none",
              fontSize: "24px",
              cursor: "pointer",
              color: "#6b7280",
            }}
          >
            ×
          </button>
        </div>

        {/* Search and Filter */}
        <div style={{ padding: "20px", borderBottom: "1px solid #e5e7eb" }}>
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
              marginBottom: "12px",
            }}
          />

          <select
            value={selectedProvince}
            onChange={(e) => setSelectedProvince(e.target.value)}
            style={{
              width: "100%",
              padding: "12px",
              borderRadius: "8px",
              border: "1px solid #d1d5db",
              fontSize: "14px",
              backgroundColor: "white",
            }}
          >
            <option value="">{t.allProvinces}</option>
            {provinces.map((province) => (
              <option key={province} value={province}>
                {province}
              </option>
            ))}
          </select>
        </div>

        {/* Current Location Indicator */}
        <div
          style={{
            padding: "12px 20px",
            backgroundColor: "#f3f4f6",
            fontSize: "12px",
            color: "#6b7280",
          }}
        >
          {t.currentLocation}: {currentLocation}
        </div>

        {/* Location List */}
        <div
          style={{
            maxHeight: "400px",
            overflowY: "auto",
          }}
        >
          {filteredLocations.map((location, index) => {
            const locationName = language === "km" ? location.nameKm : location.name
            const provinceName = language === "km" ? location.provinceKm : location.province
            const isCurrentLocation = currentLocation.includes(locationName)

            return (
              <div
                key={index}
                onClick={() => onLocationSelect(location)}
                style={{
                  padding: "16px 20px",
                  borderBottom: "1px solid #f3f4f6",
                  cursor: "pointer",
                  backgroundColor: isCurrentLocation ? "#dbeafe" : "white",
                  transition: "background-color 0.2s ease",
                }}
                onMouseEnter={(e) => {
                  if (!isCurrentLocation) {
                    e.currentTarget.style.backgroundColor = "#f9fafb"
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isCurrentLocation) {
                    e.currentTarget.style.backgroundColor = "white"
                  }
                }}
              >
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div>
                    <div
                      style={{
                        fontSize: "16px",
                        fontWeight: "500",
                        color: "#1f2937",
                        marginBottom: "2px",
                      }}
                    >
                      {locationName}
                      {isCurrentLocation && (
                        <span
                          style={{
                            marginLeft: "8px",
                            fontSize: "12px",
                            color: "#2563eb",
                            fontWeight: "normal",
                          }}
                        >
                          (Current)
                        </span>
                      )}
                    </div>
                    <div
                      style={{
                        fontSize: "14px",
                        color: "#6b7280",
                      }}
                    >
                      {provinceName}
                    </div>
                  </div>
                  <div
                    style={{
                      fontSize: "12px",
                      color: "#9ca3af",
                    }}
                  >
                    📍
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredLocations.length === 0 && (
          <div
            style={{
              padding: "40px 20px",
              textAlign: "center",
              color: "#6b7280",
            }}
          >
            No locations found matching your search.
          </div>
        )}
      </div>
    </div>
  )
}
