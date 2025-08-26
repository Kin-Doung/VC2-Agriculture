"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/Card"
import { Button } from "../ui/Button"
import { Badge } from "../ui/Badge"
import { MapPin, Search, Navigation, Check } from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandItem, CommandList } from "../ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover"
import { LocationHelp } from "./location-help"

const predefinedLocations = [
  { name: "Phnom Penh", lat: 11.562108, lon: 104.888535 },
  { name: "Battambang", lat: 13.095453, lon: 103.182907 },
  { name: "Siem Reap", lat: 13.364047, lon: 103.860313 },
  { name: "Kampot", lat: 10.594242, lon: 104.164032 },
  { name: "Preah Sihanouk", lat: 10.627543, lon: 103.522141 },
  { name: "Kampong Cham", lat: 12.2500, lon: 105.4500 },
  { name: "Kampong Chhnang", lat: 12.2500, lon: 104.6667 },
  { name: "Kampong Thom", lat: 12.7000, lon: 104.9833 },
  { name: "Kandal", lat: 11.5000, lon: 105.0000 },
  { name: "Koh Kong", lat: 11.6167, lon: 102.9667 },
  { name: "Kratie", lat: 12.5000, lon: 106.0000 },
  { name: "Mondulkiri", lat: 12.5000, lon: 107.0000 },
  { name: "Phnom Penh", lat: 11.562108, lon: 104.888535 },
  { name: "Preah Vihear", lat: 13.6500, lon: 104.6667 },
  { name: "Pursat", lat: 12.5333, lon: 103.8333 },
  { name: "Ratanakiri", lat: 13.5000, lon: 107.0000 },
  { name: "Siem Reap", lat: 13.364047, lon: 103.860313 },
  { name: "Sihanoukville", lat: 10.6167, lon: 103.5167 },
  { name: "Stung Treng", lat: 13.5333, lon: 105.9667 },
  { name: "Svay Rieng", lat: 11.5000, lon: 105.7500 },
  { name: "Takeo", lat: 10.9833, lon: 104.7500 },
  { name: "Tboung Khmum", lat: 12.0000, lon: 106.0000 },
];


export function LocationSelector({ currentLocation, onLocationChange }) {
  const [open, setOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const [isDetectingLocation, setIsDetectingLocation] = useState(false)
  const [locationError, setLocationError] = useState("")

  const handleLocationSelect = (location) => {
    onLocationChange(location)
    setOpen(false)
  }

  const detectCurrentLocation = () => {
    setIsDetectingLocation(true)
    setLocationError("")

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser")
      setIsDetectingLocation(false)
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const newLocation = {
          name: "Current GPS Location",
          lat: position.coords.latitude,
          lon: position.coords.longitude,
        }
        onLocationChange(newLocation)
        setIsDetectingLocation(false)
        setLocationError("")
      },
      (error) => {
        let errorMessage = ""
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = "Location access denied. Please enable location permissions or select a location manually."
            break
          case error.POSITION_UNAVAILABLE:
            errorMessage = "Location information unavailable. Please select a location manually."
            break
          case error.TIMEOUT:
            errorMessage = "Location request timed out. Please try again or select manually."
            break
          default:
            errorMessage = "Unable to detect location. Please select a location manually."
            break
        }
        setLocationError(errorMessage)
        setIsDetectingLocation(false)
      },
      {
        timeout: 10000,
        enableHighAccuracy: true,
        maximumAge: 300000, // 5 minutes
      },
    )
  }

  const filteredLocations = predefinedLocations.filter((location) =>
    location.name.toLowerCase().includes(searchValue.toLowerCase()),
  )

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <MapPin className="h-5 w-5 text-green-600" />
              Location Settings
            </CardTitle>
            <CardDescription>Select your farm location for accurate weather data</CardDescription>
          </div>
          <LocationHelp />
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Current Location Display */}
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800">
                <MapPin className="h-3 w-3 mr-1" />
                Active Location
              </Badge>
            </div>
            <div className="font-medium">{currentLocation.name}</div>
            <div className="text-sm text-muted-foreground">
              {currentLocation.lat.toFixed(4)}, {currentLocation.lon.toFixed(4)}
            </div>
          </div>

          {/* Location Selection */}
          <div className="flex gap-2">
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-[200px] justify-start bg-transparent">
                  <Search className="h-4 w-4 mr-2" />
                  Change Location
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[300px] p-0">
                <Command>
                  <input
                    type="text"
                    placeholder="Search farm locations..."
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                    className="command-input bg-gray-100 border"
                  />
                  <CommandList>
                    <CommandEmpty>No locations found.</CommandEmpty>
                    <CommandGroup heading="Farm Locations">
                      {filteredLocations.map((location) => (
                        <CommandItem
                          key={`${location.lat}-${location.lon}`}
                          value={location.name}
                          onSelect={() => handleLocationSelect(location)}
                        >
                          <MapPin className="h-4 w-4 mr-2" />
                          <div className="flex-1">
                            <div className="font-medium">{location.name}</div>
                            <div className="text-xs text-muted-foreground">
                              {location.lat.toFixed(4)}, {location.lon.toFixed(4)}
                            </div>
                          </div>
                          {currentLocation.name === location.name && <Check className="h-4 w-4 text-green-600" />}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>

            <Button variant="outline" onClick={detectCurrentLocation} disabled={isDetectingLocation}>
              <Navigation className={`h-4 w-4 mr-2 ${isDetectingLocation ? "animate-spin" : ""}`} />
              {isDetectingLocation ? "Detecting..." : "Use GPS"}
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {locationError && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-2">
              <div className="text-red-600 mt-0.5">⚠️</div>
              <div>
                <div className="font-medium text-red-800 text-sm">Location Detection Failed</div>
                <div className="text-red-700 text-sm mt-1">{locationError}</div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
