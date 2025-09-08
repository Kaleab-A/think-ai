import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import TabHeader from "./_components/tab-header";
import { Separator } from "@/components/ui/separator";
import TabPanel from "./_components/tab-panel";
import useMeetingFilter from "@/hooks/use-meeting-filter";
import PageTitle from "@/components/PageTitle";
import { getUserMeetingsQueryFn } from "@/lib/api";
import { ErrorAlert } from "@/components/ErrorAlert";
import { Loader } from "@/components/loader";

const Meetings = () => {
  const { period } = useMeetingFilter();

  const { data, isLoading, isFetching, isError, error } = useQuery({
    queryKey: ["userMeetings", period],
    queryFn: () => getUserMeetingsQueryFn(period),
  });

  const meetings = data?.meetings || [];

  return (
    <div className="flex flex-col !gap-3">
      <PageTitle title="Meetings" />

      <ErrorAlert isError={isError} error={error} />

      {isLoading || isError ? (
        <div className="flex items-center justify-center min-h-[30vh]">
          <Loader size="lg" color="black" />
        </div>
      ) : (
        <div className="w-full">
          <Card
            className="p-0 shadow-[0_1px_6px_0_rgb(0_0_0_/_10%)]
        min-h-[220px] border border-[#D4E16F)] bg-white rounded-[8px]
        "
          >
            <CardContent className="p-0 pb-3">
              <TabHeader />
              <Separator className="border-[#D4E16F]" />
              <TabPanel
                isFetching={isFetching}
                meetings={meetings}
                period={period}
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Meetings;
