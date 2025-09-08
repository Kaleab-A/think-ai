"use client"

import { Calendar, Copy, Link } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"

const bookingData = [
  {
    id: 1,
    title: "TeamsTest",
    duration: "30 minutes",
    isActive: true,
    color: "bg-slate-500",
  },
  {
    id: 2,
    title: "balezoom",
    duration: "30 minutes",
    isActive: false,
    color: "bg-purple-500",
  },
  {
    id: 3,
    title: "Test",
    duration: "30 minutes",
    isActive: false,
    color: "bg-purple-500",
  },
]

export default function BookingCards() {
  const handleCopyLink = (title: string) => {
    navigator.clipboard.writeText(`https://example.com/booking/${title.toLowerCase()}`)
  }

  const handleToggleStatus = (id: number) => {
    console.log(`Toggling status for booking ${id}`)
  }

  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bookingData.map((booking) => (
          <Card
            key={booking.id}
            className="group hover:shadow-lg transition-all duration-300 border-0 shadow-sm bg-white"
          >
            {/* Colored top border */}
            <div className={`h-1 w-full ${booking.color} rounded-t-lg`} />

            <CardHeader className="pb-4">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-gray-50 rounded-lg group-hover:bg-gray-100 transition-colors">
                    <Calendar className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 group-hover:text-gray-700 transition-colors">
                      {booking.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="secondary" className="text-xs font-medium bg-gray-100 text-gray-600">
                        {booking.duration}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="pt-0">
              <div className="space-y-4">
                {/* View booking page link */}
                <Button
                  variant="link"
                  className="p-0 h-auto text-blue-600 hover:text-blue-700 font-medium text-sm flex items-center gap-2"
                >
                  <Link className="h-4 w-4" />
                  View booking page
                </Button>

                {/* Bottom actions */}
                <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleCopyLink(booking.title)}
                    className="text-gray-600 hover:text-gray-900 hover:bg-gray-50 flex items-center gap-2"
                  >
                    <Copy className="h-4 w-4" />
                    Copy link
                  </Button>

                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600 font-medium">
                      {booking.isActive ? "Turn On" : "Turn Off"}
                    </span>
                    <Switch
                      checked={booking.isActive}
                      onCheckedChange={() => handleToggleStatus(booking.id)}
                      className="data-[state=checked]:bg-green-500"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
