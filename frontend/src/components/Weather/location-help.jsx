"use client"
import { Button } from "../ui/Button"
import { Badge } from "../ui/Badge"
import { Info, MapPin, Settings, Shield } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog"

export function LocationHelp() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="text-muted-foreground">
          <Info className="h-4 w-4 mr-1" />
          Location Help
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-green-600" />
            Location Settings Help
          </DialogTitle>
          <DialogDescription>Learn how to enable location access for accurate weather data</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Shield className="h-4 w-4" />
              Why Location Access?
            </h4>
            <p className="text-sm text-blue-700">
              Location access helps provide accurate weather data for your specific farm location, ensuring you get the
              most relevant farming recommendations.
            </p>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold flex items-center gap-2">
              <Settings className="h-4 w-4" />
              How to Enable Location Access:
            </h4>

            <div className="space-y-2 text-sm">
              <div className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">
                  1
                </Badge>
                <div>
                  <strong>Chrome/Edge:</strong> Click the location icon in the address bar, then select "Always allow"
                  for this site.
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">
                  2
                </Badge>
                <div>
                  <strong>Firefox:</strong> Click the shield icon, then "Allow Location Access".
                </div>
              </div>

              <div className="flex items-start gap-2">
                <Badge variant="outline" className="mt-0.5">
                  3
                </Badge>
                <div>
                  <strong>Safari:</strong> Go to Safari → Settings → Websites → Location, then set this site to "Allow".
                </div>
              </div>
            </div>
          </div>

          <div className="p-3 bg-green-50 rounded-lg border border-green-200">
            <p className="text-sm text-green-700">
              <strong>Alternative:</strong> You can always select your farm location manually from the predefined
              locations list.
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
