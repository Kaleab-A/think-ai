import { useQuery } from "@tanstack/react-query";
import PageTitle from "@/components/PageTitle";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import WeeklyHoursRow from "./_components/weekly-hours";
import { Clock } from "lucide-react";
import { getUserAvailabilityQueryFn } from "@/lib/api";
import { Loader } from "@/components/loader";
import { ErrorAlert } from "@/components/ErrorAlert";

const Availability = () => {
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["user_availability"],
    queryFn: getUserAvailabilityQueryFn,
  });

  const availability = data?.availability;

  const days = availability?.days || [];
  const timeGap = availability?.timeGap || 30;

  return (
    <div className="flex flex-col !gap-3">
      <PageTitle title="Availability" />

      <ErrorAlert isError={isError} error={error} />

      <div className="w-full">
        {isLoading || isError ? (
          <div className="flex items-center justify-center min-h-[30vh]">
            <Loader size="lg" color="black" />
          </div>
        ) : (
          <Card className="border border-border shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                <Clock className="h-5 w-5" />
                Weekly hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="w-full max-w-lg">
                <WeeklyHoursRow days={days} timeGap={timeGap} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Availability;
