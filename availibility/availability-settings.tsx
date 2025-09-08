"use client"

import { useState } from "react"
import { Clock, Info, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"

interface DayAvailability {
  day: string
  dayCode: string
  enabled: boolean
  startTime: string
  endTime: string
}

const initialAvailability: DayAvailability[] = [
  { day: "SUN", dayCode: "sunday", enabled: false, startTime: "09:00", endTime: "17:00" },
  { day: "MON", dayCode: "monday", enabled: true, startTime: "09:00", endTime: "17:00" },
  { day: "TUE", dayCode: "tuesday", enabled: true, startTime: "09:00", endTime: "17:00" },
  { day: "WED", dayCode: "wednesday", enabled: true, startTime: "09:00", endTime: "17:00" },
  { day: "THU", dayCode: "thursday", enabled: true, startTime: "09:00", endTime: "17:00" },
  { day: "FRI", dayCode: "friday", enabled: true, startTime: "09:00", endTime: "17:00" },
  { day: "SAT", dayCode: "saturday", enabled: false, startTime: "09:00", endTime: "17:00" },
]

export default function AvailabilitySettings() {
  const [timeGap, setTimeGap] = useState("30")
  const [availability, setAvailability] = useState<DayAvailability[]>(initialAvailability)

  const handleDayToggle = (dayCode: string, enabled: boolean) => {
    setAvailability((prev) => prev.map((day) => (day.dayCode === dayCode ? { ...day, enabled } : day)))
  }

  const handleTimeChange = (dayCode: string, field: "startTime" | "endTime", value: string) => {
    setAvailability((prev) => prev.map((day) => (day.dayCode === dayCode ? { ...day, [field]: value } : day)))
  }

  const handleRemoveTimeSlot = (dayCode: string) => {
    setAvailability((prev) => prev.map((day) => (day.dayCode === dayCode ? { ...day, enabled: false } : day)))
  }

  const handleSaveChanges = () => {
    console.log("Saving availability:", { timeGap, availability })
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
        <Info className="h-5 w-5 text-gray-400" />
      </div>

      {/* Main Card */}
      <Card className="border border-gray-200 shadow-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold">
            <Clock className="h-5 w-5" />
            Weekly hours
          </CardTitle>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Time Gap Setting */}
          <div className="flex items-center gap-4">
            <Label htmlFor="timeGap" className="text-sm font-medium text-gray-700 min-w-[120px]">
              Time Gap (mins):
            </Label>
            <Input
              id="timeGap"
              type="number"
              value={timeGap}
              onChange={(e) => setTimeGap(e.target.value)}
              className="w-20 text-center"
              min="0"
              max="120"
            />
          </div>

          <Separator />

          {/* Days of Week */}
          <div className="space-y-4">
            {availability.map((day) => (
              <div key={day.dayCode} className="flex items-center gap-4">
                {/* Day Toggle */}
                <div className="flex items-center gap-3 min-w-[80px]">
                  <Switch
                    checked={day.enabled}
                    onCheckedChange={(enabled) => handleDayToggle(day.dayCode, enabled)}
                    className="data-[state=checked]:bg-blue-600"
                  />
                  <span className="text-sm font-medium text-gray-900 w-8">{day.day}</span>
                </div>

                {/* Time Inputs or Unavailable */}
                <div className="flex-1 flex items-center gap-2">
                  {day.enabled ? (
                    <>
                      <Input
                        type="time"
                        value={day.startTime}
                        onChange={(e) => handleTimeChange(day.dayCode, "startTime", e.target.value)}
                        className="w-24 text-center"
                      />
                      <span className="text-gray-500">–</span>
                      <Input
                        type="time"
                        value={day.endTime}
                        onChange={(e) => handleTimeChange(day.dayCode, "endTime", e.target.value)}
                        className="w-24 text-center"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveTimeSlot(day.dayCode)}
                        className="p-1 h-8 w-8 text-gray-400 hover:text-gray-600 hover:bg-gray-100"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  ) : (
                    <span className="text-sm text-gray-500">Unavailable</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Save Button */}
          <div className="pt-4">
            <Button onClick={handleSaveChanges} className="bg-blue-600 hover:bg-blue-700 text-white px-8">
              Save changes
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
