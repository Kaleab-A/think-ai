import { useState } from "react";
import { ChevronDown, Trash2, Mail, Video, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MeetingType, PeriodType } from "@/types/api.type";
import { format, parseISO } from "date-fns";
import { locationOptions } from "@/lib/types";
import { PeriodEnum } from "@/hooks/use-meeting-filter";
import { Loader } from "@/components/loader";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const MeetingCard = (props: {
  meeting: MeetingType;
  period: PeriodType;
  isPending: boolean;
  onCancel: () => void;
}) => {
  const { meeting, isPending, period, onCancel } = props;

  const [open, setOpen] = useState(false);

  // Format the time
  const startTime = parseISO(meeting.startTime);
  const endTime = parseISO(meeting.endTime);
  const formattedTime = `${format(startTime, "h:mm a")} – ${format(
    endTime,
    "h:mm a"
  )}`;

  const locationOption = locationOptions.find(
    (option) => option.value === meeting.event.locationType
  );

  return (
    <Card className="border border-border shadow-sm">
      <CardContent className="p-0">
        <Collapsible open={open} onOpenChange={setOpen}>
          {/* Header */}
          <div className="flex items-center justify-between p-4" role="button" onClick={() => setOpen(!open)}>
            <div className="flex items-center gap-4">
              {/* Dot */}
              <div
                className={cn(
                  "w-3 h-3 rounded-full flex-shrink-0",
                  period === PeriodEnum.CANCELLED ? "bg-destructive" : "bg-blue-500"
                )}
              />

              <div className="space-y-1">
                <div className="flex items-center gap-3">
                  <span className="font-medium">{formattedTime}</span>
                  <span className="font-semibold">{meeting.guestName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="secondary" className="text-xs">
                    {meeting.event.title}
                  </Badge>
                </div>
              </div>
            </div>

            {/* More dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  More
                  <ChevronDown className={cn("h-4 w-4 transition-transform", open && "rotate-180")}/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem
                  onClick={() => {
                    navigator.clipboard.writeText(meeting.meetLink).then(() => {
                      toast.success("Meeting link copied");
                    });
                  }}
                  className="flex items-center gap-2"
                >
                  <Copy className="h-4 w-4" />
                  Copy Link
                </DropdownMenuItem>
                {period === PeriodEnum.UPCOMING && (
                  <DropdownMenuItem className="text-red-600" onClick={onCancel}>
                    <Trash2 className="h-4 w-4" />
                    Cancel Meeting
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Details */}
          <CollapsibleContent>
            <div className="border-t border-border p-4 bg-muted/50">
              <div className="flex flex-col-reverse md:flex-row gap-6">
                {/* Cancel button on upcoming */}
                {period === PeriodEnum.UPCOMING && (
                  <div className="md:w-1/4">
                    <Button
                      variant="outline"
                      className="w-full text-red-600 border-red-200 hover:bg-red-50 flex items-center gap-2"
                      disabled={isPending}
                      onClick={onCancel}
                    >
                      {isPending ? <Loader color="black" /> : <><Trash2 className="h-4 w-4" /> Cancel</>}
                    </Button>
                  </div>
                )}

                <div className="flex-1 space-y-4">
                  {/* Email */}
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-foreground/80">Email</h4>
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4" />
                      {meeting.guestEmail}
                    </div>
                  </div>

                  {/* Location */}
                  {locationOption && (
                    <div>
                      <h4 className="text-sm font-semibold uppercase tracking-wide text-foreground/80">Location</h4>
                      <div className="flex items-center gap-2 text-sm text-blue-600">
                        {locationOption.logo ? (
                          <img src={locationOption.logo as string} alt={locationOption.label} className="w-5 h-5" />
                        ) : (
                          <Video className="h-4 w-4" />
                        )}
                        {locationOption.label}
                      </div>
                    </div>
                  )}

                  {/* Questions */}
                  <div>
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-foreground/80">Questions</h4>
                    <p className="text-sm">
                      {meeting.additionalInfo ? (
                        meeting.additionalInfo
                      ) : (
                        <span className="text-muted-foreground">Nothing</span>
                      )}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
};

export default MeetingCard;
