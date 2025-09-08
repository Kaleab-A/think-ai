"use client"

import { Info, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface Integration {
  id: string
  name: string
  description: string
  icons: string[]
  connected: boolean
  hasCalendarManagement?: boolean
}

const integrations: Integration[] = [
  {
    id: "google",
    name: "Google Meet & Calendar",
    description: "Include Google Meet details in your Meetly events and sync with Google Calendar.",
    icons: ["🎥", "📅"], // Using emojis as placeholders for the actual icons
    connected: true,
    hasCalendarManagement: true,
  },
  {
    id: "zoom",
    name: "Zoom",
    description: "Include Zoom details in your Meetly events.",
    icons: ["📹"],
    connected: true,
    hasCalendarManagement: false,
  },
  {
    id: "outlook",
    name: "Outlook Calendar",
    description: "Outlook Calendar integration for scheduling and reminders.",
    icons: ["📧"],
    connected: true,
    hasCalendarManagement: true,
  },
  {
    id: "teams",
    name: "Microsoft Teams",
    description: "Microsoft Teams integration for video conferencing and collaboration.",
    icons: ["👥"],
    connected: true,
    hasCalendarManagement: false,
  },
]

export default function IntegrationsPage() {
  const handleConnect = (integrationId: string) => {
    console.log(`Connecting ${integrationId}`)
  }

  const handleManageCalendars = (integrationId: string) => {
    console.log(`Managing calendars for ${integrationId}`)
  }

  const handleDisconnect = (integrationId: string) => {
    console.log(`Disconnecting ${integrationId}`)
  }

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold text-gray-900">Integrations & apps</h1>
          <Info className="h-5 w-5 text-gray-400" />
        </div>
        <p className="text-gray-600">Connect all your apps directly from here. You need to connect these apps</p>
      </div>

      {/* Integrations List */}
      <div className="space-y-4">
        {integrations.map((integration) => (
          <Card key={integration.id} className="border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                {/* Left side - Icon, Name, Description */}
                <div className="flex items-start gap-4 flex-1">
                  {/* Icons */}
                  <div className="flex items-center gap-1">
                    {integration.icons.map((icon, index) => (
                      <div
                        key={index}
                        className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center text-lg"
                      >
                        {icon}
                      </div>
                    ))}
                    {integration.icons.length > 1 && (
                      <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center ml-1">
                        <Plus className="h-3 w-3 text-gray-600" />
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="space-y-1 flex-1">
                    <h3 className="text-lg font-semibold text-gray-900">{integration.name}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed max-w-2xl">{integration.description}</p>
                  </div>
                </div>

                {/* Right side - Action Buttons */}
                <div className="flex flex-col gap-2 ml-4">
                  {integration.connected ? (
                    <>
                      <Badge
                        variant="outline"
                        className="px-4 py-2 text-blue-600 border-blue-200 bg-blue-50 hover:bg-blue-100 cursor-pointer"
                        onClick={() => handleDisconnect(integration.id)}
                      >
                        Connected
                      </Badge>
                      {integration.hasCalendarManagement && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleManageCalendars(integration.id)}
                          className="text-blue-600 border-blue-200 hover:bg-blue-50"
                        >
                          Manage calendars
                        </Button>
                      )}
                    </>
                  ) : (
                    <Button
                      onClick={() => handleConnect(integration.id)}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Connect
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Add more integrations hint */}
      <div className="text-center py-8">
        <p className="text-sm text-gray-500">
          Need more integrations? Contact support to request additional app connections.
        </p>
      </div>
    </div>
  )
}
