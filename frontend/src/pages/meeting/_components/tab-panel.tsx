import { FC, useState } from "react";
import EmptyPanel from "./empty-panel";
import MeetingCard from "./meeting-card";
import { MeetingType, PeriodType } from "@/types/api.type";
import { Loader } from "@/components/loader";
import { PeriodEnum } from "@/hooks/use-meeting-filter";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cancelMeetingMutationFn } from "@/lib/api";
import { toast } from "sonner";
import { format, parseISO } from "date-fns";

interface PropsType {
  isFetching: boolean;
  period: PeriodType;
  meetings: MeetingType[];
}

const TabPanel: FC<PropsType> = ({ period, meetings, isFetching }) => {
  const [pendingMeetingId, setPendingMeetingId] = useState<string | null>(null);

  const queryClient = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationFn: cancelMeetingMutationFn,
  });

  const handleCancel = (meetingId: string) => {
    setPendingMeetingId(meetingId);
    mutate(meetingId, {
      onSuccess: (response) => {
        queryClient.invalidateQueries({
          queryKey: ["userMeetings"],
        });
        setPendingMeetingId(null);
        toast.success(`${response.message}`);
      },
      onError: () => {
        setPendingMeetingId(null);
        toast.success("Failed to cancel meeting");
      },
    });
  };

  return (
    <div className="w-full">
      {isFetching ? (
        <div className="flex items-center justify-center min-h-[15vh]">
          <Loader size="lg" color="black" />
        </div>
      ) : meetings?.length === 0 ? (
        <EmptyPanel
          title={`No ${
            period === PeriodEnum.UPCOMING
              ? "Upcoming"
              : period === PeriodEnum.PAST
              ? "Past"
              : "Cancelled"
          } Meeting`}
        />
      ) : (
        <>
          {(() => {
            const grouped: Record<string, MeetingType[]> = {};
            meetings.forEach((m) => {
              const dateStr = format(parseISO(m.startTime), "EEEE, d MMMM yyyy");
              grouped[dateStr] = grouped[dateStr] ? [...grouped[dateStr], m] : [m];
            });

            return Object.entries(grouped).map(([date, items]) => (
              <div key={date} className="space-y-4 mb-6 pt-4">
                <h2 className="text-lg font-semibold pl-2">{date}</h2>

                <div className="space-y-4">
                  {items.map((meeting) => (
                    <MeetingCard
                      key={meeting.id}
                      period={period}
                      isPending={pendingMeetingId == meeting.id ? isPending : false}
                      meeting={meeting}
                      onCancel={() => handleCancel(meeting.id)}
                    />
                  ))}
                </div>
              </div>
            ));
          })()}
        </>
      )}
    </div>
  );
};

export default TabPanel;
