"use client"

import { useState } from "react"
import { Calendar, ChevronDown, Info, Mail, Trash2, Video } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible"

interface Meeting {
  id: string
  time: string
  title: string
  eventType: string
  email?: string
  location?: string
  questions?: string
  date: string
}

const meetingsData: Meeting[] = [
  {
    id: "1",
    time: "9:00 AM – 9:30 AM",
    title: "bdcudc",
    eventType: "Test",
    email: "mashiur.khan@vanderbilt.edu",
    location: "Google Meet",
    questions: "khhci",
    date: "Monday, 16 June 2025",
  },
  {
    id: "2",
    time: "12:00 PM – 12:30 PM",
    title: "ddcdc",
    eventType: "Test",
    date: "Monday, 16 June 2025",
  },
  {
    id: "3",
    time: "4:30 PM – 5:00 PM",
    title: "Outlook Int",
    eventType: "Test",
    date: "Monday, 16 June 2025",
  },
]

export default function MeetingsDashboard() {
  const [expandedMeeting, setExpandedMeeting] = useState<string | null>("1")

  const handleCancelMeeting = (meetingId: string) => {
    console.log(`Cancelling meeting ${meetingId}`)
  }

  const groupedMeetings = meetingsData.reduce(
    (acc, meeting) => {
      if (!acc[meeting.date]) {
        acc[meeting.date] = []
      }
      acc[meeting.date].push(meeting)
      return acc
    },
    {} as Record<string, Meeting[]>,
  )

  return (
    <div className="w-full max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2">
        <h1 className="text-2xl font-bold text-gray-900">Meetings</h1>
        <Info className="h-5 w-5 text-gray-400" />
      </div>

      {/* Tabs */}
      <Tabs defaultValue="upcoming" className="w-full">
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
          <TabsTrigger value="past">Past</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>

        <TabsContent value="upcoming" className="space-y-6 mt-6">
          {Object.entries(groupedMeetings).map(([date, meetings]) => (
            <div key={date} className="space-y-4">
              {/* Date Header */}
              <div className="border-b border-gray-200 pb-2">
                <h2 className="text-lg font-semibold text-gray-900">{date}</h2>
              </div>

              {/* Meetings for this date */}
              <div className="space-y-4">
                {meetings.map((meeting) => (
                  <Card key={meeting.id} className="border border-gray-200 shadow-sm">
                    <CardContent className="p-0">
                      <Collapsible
                        open={expandedMeeting === meeting.id}
                        onOpenChange={(open) => setExpandedMeeting(open ? meeting.id : null)}
                      >
                        {/* Meeting Header */}
                        <div className="flex items-center justify-between p-4">
                          <div className="flex items-center gap-4">
                            {/* Time Indicator */}
                            <div className="w-3 h-3 bg-blue-500 rounded-full flex-shrink-0" />

                            <div className="space-y-1">
                              <div className="flex items-center gap-3">
                                <span className="font-medium text-gray-900">{meeting.time}</span>
                                <span className="font-semibold text-gray-900">{meeting.title}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className="text-sm text-gray-600">Event type</span>
                                <Badge variant="secondary" className="text-xs">
                                  {meeting.eventType}
                                </Badge>
                              </div>
                            </div>
                          </div>

                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="outline" size="sm" className="flex items-center gap-2">
                                More
                                <ChevronDown className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem>Edit Meeting</DropdownMenuItem>
                              <DropdownMenuItem>Copy Link</DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">Cancel Meeting</DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        {/* Expanded Content */}
                        <CollapsibleContent>
                          <Separator />
                          <div className="p-4 space-y-4 bg-gray-50/50">
                            <div className="flex items-start justify-between">
                              <div className="space-y-4 flex-1">
                                {/* Email */}
                                {meeting.email && (
                                  <div className="space-y-1">
                                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                                      EMAIL
                                    </h4>
                                    <div className="flex items-center gap-2 text-sm text-gray-700">
                                      <Mail className="h-4 w-4" />
                                      {meeting.email}
                                    </div>
                                  </div>
                                )}

                                {/* Location */}
                                {meeting.location && (
                                  <div className="space-y-1">
                                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                                      LOCATION
                                    </h4>
                                    <div className="flex items-center gap-2 text-sm text-blue-600">
                                      <Video className="h-4 w-4" />
                                      {meeting.location}
                                    </div>
                                  </div>
                                )}

                                {/* Questions */}
                                {meeting.questions && (
                                  <div className="space-y-1">
                                    <h4 className="text-sm font-semibold text-gray-900 uppercase tracking-wide">
                                      QUESTIONS
                                    </h4>
                                    <p className="text-sm text-gray-700">{meeting.questions}</p>
                                  </div>
                                )}
                              </div>

                              {/* Cancel Button */}
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleCancelMeeting(meeting.id)}
                                className="flex items-center gap-2 text-red-600 border-red-200 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        </CollapsibleContent>
                      </Collapsible>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </TabsContent>

        <TabsContent value="past" className="space-y-4">
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No past meetings to display</p>
          </div>
        </TabsContent>

        <TabsContent value="cancelled" className="space-y-4">
          <div className="text-center py-8 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No cancelled meetings to display</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
